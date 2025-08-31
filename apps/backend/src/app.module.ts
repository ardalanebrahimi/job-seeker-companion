import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { StorageModule } from "./storage/storage.module";
import { CvModule } from "./cv/cv.module";
import { CommonModule } from "./common/common.module";
import { JobsModule } from "./jobs/jobs.module";
import { ApplicationsModule } from "./applications/applications.module";
import { CoachModule } from "./coach/coach.module";

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    CvModule,
    CommonModule,
    JobsModule,
    ApplicationsModule,
    CoachModule,
  ],
})
export class AppModule {}
