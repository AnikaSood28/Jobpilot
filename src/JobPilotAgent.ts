import { AIChatAgent } from "@cloudflare/ai-chat";
import { createWorkersAI } from "workers-ai-provider";
import { convertToModelMessages, streamText } from "ai";

export class JobPilotAgent extends AIChatAgent<Env> {
  async onChatMessage() {
    const workersai = createWorkersAI({
      binding: this.env.AI,
    });

    const result = streamText({
      model: workersai(
        "@cf/meta/llama-3.3-70b-instruct-fp8-fast"
      ),

      system: `
You are JobPilot, an AI career assistant.

Help users with:
- Software engineering job searches
- Job description analysis
- Skill-gap identification
- Interview preparation
- Application tracking

Be concise and natural.

When a user asks what you can do, explain your capabilities briefly.

When analyzing a job description, provide:
1. Required skills
2. Matching skills
3. Missing skills
4. Interview preparation suggestions

Never repeat words, sentences, or sections unnecessarily.
`,

      messages: await convertToModelMessages(this.messages),
    });

    return result.toUIMessageStreamResponse();
  }
}