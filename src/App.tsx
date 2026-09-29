import { useState } from "react";
import { useAgent } from "agents/react";
import { useAgentChat } from "@cloudflare/ai-chat/react";

export default function App() {
  const [sessionId, setSessionId] = useState(
    () => `session-${Date.now()}`
  );

  const agent = useAgent({
    agent: "JobPilotAgent",
    name: sessionId,
  });

  const {
    messages,
    sendMessage,
    clearHistory,
    status,
  } = useAgentChat({
    agent,
    resume: false,
    getInitialMessages: null,
  });

  function handleNewChat() {
    clearHistory();
    setSessionId(`session-${Date.now()}`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = event.currentTarget.elements.namedItem(
      "input"
    ) as HTMLInputElement;

    const text = input.value.trim();

    if (!text || status !== "ready") {
      return;
    }

    sendMessage({ text });

    input.value = "";
  }

  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>JobPilot</h1>
          <p>Your AI career assistant</p>
        </div>

        <div className="header-actions">

          <button
            type="button"
            className="new-chat-button"
            onClick={handleNewChat}
            disabled={status === "streaming"}
          >
            + New Chat
          </button>

          <div className="status">
            <span className="status-dot" />
            AI Online
          </div>

        </div>
      </header>

      <main className="chat">

        {messages.length === 0 && (
          <div className="welcome">
            <h2>Welcome to JobPilot 👋</h2>

            <p>
              I can help you analyze job descriptions, identify skill gaps,
              prepare for interviews, and track your applications.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.role === "user"
                ? "user"
                : "assistant"
            }`}
          >
            <div className="message-label">
              {message.role === "user"
                ? "You"
                : "JobPilot"}
            </div>

            <div className="message-content">
              {message.parts.map((part, index) => {
                if (part.type !== "text") {
                  return null;
                }

                return (
                  <span key={index}>
                    {part.text}
                  </span>
                );
              })}
            </div>
          </div>
        ))}

        {status === "streaming" && (
          <div className="message assistant">
            <div className="message-label">
              JobPilot
            </div>

            <div className="typing">
              Thinking...
            </div>
          </div>
        )}

      </main>

      <form
        className="input-area"
        onSubmit={handleSubmit}
      >
        <input
          name="input"
          placeholder="Ask JobPilot anything..."
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={status !== "ready"}
        >
          Send
        </button>
      </form>

    </div>
  );
}