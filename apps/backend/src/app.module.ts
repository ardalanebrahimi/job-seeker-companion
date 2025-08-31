import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { CvModule } from './cv/cv.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    CvModule,
    CommonModule,
  ],
})
export class AppModule {}
