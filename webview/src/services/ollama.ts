export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaResponse {
  message?: {
    content: string;
  };
  done: boolean;
}

const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "qwen2.5-coder:7b";

/**
 * Non-streaming version (untuk backward compatibility)
 */
export async function askOllama(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.message?.content || "";
}

/**
 * Streaming version - callback dipanggil untuk setiap token
 */
export async function askOllamaStreaming(
  messages: ChatMessage[],
  onToken: (token: string) => void
): Promise<string> {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error("No response body from Ollama");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        try {
          const json: OllamaResponse = JSON.parse(line);
          
          if (json.message?.content) {
            const token = json.message.content;
            fullResponse += token;
            onToken(token); // 🔥 Emit setiap token
          }

          if (json.done) {
            return fullResponse;
          }
        } catch {
          // Skip invalid JSON lines
          console.warn("Failed to parse Ollama chunk:", line);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullResponse;
}