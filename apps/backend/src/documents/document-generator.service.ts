import { Injectable } from "@nestjs/common";
import { StorageService } from "../storage/storage.service";
import { DocumentFormat, DocumentKind } from "../common/dto";
import * as puppeteer from "puppeteer";
import * as docx from "docx";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export interface DocumentTemplate {
  style: "modern" | "minimal" | "classic";
  name: string;
  description: string;
}

export interface DocumentContent {
  summary: string;
  experience: Array<{
    company: string;
    title: string;
    duration: string;
    bullets: string[];
  }>;
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  contact: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
}

export interface CoverLetterContent {
  contact: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  company: {
    name: string;
    address?: string;
  };
  salutation: string;
  opening: string;
  body: string[];
  closing: string;
  signature: string;
}

@Injectable()
export class DocumentGeneratorService {
  private readonly templates: DocumentTemplate[] = [
    {
      style: "modern",
      name: "Modern Professional",
      description:
        "Clean layout with subtle colors, ideal for tech and startups",
    },
    {
      style: "minimal",
      name: "Minimal Clean",
      description: "Simple black & white, ATS-friendly for any industry",
    },
    {
      style: "classic",
      name: "Classic Executive",
      description: "Traditional format perfect for corporate and senior roles",
    },
  ];

  constructor(private storage: StorageService) {}

  /**
   * Generate CV in DOCX format
   */
  async generateCvDocx(
    content: DocumentContent,
    template: DocumentTemplate
  ): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header with contact info
            new Paragraph({
              children: [
                new TextRun({
                  text: content.contact.name,
                  bold: true,
                  size: 32,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${content.contact.email} | ${content.contact.phone} | ${content.contact.location}`,
                  size: 20,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Summary
            new Paragraph({
              children: [
                new TextRun({
                  text: "PROFESSIONAL SUMMARY",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: content.summary,
                  size: 20,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Skills
            new Paragraph({
              children: [
                new TextRun({
                  text: "CORE SKILLS",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: content.skills.join(" • "),
                  size: 20,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Experience
            new Paragraph({
              children: [
                new TextRun({
                  text: "PROFESSIONAL EXPERIENCE",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),

            // Experience entries
            ...content.experience.flatMap((exp) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.title} | ${exp.company}`,
                    bold: true,
                    size: 22,
                  }),
                ],
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.duration,
                    italics: true,
                    size: 20,
                  }),
                ],
                spacing: { after: 150 },
              }),
              ...exp.bullets.map(
                (bullet) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `• ${bullet}`,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 100 },
                  })
              ),
            ]),

            // Education
            new Paragraph({
              children: [
                new TextRun({
                  text: "EDUCATION",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),

            ...content.education.map(
              (edu) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${edu.degree} | ${edu.institution} | ${edu.year}`,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 100 },
                })
            ),
          ],
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Generate cover letter in DOCX format
   */
  async generateCoverLetterDocx(
    content: CoverLetterContent,
    template: DocumentTemplate
  ): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header with contact info
            new Paragraph({
              children: [
                new TextRun({
                  text: content.contact.name,
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${content.contact.email} | ${content.contact.phone} | ${content.contact.location}`,
                  size: 18,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Date
            new Paragraph({
              children: [
                new TextRun({
                  text: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                  size: 20,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Company info
            ...(content.company.address
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: content.company.name,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: content.company.address,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 400 },
                  }),
                ]
              : []),

            // Salutation
            new Paragraph({
              children: [
                new TextRun({
                  text: content.salutation,
                  size: 20,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Opening
            new Paragraph({
              children: [
                new TextRun({
                  text: content.opening,
                  size: 20,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Body paragraphs
            ...content.body.map(
              (paragraph) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: paragraph,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 400 },
                })
            ),

            // Closing
            new Paragraph({
              children: [
                new TextRun({
                  text: content.closing,
                  size: 20,
                }),
              ],
              spacing: { after: 200 },
            }),

            // Signature
            new Paragraph({
              children: [
                new TextRun({
                  text: content.signature,
                  size: 20,
                }),
              ],
              spacing: { after: 200 },
            }),
          ],
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Convert DOCX to PDF using Puppeteer
   */
  async convertDocxToPdf(docxBuffer: Buffer): Promise<Buffer> {
    // For now, we'll use a simple HTML to PDF conversion
    // In a real implementation, you might want to use a service like pandoc
    // or a dedicated DOCX to PDF converter

    const browser = await puppeteer.launch({ headless: true });
    try {
      const page = await browser.newPage();

      // For this MVP, we'll create a simple HTML representation
      // In production, you'd want to properly parse the DOCX
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Times New Roman', serif; margin: 1in; line-height: 1.5; }
            .header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .contact { font-size: 12px; margin-bottom: 20px; }
            .section-header { font-size: 14px; font-weight: bold; margin: 20px 0 10px 0; border-bottom: 1px solid #000; }
            .content { font-size: 12px; margin-bottom: 10px; }
            ul { margin: 0; padding-left: 20px; }
          </style>
        </head>
        <body>
          <div class="header">Document Preview</div>
          <div class="content">This is a placeholder PDF. In production, proper DOCX parsing would be implemented.</div>
        </body>
        </html>
      `;

      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({
        format: "A4",
        margin: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate HTML preview of document
   */
  async generateHtmlPreview(
    content: DocumentContent | CoverLetterContent,
    template: DocumentTemplate,
    kind: DocumentKind
  ): Promise<string> {
    if (kind === DocumentKind.cv) {
      return this.generateCvHtmlPreview(content as DocumentContent, template);
    } else if (kind === DocumentKind.cover) {
      return this.generateCoverLetterHtmlPreview(
        content as CoverLetterContent,
        template
      );
    }

    throw new Error(`Unsupported document kind: ${kind}`);
  }

  private generateCvHtmlPreview(
    content: DocumentContent,
    template: DocumentTemplate
  ): string {
    const themeClass = template.style;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${content.contact.name} - CV</title>
        <style>
          body { 
            font-family: ${this.getFontFamily(template.style)}; 
            margin: 40px; 
            line-height: 1.6; 
            color: ${this.getTextColor(template.style)};
            background: ${this.getBackgroundColor(template.style)};
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: ${this.getHeaderBorder(template.style)};
            padding-bottom: 20px;
          }
          .name { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;
            color: ${this.getAccentColor(template.style)};
          }
          .contact { font-size: 14px; color: #666; }
          .section { margin-bottom: 25px; }
          .section-title { 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            text-transform: uppercase;
            color: ${this.getAccentColor(template.style)};
            border-bottom: 1px solid ${this.getAccentColor(template.style)};
            padding-bottom: 5px;
          }
          .experience-item { margin-bottom: 15px; }
          .job-title { font-weight: bold; font-size: 14px; }
          .company { font-weight: bold; color: ${this.getAccentColor(template.style)}; }
          .duration { font-style: italic; color: #666; font-size: 13px; }
          .bullets { margin-top: 5px; }
          .bullets li { margin-bottom: 3px; }
          .skills { display: flex; flex-wrap: wrap; gap: 8px; }
          .skill { 
            background: ${this.getSkillBackgroundColor(template.style)};
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px;
            border: ${this.getSkillBorder(template.style)};
          }
          .education-item { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${content.contact.name}</div>
          <div class="contact">${content.contact.email} | ${content.contact.phone} | ${content.contact.location}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div>${content.summary}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Core Skills</div>
          <div class="skills">
            ${content.skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Professional Experience</div>
          ${content.experience
            .map(
              (exp) => `
            <div class="experience-item">
              <div class="job-title">${exp.title} | <span class="company">${exp.company}</span></div>
              <div class="duration">${exp.duration}</div>
              <ul class="bullets">
                ${exp.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
              </ul>
            </div>
          `
            )
            .join("")}
        </div>
        
        <div class="section">
          <div class="section-title">Education</div>
          ${content.education
            .map(
              (edu) => `
            <div class="education-item">${edu.degree} | ${edu.institution} | ${edu.year}</div>
          `
            )
            .join("")}
        </div>
      </body>
      </html>
    `;
  }

  private generateCoverLetterHtmlPreview(
    content: CoverLetterContent,
    template: DocumentTemplate
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Cover Letter - ${content.contact.name}</title>
        <style>
          body { 
            font-family: ${this.getFontFamily(template.style)}; 
            margin: 40px; 
            line-height: 1.6; 
            color: ${this.getTextColor(template.style)};
          }
          .header { margin-bottom: 30px; }
          .name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .contact { font-size: 14px; color: #666; margin-bottom: 20px; }
          .date { margin-bottom: 20px; }
          .company-info { margin-bottom: 20px; }
          .content { margin-bottom: 15px; text-align: justify; }
          .salutation { margin-bottom: 20px; }
          .closing { margin-top: 30px; }
          .signature { margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${content.contact.name}</div>
          <div class="contact">${content.contact.email} | ${content.contact.phone} | ${content.contact.location}</div>
        </div>
        
        <div class="date">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        
        <div class="company-info">
          <div>${content.company.name}</div>
          ${content.company.address ? `<div>${content.company.address}</div>` : ""}
        </div>
        
        <div class="salutation">${content.salutation}</div>
        
        <div class="content">${content.opening}</div>
        
        ${content.body.map((paragraph) => `<div class="content">${paragraph}</div>`).join("")}
        
        <div class="closing">${content.closing}</div>
        
        <div class="signature">${content.signature}</div>
      </body>
      </html>
    `;
  }

  private getFontFamily(style: string): string {
    switch (style) {
      case "modern":
        return "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      case "minimal":
        return "'Arial', sans-serif";
      case "classic":
        return "'Times New Roman', Times, serif";
      default:
        return "'Arial', sans-serif";
    }
  }

  private getTextColor(style: string): string {
    switch (style) {
      case "modern":
        return "#2c3e50";
      case "minimal":
        return "#000000";
      case "classic":
        return "#1a1a1a";
      default:
        return "#000000";
    }
  }

  private getBackgroundColor(style: string): string {
    switch (style) {
      case "modern":
        return "#ffffff";
      case "minimal":
        return "#ffffff";
      case "classic":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  }

  private getAccentColor(style: string): string {
    switch (style) {
      case "modern":
        return "#3498db";
      case "minimal":
        return "#000000";
      case "classic":
        return "#8b4513";
      default:
        return "#000000";
    }
  }

  private getHeaderBorder(style: string): string {
    switch (style) {
      case "modern":
        return "2px solid #3498db";
      case "minimal":
        return "1px solid #cccccc";
      case "classic":
        return "2px solid #8b4513";
      default:
        return "1px solid #cccccc";
    }
  }

  private getSkillBackgroundColor(style: string): string {
    switch (style) {
      case "modern":
        return "#ecf0f1";
      case "minimal":
        return "#f5f5f5";
      case "classic":
        return "#f0f0f0";
      default:
        return "#f5f5f5";
    }
  }

  private getSkillBorder(style: string): string {
    switch (style) {
      case "modern":
        return "1px solid #bdc3c7";
      case "minimal":
        return "none";
      case "classic":
        return "1px solid #d4a574";
      default:
        return "none";
    }
  }

  /**
   * Get available templates
   */
  getTemplates(): DocumentTemplate[] {
    return [...this.templates];
  }

  /**
   * Auto-select template based on job and company characteristics
   */
  selectTemplateForJob(
    jobTitle: string,
    companyName: string,
    industry?: string
  ): DocumentTemplate {
    const lowerTitle = jobTitle.toLowerCase();
    const lowerCompany = companyName.toLowerCase();
    const lowerIndustry = (industry || "").toLowerCase();

    // Tech/startup bias toward modern
    if (
      lowerTitle.includes("developer") ||
      lowerTitle.includes("engineer") ||
      lowerTitle.includes("tech") ||
      lowerCompany.includes("startup") ||
      lowerIndustry.includes("technology")
    ) {
      return this.templates.find((t) => t.style === "modern")!;
    }

    // Senior/executive roles prefer classic
    if (
      lowerTitle.includes("director") ||
      lowerTitle.includes("vp") ||
      lowerTitle.includes("chief") ||
      lowerTitle.includes("senior") ||
      lowerTitle.includes("head of")
    ) {
      return this.templates.find((t) => t.style === "classic")!;
    }

    // Default to minimal (ATS-safe)
    return this.templates.find((t) => t.style === "minimal")!;
  }
}
