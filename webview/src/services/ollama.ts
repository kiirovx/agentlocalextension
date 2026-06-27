const OLLAMA_API = "http://127.0.0.1:11434/api/chat";
const MODEL_NAME = "qwen3:8b";

export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function askOllama(messages: OllamaMessage[]): Promise<string> {
  const res = await fetch(OLLAMA_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL_NAME, stream: false, messages }),
  });
  const data = await res.json();
  return data.message?.content || "";
}
