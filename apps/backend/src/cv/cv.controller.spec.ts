import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';

describe('CvController', () => {
  let controller: CvController;
  let cvService: CvService;

  const mockCvService = {
    uploadCv: jest.fn(),
    getCvPreview: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvController],
      providers: [
        {
          provide: CvService,
          useValue: mockCvService,
        },
      ],
    }).compile();

    controller = module.get<CvController>(CvController);
    cvService = module.get<CvService>(CvService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadCv', () => {
    it('should upload CV successfully', async () => {
      const mockFile = {
        originalname: 'test.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const mockReq = { userId: '11111111-1111-1111-1111-111111111111' };
      const mockBody = { language: 'en' };

      const mockResponse = {
        fileId: 'file-uuid',
        parsed: true,
        language: 'en',
      };

      mockCvService.uploadCv.mockResolvedValue(mockResponse);

      const result = await controller.uploadCv(mockFile, mockReq, mockBody);

      expect(result).toEqual(mockResponse);
      expect(cvService.uploadCv).toHaveBeenCalledWith(
        '11111111-1111-1111-1111-111111111111',
        mockFile,
        'en'
      );
    });

    it('should throw error when file is missing', async () => {
      const mockReq = { userId: '11111111-1111-1111-1111-111111111111' };
      const mockBody = {};

      await expect(
        controller.uploadCv(undefined as any, mockReq, mockBody)
      ).rejects.toThrow(HttpException);
    });

    it('should throw error for invalid file type', async () => {
      const mockFile = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const mockReq = { userId: '11111111-1111-1111-1111-111111111111' };
      const mockBody = {};

      await expect(
        controller.uploadCv(mockFile, mockReq, mockBody)
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getCvPreview', () => {
    it('should return CV preview', async () => {
      const mockReq = { userId: '11111111-1111-1111-1111-111111111111' };
      const mockPreview = {
        summary: 'Test summary',
        skills: ['JavaScript'],
        fileUri: '/path/to/file',
      };

      mockCvService.getCvPreview.mockResolvedValue(mockPreview);

      const result = await controller.getCvPreview(mockReq);

      expect(result).toEqual(mockPreview);
      expect(cvService.getCvPreview).toHaveBeenCalledWith(
        '11111111-1111-1111-1111-111111111111'
      );
    });

    it('should throw 404 when CV not found', async () => {
      const mockReq = { userId: '11111111-1111-1111-1111-111111111111' };

      mockCvService.getCvPreview.mockRejectedValue(new Error('No CV found'));

      await expect(controller.getCvPreview(mockReq)).rejects.toThrow(HttpException);
    });
  });
});
