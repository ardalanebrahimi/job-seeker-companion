import { Component, OnInit, input, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

// Mock types for demonstration (in production these would come from SDK)
interface CompanySnapshot {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  industry: string;
  size?: string;
  headquarters?: string;
  summary: string;
  recentNews: Array<{
    title: string;
    url?: string;
    date: string;
    summary: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface InterviewPrepPack {
  id: string;
  applicationId: string;
  companySnapshot: CompanySnapshot;
  fitBrief: {
    fitReasons: Array<{
      reason: string;
      evidence: string;
      strength: 'high' | 'medium' | 'low';
    }>;
  };
  starStories: Array<{
    id: string;
    title: string;
    category: string;
    situation: string;
    task: string;
    action: string;
    result: string;
  }>;
  likelyQuestions: Array<{
    question: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tips?: string[];
  }>;
  roleSpecificTips: string[];
  exportUrl?: string;
  createdAt: string;
}

@Component({
  selector: "app-interview-hub",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./interview-hub.component.html",
  styleUrls: ["./interview-hub.component.scss"],
})
export class InterviewHubComponent implements OnInit {
  applicationId = input<string>('');
  
  companySnapshot: CompanySnapshot | null = null;
  interviewPrepPack: InterviewPrepPack | null = null;
  loading = false;
  error: string | null = null;

  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Get applicationId from route params if not provided as input
    const routeApplicationId = this.route.snapshot.paramMap.get('id');
    const appId = this.applicationId() || routeApplicationId;
    
    if (appId) {
      this.loadInterviewHub(appId);
    }
  }

  async loadInterviewHub(applicationId?: string) {
    const targetApplicationId = applicationId || this.applicationId() || this.route.snapshot.paramMap.get('id');
    if (!targetApplicationId) return;

    this.loading = true;
    this.error = null;

    try {
      // Mock data for demonstration - in production this would call the actual API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const mockSnapshot: CompanySnapshot = {
        id: "company-123",
        name: "Tech Corp",
        logo: "https://via.placeholder.com/120x120?text=TC",
        website: "https://techcorp.com",
        industry: "Software Technology",
        size: "500-1000 employees",
        headquarters: "San Francisco, CA",
        summary: "Tech Corp is a leading software company specializing in enterprise solutions.",
        recentNews: [
          {
            title: "Tech Corp Raises $50M Series B",
            url: "https://example.com/news/1",
            date: "2024-01-15",
            summary: "Company secures funding for expansion into European markets"
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockPrepPack: InterviewPrepPack = {
        id: `prep-${targetApplicationId}`,
        applicationId: targetApplicationId,
        companySnapshot: mockSnapshot,
        fitBrief: {
          fitReasons: [
            {
              reason: "Strong technical leadership experience",
              evidence: "Led multiple cross-functional teams in complex projects",
              strength: 'high'
            },
            {
              reason: "Proven track record in performance optimization",
              evidence: "Consistently improved system performance by 40-60%",
              strength: 'high'
            },
            {
              reason: "Experience with enterprise software development",
              evidence: "5+ years building scalable enterprise solutions",
              strength: 'medium'
            }
          ]
        },
        starStories: [
          {
            id: "star-1",
            title: "Led Cross-Functional Team Project",
            category: "Leadership",
            situation: "Our team needed to deliver a critical feature with tight deadline and multiple stakeholders",
            task: "Lead coordination between engineering, design, and product teams to ensure timely delivery",
            action: "Organized daily standups, created clear documentation, and facilitated communication between teams",
            result: "Delivered the feature 2 days ahead of schedule with 98% stakeholder satisfaction"
          },
          {
            id: "star-2", 
            title: "Optimized System Performance",
            category: "Technical",
            situation: "Customer complaints about slow application response times were increasing",
            task: "Identify performance bottlenecks and implement solutions to improve user experience",
            action: "Conducted profiling analysis, optimized database queries, and implemented caching strategies",
            result: "Reduced average response time by 60% and improved customer satisfaction scores by 35%"
          }
        ],
        likelyQuestions: [
          {
            category: "Technical",
            question: "How do you approach debugging complex technical issues?",
            difficulty: 'medium',
            tips: ["Use systematic debugging approach", "Leverage logging and monitoring tools", "Break down complex problems into smaller parts"]
          },
          {
            category: "Technical", 
            question: "Describe your experience with our tech stack",
            difficulty: 'easy',
            tips: ["Research the company's technology stack beforehand", "Relate your experience to their specific tools"]
          },
          {
            category: "Technical",
            question: "How do you ensure code quality in your projects?",
            difficulty: 'medium',
            tips: ["Discuss code reviews, testing strategies", "Mention CI/CD practices", "Talk about documentation standards"]
          },
          {
            category: "Behavioral",
            question: "Tell me about a time you had to work with a difficult team member",
            difficulty: 'hard',
            tips: ["Focus on resolution and positive outcomes", "Show empathy and communication skills", "Demonstrate conflict resolution abilities"]
          },
          {
            category: "Behavioral",
            question: "How do you handle tight deadlines and pressure?",
            difficulty: 'medium',
            tips: ["Give specific examples", "Show prioritization skills", "Demonstrate stress management techniques"]
          },
          {
            category: "Company-Specific",
            question: "Why are you interested in working at Tech Corp?",
            difficulty: 'easy',
            tips: ["Research company values and mission", "Connect your goals with company objectives", "Show genuine enthusiasm"]
          }
        ],
        roleSpecificTips: [
          "Review the latest developments in cloud-based enterprise solutions",
          "Prepare examples of scalable system design from your experience", 
          "Research Tech Corp's recent product launches and market positioning",
          "Be ready to discuss your experience with remote team collaboration"
        ],
        exportUrl: `https://storage.example.com/prep-packs/${targetApplicationId}.pdf`,
        createdAt: new Date().toISOString()
      };

      this.companySnapshot = mockSnapshot;
      this.interviewPrepPack = mockPrepPack;
    } catch (err) {
      this.error = 'Failed to load interview preparation data';
      console.error('Error loading interview hub:', err);
    } finally {
      this.loading = false;
    }
  }

  downloadPrepPack() {
    if (this.interviewPrepPack?.exportUrl) {
      window.open(this.interviewPrepPack.exportUrl, "_blank");
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
