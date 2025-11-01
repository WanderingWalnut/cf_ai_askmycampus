import { Hono } from "hono";

// Define the environment bindings
interface Env {
	CHAT_HISTORY: KVNamespace;
}

// Message type for conversation history
interface Message {
	role: "user" | "assistant";
	content: string;
}

const app = new Hono<{ Bindings: Env }>();

// Placeholder LLM function - will be replaced with real Workers AI later
async function generateAssistantReply(prompt: string, env: Env): Promise<string> {
	// This is a placeholder. Will be replaced with Llama 3.3 call later.
	return "This is a placeholder AI response based on: " + prompt.slice(0, 200);
}

// Helper function to build prompt from message history
function buildPrompt(messages: Message[]): string {
	return messages
		.map((msg) => `${msg.role}: ${msg.content}`)
		.join("\n") + "\n";
}

// Existing health check endpoint
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Chat endpoint
app.post("/api/chat", async (c) => {
	try {
		// Parse request body
		const body = await c.req.json();
		const { sessionId, message } = body;

		// Validate required fields
		if (!sessionId || !message) {
			return c.json(
				{ error: "Missing required fields: sessionId and message" },
				400
			);
		}

		// Get existing conversation history from KV
		const historyJson = await c.env.CHAT_HISTORY.get(sessionId);
		const history: Message[] = historyJson ? JSON.parse(historyJson) : [];

		// Append the new user message
		const userMessage: Message = { role: "user", content: message };
		history.push(userMessage);

		// Build prompt from conversation history
		const prompt = buildPrompt(history);

		// Generate assistant reply (placeholder for now)
		const assistantReply = await generateAssistantReply(prompt, c.env);

		// Append assistant reply to history
		const assistantMessage: Message = {
			role: "assistant",
			content: assistantReply,
		};
		history.push(assistantMessage);

		// Save updated history back to KV
		await c.env.CHAT_HISTORY.put(sessionId, JSON.stringify(history));

		// Return the assistant's reply
		return c.json({ reply: assistantReply });
	} catch (error) {
		console.error("Error in /api/chat:", error);
		return c.json(
			{ error: "Internal server error" },
			500
		);
	}
});

export default app;
