import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { JobIngestRequestDto, JobDetailDto, JdStructDto } from "../common/dto";
import axios from "axios";
import * as cheerio from "cheerio";

export interface JobAnalysis {
  company?: string;
  title?: string;
  location?: string;
  skills: string[];
  requirements: string[];
  niceToHave: string[];
  seniority?: string;
}

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService
  ) {}

  async ingestJob(request: JobIngestRequestDto): Promise<{ jobId: string }> {
    let jdText: string;
    let rawHtmlUri: string | undefined;

    if (request.url) {
      // Fetch content from URL
      const response = await axios.get(request.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      // Store raw HTML
      const htmlPath = `jobs/raw/${Date.now()}.html`;
      rawHtmlUri = await this.storage.save(
        Buffer.from(response.data),
        htmlPath,
        "text/html"
      );

      // Extract text content
      jdText = this.extractTextFromHtml(response.data);
    } else if (request.rawText) {
      jdText = request.rawText.trim();
    } else {
      throw new Error("Either url or rawText must be provided");
    }

    // Analyze the JD to extract structured data
    const analysis = await this.analyzeJobDescription(jdText);

    // Create job posting record
    const jobPosting = await this.prisma.jobPosting.create({
      data: {
        source: request.url ? "url" : "manual",
        url: request.url,
        company: analysis.company,
        title: analysis.title,
        location: analysis.location,
        jdText,
        jdStructJson: {
          skills: analysis.skills,
          requirements: analysis.requirements,
          niceToHave: analysis.niceToHave,
          seniority: analysis.seniority,
        },
        rawHtmlUri,
      },
    });

    return { jobId: jobPosting.id };
  }

  async getJob(id: string): Promise<JobDetailDto> {
    const job = await this.prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    const jdStruct = job.jdStructJson as any;

    return {
      id: job.id,
      company: job.company || undefined,
      title: job.title || undefined,
      location: job.location || undefined,
      jdText: job.jdText,
      jdStruct: jdStruct
        ? {
            skills: jdStruct.skills || [],
            requirements: jdStruct.requirements || [],
            niceToHave: jdStruct.niceToHave || [],
            seniority: jdStruct.seniority,
          }
        : undefined,
      firstSeenAt: job.createdAt.toISOString(),
    };
  }

  private extractTextFromHtml(html: string): string {
    const $ = cheerio.load(html);

    // Remove script and style elements
    $("script, style").remove();

    // Extract text content
    return $("body").text().replace(/\s+/g, " ").trim();
  }

  private async analyzeJobDescription(jdText: string): Promise<JobAnalysis> {
    // Simple keyword-based analysis for V0
    // In V1, this will be replaced with LLM-based analysis

    const text = jdText.toLowerCase();

    // Extract common skills (basic keyword matching)
    const commonSkills = [
      "javascript",
      "typescript",
      "python",
      "java",
      "react",
      "angular",
      "vue",
      "node.js",
      "express",
      "nestjs",
      "postgresql",
      "mongodb",
      "mysql",
      "aws",
      "azure",
      "gcp",
      "docker",
      "kubernetes",
      "git",
      "agile",
      "scrum",
      "product management",
      "project management",
      "leadership",
      "communication",
      "sql",
      "nosql",
      "rest",
      "graphql",
      "microservices",
      "devops",
    ];

    const skills = commonSkills.filter((skill) =>
      text.includes(skill.toLowerCase())
    );

    // Extract basic company info (very simple extraction)
    const lines = jdText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let title = "";
    let company = "";
    let location = "";

    // Try to extract title from first few lines
    for (const line of lines.slice(0, 5)) {
      if (
        line.toLowerCase().includes("developer") ||
        line.toLowerCase().includes("engineer") ||
        line.toLowerCase().includes("manager") ||
        line.toLowerCase().includes("analyst")
      ) {
        title = line;
        break;
      }
    }

    // Extract requirements (lines starting with common requirement indicators)
    const requirements: string[] = [];
    const niceToHave: string[] = [];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (
        (lowerLine.includes("require") ||
          lowerLine.includes("must have") ||
          lowerLine.includes("essential")) &&
        line.length < 200
      ) {
        requirements.push(line);
      } else if (
        (lowerLine.includes("nice to have") ||
          lowerLine.includes("preferred") ||
          lowerLine.includes("bonus")) &&
        line.length < 200
      ) {
        niceToHave.push(line);
      }
    }

    // Determine seniority level
    let seniority = "";
    if (text.includes("senior") || text.includes("lead")) {
      seniority = "Senior";
    } else if (text.includes("junior") || text.includes("entry")) {
      seniority = "Junior";
    } else if (text.includes("mid") || text.includes("intermediate")) {
      seniority = "Mid";
    }

    return {
      company: company || undefined,
      title: title || undefined,
      location: location || undefined,
      skills,
      requirements: requirements.slice(0, 10), // Limit to 10
      niceToHave: niceToHave.slice(0, 5), // Limit to 5
      seniority: seniority || undefined,
    };
  }
}
