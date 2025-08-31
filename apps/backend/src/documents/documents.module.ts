import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { StorageModule } from "../storage/storage.module";
import { DocumentGeneratorService } from "./document-generator.service";
import { DocumentDiffService } from "./document-diff.service";
import { DocumentVariantsService } from "./document-variants.service";

@Module({
  imports: [PrismaModule, StorageModule],
  providers: [
    DocumentGeneratorService,
    DocumentDiffService,
    DocumentVariantsService,
  ],
  exports: [
    DocumentGeneratorService,
    DocumentDiffService,
    DocumentVariantsService,
  ],
})
export class DocumentsModule {}
