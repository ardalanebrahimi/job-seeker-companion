import { 
  Controller, 
  Post, 
  Get, 
  UseInterceptors, 
  UploadedFile, 
  Req, 
  HttpStatus,
  HttpException,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CvService } from './cv.service';
import { CvUploadResponseDto, CvPreviewDto, ErrorDto } from '../common/dto';

@ApiTags('Users')
@Controller('users/me/cv')
export class CvController {
  constructor(private cvService: CvService) {}

  @Post()
  @ApiOperation({ summary: 'Upload base CV (DOCX or PDF)', operationId: 'uploadBaseCv' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        filename: {
          type: 'string',
        },
        language: {
          type: 'string',
          description: 'ISO language tag (e.g., en, de)',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'CV stored and parsed',
    type: CvUploadResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request',
    type: ErrorDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    type: ErrorDto
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body() body: { filename?: string; language?: string }
  ) {
    if (!file) {
      throw new HttpException(
        { error: { code: 'MISSING_FILE', message: 'File is required' } },
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate file type
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new HttpException(
        { error: { code: 'INVALID_FILE_TYPE', message: 'Only PDF and DOCX files are allowed' } },
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const result = await this.cvService.uploadCv(
        req.userId,
        file,
        body.language
      );

      return result;
    } catch (error) {
      throw new HttpException(
        { error: { code: 'UPLOAD_FAILED', message: 'Failed to upload CV' } },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get parsed base CV preview', operationId: 'getBaseCvPreview' })
  @ApiResponse({ 
    status: 200, 
    description: 'Parsed CV facts and file references',
    type: CvPreviewDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    type: ErrorDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Not found',
    type: ErrorDto
  })
  async getCvPreview(@Req() req: any) {
    try {
      const preview = await this.cvService.getCvPreview(req.userId);
      return preview;
    } catch (error) {
      if (error.message?.includes('No CV found')) {
        throw new HttpException(
          { error: { code: 'CV_NOT_FOUND', message: 'No CV found for user' } },
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        { error: { code: 'FETCH_FAILED', message: 'Failed to fetch CV preview' } },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
