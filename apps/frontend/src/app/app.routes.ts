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
];
