/**
 * Base Agent Interface for V1 AI Agents
 * Implements the agent pattern described in the architecture docs
 */

export interface AgentContext {
  userId: string;
  jobId?: string;
  applicationId?: string;
  cvFacts?: any;
  jobDetail?: any;
  language?: string;
}

export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    model?: string;
    tokens?: number;
    duration?: number;
  };
}

export abstract class BaseAgent {
  protected abstract name: string;
  protected abstract version: string;

  protected async callLLM(prompt: string, schema?: any): Promise<any> {
    // TODO: Implement LLM integration (OpenAI/Azure OpenAI)
    // For now, return mock response
    console.log(`[${this.name}] LLM Call:`, prompt.substring(0, 100) + "...");
    return this.getMockResponse();
  }

  protected abstract getMockResponse(): any;

  protected validateRealityIndex(realityIndex: number): boolean {
    return realityIndex >= 0 && realityIndex <= 2;
  }

  protected logDecision(context: AgentContext, decision: any): void {
    console.log(`[${this.name}] Decision for ${context.userId}:`, decision);
  }
}
