import { Module } from "@nestjs/common";
import { CoachController } from "./coach.controller";
import { CoachService } from "./coach.service";
import { PrismaModule } from "../prisma/prisma.module";
import { CvModule } from "../cv/cv.module";
import { JobsModule } from "../jobs/jobs.module";

@Module({
  imports: [PrismaModule, CvModule, JobsModule],
  controllers: [CoachController],
  providers: [CoachService],
  exports: [CoachService],
})
export class CoachModule {}
