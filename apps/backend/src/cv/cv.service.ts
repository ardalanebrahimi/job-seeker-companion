import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CvParser, CvPreview } from './cv.parser';
import * as path from 'path';
import * as mimeTypes from 'mime-types';

@Injectable()
export class CvService {
  private parser = new CvParser();

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async uploadCv(
    userId: string,
    file: Express.Multer.File,
    language?: string,
  ): Promise<{ fileId: string; parsed: boolean; language?: string; preview?: CvPreview }> {
    // Generate file path
    const ext = path.extname(file.originalname);
    const filename = `cv-${Date.now()}${ext}`;
    const subpath = `users/${userId}/cv/${filename}`;

    // Save file
    const uri = await this.storage.save(file.buffer, subpath, file.mimetype);

    // Parse file
    const parseResult = await this.parser.parse(file.buffer, file.mimetype);

    // Remove existing CV file for this user
    await this.prisma.userFile.deleteMany({
      where: { userId, kind: 'cv' }
    });

    // Save new file record
    const userFile = await this.prisma.userFile.create({
      data: {
        userId,
        kind: 'cv',
        mimeType: file.mimetype,
        filename: file.originalname,
        uri,
      },
    });

    // If parsing was successful, save resume facts
    if (parseResult.parsed && parseResult.preview) {
      // Clear existing facts for this user
      await this.prisma.resumeFact.deleteMany({
        where: { userId }
      });

      const facts = [];

      if (parseResult.preview.summary) {
        facts.push({
          userId,
          kind: 'summary',
          dataJson: { text: parseResult.preview.summary },
        });
      }

      if (parseResult.preview.skills?.length) {
        facts.push({
          userId,
          kind: 'skill',
          dataJson: { skills: parseResult.preview.skills },
        });
      }

      if (parseResult.preview.experience?.length) {
        facts.push({
          userId,
          kind: 'experience',
          dataJson: { experience: parseResult.preview.experience },
        });
      }

      if (parseResult.preview.education?.length) {
        facts.push({
          userId,
          kind: 'education',
          dataJson: { education: parseResult.preview.education },
        });
      }

      if (facts.length > 0) {
        await this.prisma.resumeFact.createMany({
          data: facts,
        });
      }
    }

    return {
      fileId: userFile.id,
      parsed: parseResult.parsed,
      language,
      preview: parseResult.parsed ? parseResult.preview : undefined,
    };
  }

  async getCvPreview(userId: string): Promise<CvPreview> {
    // Get the latest CV file
    const userFile = await this.prisma.userFile.findFirst({
      where: { userId, kind: 'cv' },
      orderBy: { createdAt: 'desc' },
    });

    if (!userFile) {
      throw new NotFoundException('No CV found for user');
    }

    // Get all resume facts for this user
    const facts = await this.prisma.resumeFact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const preview: CvPreview = {
      fileUri: userFile.uri,
    };

    for (const fact of facts) {
      switch (fact.kind) {
        case 'summary':
          preview.summary = (fact.dataJson as any).text;
          break;
        case 'skill':
          preview.skills = (fact.dataJson as any).skills;
          break;
        case 'experience':
          preview.experience = (fact.dataJson as any).experience;
          break;
        case 'education':
          preview.education = (fact.dataJson as any).education;
          break;
      }
    }

    return preview;
  }
}
