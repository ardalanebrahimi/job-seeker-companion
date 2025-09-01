import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { ResearchService } from "./research.service";
import { CompanySnapshot, CompanyBrochure } from "../common/dto";

@Controller("companies")
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get(":id/snapshot")
  async getCompanySnapshot(
    @Param("id", ParseUUIDPipe) companyId: string
  ): Promise<CompanySnapshot> {
    return this.researchService.getCompanySnapshot(companyId);
  }

  @Get(":id/brochure")
  async getCompanyBrochure(
    @Param("id", ParseUUIDPipe) companyId: string
  ): Promise<CompanyBrochure> {
    return this.researchService.getCompanyBrochure(companyId);
  }
}
