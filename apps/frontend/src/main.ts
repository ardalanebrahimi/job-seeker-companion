import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { OpenAPI } from "@job-companion/sdk";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

// Configure SDK to use local backend
OpenAPI.BASE = "http://localhost:3000/api";

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()],
}).catch((err) => console.error(err));
