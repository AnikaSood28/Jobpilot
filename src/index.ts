import { routeAgentRequest } from "agents";

export { JobPilotAgent } from "./JobPilotAgent";

export default {
  async fetch(request, env) {
    return (
      (await routeAgentRequest(request, env)) ??
      new Response("JobPilot is running 🚀", {
        status: 200,
      })
    );
  },
} satisfies ExportedHandler<Env>;
