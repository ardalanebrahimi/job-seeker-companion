import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/profile/cv",
    pathMatch: "full",
  },
  {
    path: "profile/cv",
    loadComponent: () =>
      import("./features/profile/cv/cv-page.component").then(
        (m) => m.CvPageComponent
      ),
  },
  {
    path: "generate",
    loadComponent: () =>
      import("./features/applications/generate-page.component").then(
        (m) => m.GeneratePageComponent
      ),
  },
  {
    path: "v1-generator",
    loadComponent: () =>
      import(
        "./features/applications/v1-generator/v1-generator.component"
      ).then((m) => m.V1GeneratorComponent),
  },
  {
    path: "applications",
    loadComponent: () =>
      import("./features/applications/applications-tracker-v2.component").then(
        (m) => m.ApplicationsTrackerV2Component
      ),
  },
  {
    path: "applications/v1",
    loadComponent: () =>
      import("./features/applications/applications-tracker.component").then(
        (m) => m.ApplicationsTrackerComponent
      ),
  },
  {
    path: "applications/:id",
    loadComponent: () =>
      import("./features/applications/generate-page.component").then(
        (m) => m.GeneratePageComponent
      ),
  },
  {
    path: "applications/:id/edit",
    loadComponent: () =>
      import("./features/applications/generate-page.component").then(
        (m) => m.GeneratePageComponent
      ),
  },
  {
    path: "applications/:id/documents",
    loadComponent: () =>
      import("./features/applications/generate-page.component").then(
        (m) => m.GeneratePageComponent
      ),
  },
  {
    path: "applications/:id/variants",
    loadComponent: () =>
      import(
        "./features/applications/v3-documents/v3-document-variants.component"
      ).then((m) => m.V3DocumentVariantsComponent),
  },
  {
    path: "applications/:id/documents/:documentId/diff",
    loadComponent: () =>
      import(
        "./features/applications/v3-documents/v3-document-diff.component"
      ).then((m) => m.V3DocumentDiffComponent),
  },
  // V4 Routes - Interview Hub & Company Research
  {
    path: "v4-demo",
    loadComponent: () =>
      import("./features/v4-demo/v4-demo.component").then(
        (m) => m.V4DemoComponent
      ),
  },
  {
    path: "applications/:id/interview-hub",
    loadComponent: () =>
      import("./features/interview-hub/interview-hub.component").then(
        (m) => m.InterviewHubComponent
      ),
  },
  {
    path: "applications/:id/company-brochure",
    loadComponent: () =>
      import("./features/company-brochure/company-brochure.component").then(
        (m) => m.CompanyBrochureComponent
      ),
  },
  {
    path: "companies/:id/brochure",
    loadComponent: () =>
      import("./features/company-brochure/company-brochure.component").then(
        (m) => m.CompanyBrochureComponent
      ),
  },
];
