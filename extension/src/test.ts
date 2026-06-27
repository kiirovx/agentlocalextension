import { askOllama } from "./llm/ollama";

(async () => {
    try {
        const reply = await askOllama([
            {
                role: "user",
                content: "Halo"
            }
        ]);

        console.log(reply);
    } catch (err) {
        console.error(err);
    }
})();