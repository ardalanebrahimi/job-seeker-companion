import { Injectable } from "@nestjs/common";
import { CvService } from "../cv/cv.service";
import { JobsService } from "../jobs/jobs.service";
import { GapRoadmapDto, GapActionDto } from "../common/dto";

@Injectable()
export class CoachService {
  constructor(
    private cvService: CvService,
    private jobsService: JobsService
  ) {}

  async generateGapRoadmap(
    userId: string,
    jobId: string,
    personaHint?: string
  ): Promise<GapRoadmapDto> {
    // Get user CV and job details
    const cvPreview = await this.cvService.getCvPreview(userId);
    const jobDetail = await this.jobsService.getJob(jobId);

    // Calculate match score
    const matchScore = this.calculateMatchScore(cvPreview, jobDetail);

    // Identify gaps
    const { mustHaveGaps, niceToHaveGaps } = this.identifyGaps(
      cvPreview,
      jobDetail
    );

    // Generate actionable steps
    const actions = this.generateActions(
      mustHaveGaps,
      niceToHaveGaps,
      personaHint
    );

    return {
      matchScore,
      mustHaveGaps,
      niceToHaveGaps,
      actions,
    };
  }

  private calculateMatchScore(cvPreview: any, jobDetail: any): number {
    const cvSkills = (cvPreview.skills || []).map((s: string) =>
      s.toLowerCase()
    );
    const jobSkills = (jobDetail.jdStruct?.skills || []).map((s: string) =>
      s.toLowerCase()
    );

    if (jobSkills.length === 0) {
      return 0.5; // Neutral score if no job skills identified
    }

    // Calculate skill overlap
    const matchingSkills = cvSkills.filter((cvSkill: string) =>
      jobSkills.some(
        (jobSkill: string) =>
          jobSkill.includes(cvSkill) || cvSkill.includes(jobSkill)
      )
    );

    const skillScore = matchingSkills.length / jobSkills.length;

    // Consider experience relevance
    const experience = cvPreview.experience || [];
    const hasRelevantExp = experience.some((exp: any) => {
      const expTitle = exp.title?.toLowerCase() || "";
      const jobTitle = jobDetail.title?.toLowerCase() || "";
      const mainRole = jobTitle.split(" ")[0];
      return (
        expTitle.includes(mainRole) || mainRole.includes(expTitle.split(" ")[0])
      );
    });

    const experienceScore = hasRelevantExp ? 0.3 : 0.1;

    // Combine scores (70% skills, 30% experience)
    return Math.min(0.95, skillScore * 0.7 + experienceScore);
  }

  private identifyGaps(
    cvPreview: any,
    jobDetail: any
  ): {
    mustHaveGaps: string[];
    niceToHaveGaps: string[];
  } {
    const cvSkills = (cvPreview.skills || []).map((s: string) =>
      s.toLowerCase()
    );
    const jobSkills = (jobDetail.jdStruct?.skills || []).map((s: string) =>
      s.toLowerCase()
    );
    const jobRequirements = jobDetail.jdStruct?.requirements || [];
    const niceToHave = jobDetail.jdStruct?.niceToHave || [];

    // Identify missing skills from must-have requirements
    const mustHaveGaps: string[] = [];
    const niceToHaveGaps: string[] = [];

    // Check for missing critical skills
    for (const jobSkill of jobSkills) {
      const hasSkill = cvSkills.some(
        (cvSkill) => cvSkill.includes(jobSkill) || jobSkill.includes(cvSkill)
      );

      if (!hasSkill) {
        // Determine if it's must-have or nice-to-have
        const isMustHave = jobRequirements.some(
          (req) =>
            req.toLowerCase().includes(jobSkill) ||
            req.toLowerCase().includes("require") ||
            req.toLowerCase().includes("must have")
        );

        if (isMustHave) {
          mustHaveGaps.push(jobSkill);
        } else {
          niceToHaveGaps.push(jobSkill);
        }
      }
    }

    // Add gaps from nice-to-have list
    for (const niceItem of niceToHave) {
      const itemLower = niceItem.toLowerCase();
      const hasNiceSkill = cvSkills.some(
        (cvSkill) => itemLower.includes(cvSkill) || cvSkill.includes(itemLower)
      );

      if (!hasNiceSkill && niceItem.length < 100) {
        // Filter out long descriptions
        niceToHaveGaps.push(niceItem);
      }
    }

    return {
      mustHaveGaps: mustHaveGaps.slice(0, 5), // Limit to top 5
      niceToHaveGaps: niceToHaveGaps.slice(0, 5), // Limit to top 5
    };
  }

  private generateActions(
    mustHaveGaps: string[],
    niceToHaveGaps: string[],
    personaHint?: string
  ): GapActionDto[] {
    const actions: GapActionDto[] = [];

    // Generate actions for must-have gaps (higher priority)
    for (const gap of mustHaveGaps.slice(0, 3)) {
      // Focus on top 3 critical gaps
      const action = this.createActionForSkill(gap, true, personaHint);
      if (action) {
        actions.push(action);
      }
    }

    // Generate actions for nice-to-have gaps
    for (const gap of niceToHaveGaps.slice(0, 2)) {
      // Add 2 nice-to-have improvements
      const action = this.createActionForSkill(gap, false, personaHint);
      if (action) {
        actions.push(action);
      }
    }

    // Add general improvement actions if we have few specific gaps
    if (actions.length < 3) {
      actions.push({
        title: "Tailor your CV presentation",
        description:
          "Reorganize your CV to highlight the most relevant experience and skills for this role. Use keywords from the job description.",
        etaDays: 1,
      });
    }

    if (actions.length < 4) {
      actions.push({
        title: "Research the company",
        description:
          "Learn about the company's products, culture, and recent news to customize your cover letter and prepare for interviews.",
        etaDays: 2,
      });
    }

    return actions.slice(0, 5); // Maximum 5 actions
  }

  private createActionForSkill(
    skill: string,
    isCritical: boolean,
    personaHint?: string
  ): GapActionDto | null {
    const skillLower = skill.toLowerCase();

    // Common skill-specific actions
    const skillActions: Record<string, GapActionDto> = {
      javascript: {
        title: "Learn JavaScript fundamentals",
        description:
          "Complete a JavaScript course or tutorial. Practice with coding exercises on platforms like Codecademy or freeCodeCamp.",
        etaDays: isCritical ? 14 : 21,
      },
      python: {
        title: "Develop Python skills",
        description:
          "Take a Python course focused on your field. Build a small project to demonstrate your understanding.",
        etaDays: isCritical ? 14 : 21,
      },
      react: {
        title: "Build React experience",
        description:
          "Create a React application or component. Deploy it and add to your portfolio.",
        etaDays: isCritical ? 10 : 14,
      },
      sql: {
        title: "Strengthen SQL skills",
        description:
          "Practice SQL queries on platforms like SQLBolt or HackerRank. Work with real datasets if possible.",
        etaDays: isCritical ? 7 : 10,
      },
      agile: {
        title: "Learn Agile methodology",
        description:
          "Study Agile/Scrum principles. Consider getting a basic certification or completing an online course.",
        etaDays: isCritical ? 5 : 7,
      },
      leadership: {
        title: "Demonstrate leadership",
        description:
          "Identify examples from your experience where you led projects or teams. Quantify the impact where possible.",
        etaDays: isCritical ? 3 : 5,
      },
    };

    // Check for direct matches
    for (const [key, action] of Object.entries(skillActions)) {
      if (skillLower.includes(key)) {
        return action;
      }
    }

    // Generate generic action for unknown skills
    if (skill.length < 50) {
      // Only for reasonable skill names
      return {
        title: `Develop ${skill} expertise`,
        description: `Research ${skill} and identify learning resources. Consider online courses, documentation, or practical projects to build this skill.`,
        etaDays: isCritical ? 14 : 21,
      };
    }

    return null;
  }
}
