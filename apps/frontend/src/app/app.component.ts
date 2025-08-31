import { Component } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app">
      <header class="header">
        <div class="container">
          <h1>Job Companion</h1>
          <nav>
            <a routerLink="/profile/cv" class="nav-link">CV Management</a>
            <a routerLink="/generate" class="nav-link">Generate Application</a>
            <a routerLink="/v1-generator" class="nav-link">V1 Generator ✨</a>
            <a routerLink="/applications" class="nav-link"
              >Application Tracker</a
            >
          </nav>
        </div>
      </header>

      <main class="main">
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .header {
        background-color: #343a40;
        color: white;
        padding: 1rem 0;
      }

      .header h1 {
        margin: 0;
        display: inline-block;
      }

      .header nav {
        float: right;
        margin-top: 0.5rem;
      }

      .nav-link {
        color: white;
        text-decoration: none;
        margin-left: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .nav-link:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .main {
        flex: 1;
        padding: 2rem 0;
      }
    `,
  ],
})
export class AppComponent {
  title = "Job Companion";
}
