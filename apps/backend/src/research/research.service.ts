import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { AgentOrchestrator, ResearchRequest } from "../agents";
import {
  CompanySnapshot,
  CompanyBrochure,
  CompanyNewsItemDto,
  CompanyBrochureSectionsDto,
  CompanyTimelineItemDto,
} from "../common/dto";

@Injectable()
export class ResearchService {
  private agentOrchestrator: AgentOrchestrator;

  constructor(
    private prisma: PrismaService,
    private storage: StorageService
  ) {
    this.agentOrchestrator = new AgentOrchestrator();
  }

  async getCompanySnapshot(companyId: string): Promise<CompanySnapshot> {
    // For V4 MVP, we'll generate snapshots on-demand without caching
    // In production, this would check cache first
    const snapshot = await this.generateCompanySnapshot(companyId);
    return snapshot;
  }

  async getCompanyBrochure(companyId: string): Promise<CompanyBrochure> {
    // Get company snapshot first
    const snapshot = await this.getCompanySnapshot(companyId);

    // Generate brochure content
    const brochure = await this.generateCompanyBrochure(companyId, snapshot);
    return brochure;
  }

  private async generateCompanySnapshot(
    companyId: string
  ): Promise<CompanySnapshot> {
    // Use research agent to gather company information
    const researchRequest: ResearchRequest = {
      companyId,
      type: "snapshot",
      includeNews: true,
      includeBasicInfo: true,
    };

    const researchResult =
      await this.agentOrchestrator.executeResearch(researchRequest);

    return {
      id: companyId,
      name: researchResult.name,
      logo: researchResult.logo,
      website: researchResult.website,
      industry: researchResult.industry,
      size: researchResult.size,
      headquarters: researchResult.headquarters,
      summary: researchResult.summary,
      recentNews: researchResult.news || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private async generateCompanyBrochure(
    companyId: string,
    snapshot: CompanySnapshot
  ): Promise<CompanyBrochure> {
    // Use research agent to gather detailed company information
    const researchRequest: ResearchRequest = {
      companyId,
      type: "brochure",
      includeProducts: true,
      includeMarket: true,
      includeCulture: true,
      includeTimeline: true,
    };

    const researchResult =
      await this.agentOrchestrator.executeResearch(researchRequest);

    const sections: CompanyBrochureSectionsDto = {
      products: {
        title: "Products & Services",
        content: researchResult.products?.content || "",
        images: researchResult.products?.images || [],
      },
      market: {
        title: "Market & Competition",
        content: researchResult.market?.content || "",
        competitors: researchResult.market?.competitors || [],
      },
      culture: {
        title: "Culture & Values",
        content: researchResult.culture?.content || "",
        values: researchResult.culture?.values || [],
      },
      timeline: researchResult.timeline || [],
    };

    // Generate PDF export URL
    const exportUrl = await this.generateBrochureExport(
      companyId,
      snapshot,
      sections
    );

    return {
      id: `brochure-${companyId}`,
      companyId,
      snapshot,
      sections,
      exportUrl,
      createdAt: new Date().toISOString(),
    };
  }

  private async generateBrochureExport(
    companyId: string,
    snapshot: CompanySnapshot,
    sections: CompanyBrochureSectionsDto
  ): Promise<string> {
    // Generate PDF export of the brochure
    // This would use the document generator service
    return `https://storage.example.com/brochures/${companyId}.pdf`;
  }
}
