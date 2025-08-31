import { Module } from "@nestjs/common";
import {
  ApplicationsController,
  RemindersController,
  CoachController,
} from "./applications.controller";
import { ApplicationsService } from "./applications.service";
import { PrismaModule } from "../prisma/prisma.module";
import { StorageModule } from "../storage/storage.module";
import { CvModule } from "../cv/cv.module";
import { JobsModule } from "../jobs/jobs.module";

@Module({
  imports: [PrismaModule, StorageModule, CvModule, JobsModule],
  controllers: [ApplicationsController, RemindersController, CoachController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
