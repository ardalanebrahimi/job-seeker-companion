import { Test, TestingModule } from '@nestjs/testing';
import { CvService } from './cv.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CvParser } from './cv.parser';

describe('CvService', () => {
  let service: CvService;
  let prismaService: PrismaService;
  let storageService: StorageService;

  const mockPrismaService = {
    userFile: {
      deleteMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    resumeFact: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockStorageService = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CvService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<CvService>(CvService);
    prismaService = module.get<PrismaService>(PrismaService);
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadCv', () => {
    it('should upload and parse a DOCX file successfully', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const mockFile = {
        originalname: 'test.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        buffer: Buffer.from('mock file content'),
      } as Express.Multer.File;

      const mockFileRecord = {
        id: 'file-uuid',
        userId,
        kind: 'cv',
        mimeType: mockFile.mimetype,
        filename: mockFile.originalname,
        uri: '/path/to/file',
      };

      mockStorageService.save.mockResolvedValue('/path/to/file');
      mockPrismaService.userFile.create.mockResolvedValue(mockFileRecord);
      mockPrismaService.userFile.deleteMany.mockResolvedValue({});
      mockPrismaService.resumeFact.deleteMany.mockResolvedValue({});
      mockPrismaService.resumeFact.createMany.mockResolvedValue({});

      // Mock the parser
      jest.spyOn(CvParser.prototype, 'parse').mockResolvedValue({
        parsed: true,
        preview: {
          summary: 'Test summary',
          skills: ['JavaScript', 'TypeScript'],
        },
      });

      const result = await service.uploadCv(userId, mockFile, 'en');

      expect(result.fileId).toBe('file-uuid');
      expect(result.parsed).toBe(true);
      expect(result.language).toBe('en');
      expect(result.preview?.summary).toBe('Test summary');
      expect(storageService.save).toHaveBeenCalled();
      expect(prismaService.userFile.create).toHaveBeenCalled();
    });

    it('should handle parsing failure gracefully', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const mockFile = {
        originalname: 'corrupt.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('corrupt content'),
      } as Express.Multer.File;

      const mockFileRecord = {
        id: 'file-uuid',
        userId,
        kind: 'cv',
        mimeType: mockFile.mimetype,
        filename: mockFile.originalname,
        uri: '/path/to/file',
      };

      mockStorageService.save.mockResolvedValue('/path/to/file');
      mockPrismaService.userFile.create.mockResolvedValue(mockFileRecord);
      mockPrismaService.userFile.deleteMany.mockResolvedValue({});

      // Mock parser failure
      jest.spyOn(CvParser.prototype, 'parse').mockResolvedValue({
        parsed: false,
        preview: {},
      });

      const result = await service.uploadCv(userId, mockFile);

      expect(result.fileId).toBe('file-uuid');
      expect(result.parsed).toBe(false);
      expect(result.preview).toBeUndefined();
      expect(prismaService.resumeFact.createMany).not.toHaveBeenCalled();
    });
  });

  describe('getCvPreview', () => {
    it('should return CV preview when file exists', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      
      const mockFile = {
        id: 'file-uuid',
        uri: '/path/to/file',
        createdAt: new Date(),
      };

      const mockFacts = [
        {
          kind: 'summary',
          dataJson: { text: 'Test summary' },
        },
        {
          kind: 'skill',
          dataJson: { skills: ['JavaScript', 'TypeScript'] },
        },
      ];

      mockPrismaService.userFile.findFirst.mockResolvedValue(mockFile);
      mockPrismaService.resumeFact.findMany.mockResolvedValue(mockFacts);

      const result = await service.getCvPreview(userId);

      expect(result.fileUri).toBe('/path/to/file');
      expect(result.summary).toBe('Test summary');
      expect(result.skills).toEqual(['JavaScript', 'TypeScript']);
    });

    it('should throw NotFoundException when no CV exists', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      
      mockPrismaService.userFile.findFirst.mockResolvedValue(null);

      await expect(service.getCvPreview(userId)).rejects.toThrow('No CV found for user');
    });
  });
});
