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
      import("./features/applications/applications-tracker.component").then(
        (m) => m.ApplicationsTrackerComponent
      ),
  },
];
