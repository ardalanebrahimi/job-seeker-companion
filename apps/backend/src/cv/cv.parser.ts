import * as mammoth from 'mammoth';
import * as pdfParse from 'pdf-parse';

export type CvPreview = {
  summary?: string;
  skills?: string[];
  experience?: Array<{ 
    company?: string; 
    title?: string; 
    startDate?: string | null; 
    endDate?: string | null; 
    bullets?: string[] 
  }>;
  education?: Array<{ 
    institution?: string; 
    degree?: string; 
    year?: string 
  }>;
  fileUri?: string;
};

export class CvParser {
  async parse(buffer: Buffer, mime: string): Promise<{ parsed: boolean; preview: CvPreview }> {
    let text = '';
    try {
      if (mime.includes('word') || mime.endsWith('docx')) {
        const res = await mammoth.extractRawText({ buffer });
        text = res.value || '';
      } else if (mime.includes('pdf')) {
        const res = await pdfParse(buffer);
        text = res.text || '';
      }
    } catch {
      return { parsed: false, preview: {} };
    }
    
    if (!text?.trim()) return { parsed: false, preview: {} };

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const joined = lines.join('\n');

    // Extract skills
    const skillsLine = lines.find(l => /^skills\b[:\-]/i.test(l)) || '';
    const skills = skillsLine
      ? skillsLine.replace(/^skills\b[:\-]\s*/i, '').split(/[,;•]\s*/).map(s => s.trim()).filter(Boolean)
      : [];

    // Extract summary
    const summary = (joined.match(/(summary|profile)\s*[:\-]?\s*([\s\S]{0,600})/i)?.[2] || '').trim();

    // Naive experience extraction
    const expBlocks = joined.split(/(?:experience|work experience)[:\-]?\s*/i).pop() || '';
    const expItems = expBlocks.split(/\n{2,}/).slice(0, 4).map(b => {
      const bullets = b.split(/\n/).slice(1, 6).filter(Boolean);
      return { 
        company: undefined, 
        title: undefined, 
        startDate: null, 
        endDate: null, 
        bullets 
      };
    });

    // Naive education extraction
    const eduBlocks = joined.split(/(?:education)[:\-]?\s*/i).pop() || '';
    const eduItems = eduBlocks.split(/\n{2,}/).slice(0, 3).map(b => {
      return {
        institution: undefined,
        degree: undefined,
        year: undefined
      };
    });

    return { 
      parsed: true, 
      preview: { 
        summary, 
        skills, 
        experience: expItems.length > 0 ? expItems : undefined,
        education: eduItems.length > 0 ? eduItems : undefined
      } 
    };
  }
}
