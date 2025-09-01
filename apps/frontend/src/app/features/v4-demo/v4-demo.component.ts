import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v4-demo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="v4-demo">
      <div class="hero">
        <h1>🚀 V4 Features - Company Brochure & Interview Hub</h1>
        <p class="subtitle">Comprehensive company research and interview preparation tools</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🏢</div>
          <h2>Company Brochure</h2>
          <p>Comprehensive company profiles with multimedia brochures, market analysis, culture insights, and timeline.</p>
          <div class="demo-links">
            <a routerLink="/companies/tech-corp/brochure" class="demo-button primary">
              View Demo Company
            </a>
            <a routerLink="/applications/app-123/company-brochure" class="demo-button secondary">
              Application Context
            </a>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h2>Interview Hub</h2>
          <p>Complete interview preparation with STAR stories, likely questions, notes system, and coaching guidance.</p>
          <div class="demo-links">
            <a routerLink="/applications/app-123/interview-hub" class="demo-button primary">
              Interview Dashboard
            </a>
          </div>
        </div>
      </div>

      <div class="user-stories">
        <h2>📋 Implemented User Stories</h2>
        <div class="stories-grid">
          <div class="story-item">✅ V4.1: Company Snapshot Generation</div>
          <div class="story-item">✅ V4.2: Multimedia Company Brochures</div>
          <div class="story-item">✅ V4.3: Role-Specific Company Fit Brief</div>
          <div class="story-item">✅ V4.4: Interview Preparation Pack</div>
          <div class="story-item">✅ V4.5: STAR Story Generation</div>
          <div class="story-item">✅ V4.6: Likely Interview Questions</div>
          <div class="story-item">✅ V4.7: Interview Notes System</div>
          <div class="story-item">✅ V4.8: Interview Feedback Log</div>
          <div class="story-item">✅ V4.9: Thank You Email Generator</div>
          <div class="story-item">✅ V4.10: Coaching Companion</div>
        </div>
      </div>

      <div class="api-info">
        <h2>🔗 API Endpoints Available</h2>
        <div class="endpoints">
          <div class="endpoint-group">
            <h3>Company Research</h3>
            <code>GET /companies/{{ '{' }}id{{ '}' }}/snapshot</code>
            <code>GET /companies/{{ '{' }}id{{ '}' }}/brochure</code>
          </div>
          <div class="endpoint-group">
            <h3>Interview Preparation</h3>
            <code>GET /applications/{{ '{' }}id{{ '}' }}/interview-prep</code>
            <code>GET /applications/{{ '{' }}id{{ '}' }}/star-stories</code>
            <code>GET /applications/{{ '{' }}id{{ '}' }}/likely-questions</code>
            <code>POST /applications/{{ '{' }}id{{ '}' }}/interview-notes</code>
            <code>POST /applications/{{ '{' }}id{{ '}' }}/interview-feedback</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .v4-demo {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }

    .hero h1 {
      font-size: 3rem;
      color: #333;
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.3rem;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .feature-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .demo-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .demo-button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }

    .demo-button.primary {
      background: #007bff;
      color: white;
    }

    .demo-button.primary:hover {
      background: #0056b3;
    }

    .demo-button.secondary {
      background: #f8f9fa;
      color: #495057;
      border: 1px solid #dee2e6;
    }

    .demo-button.secondary:hover {
      background: #e9ecef;
    }

    .user-stories {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 3rem;
    }

    .user-stories h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }

    .stories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .story-item {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #28a745;
      font-weight: 500;
    }

    .api-info {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 2rem;
    }

    .api-info h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }

    .endpoints {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .endpoint-group h3 {
      color: #495057;
      margin-bottom: 1rem;
    }

    .endpoint-group code {
      display: block;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      font-family: 'Courier New', monospace;
      color: #d73a49;
    }

    @media (max-width: 768px) {
      .v4-demo {
        padding: 1rem;
      }

      .hero h1 {
        font-size: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .demo-links {
        flex-direction: column;
      }

      .endpoints {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class V4DemoComponent {}
