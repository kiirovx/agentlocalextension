import axios from "axios";
import { MODEL_NAME, OLLAMA_API } from "../utils/constants";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function askOllama(messages: ChatMessage[]) {
  const response = await axios.post(
    OLLAMA_API,
    {
      model: MODEL_NAME,
      stream: false,
      messages,
    },
    {
      timeout: 60000,
    },
  );

  return response.data.message.content;
}

export async function askOllamaStream(
  messages: ChatMessage[],
  onToken: (token: string) => void,
) {
  const response = await fetch(OLLAMA_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      stream: true,
      messages,
    }),
  });

  if (!response.body) {
    throw new Error("No stream returned.");
  }

  const reader = response.body.getReader();

  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");

    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;

      const json = JSON.parse(line);

      if (json.message?.content) {
        onToken(json.message.content);
      }
    }
  }
}
