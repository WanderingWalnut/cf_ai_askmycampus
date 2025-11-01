import { Hono } from "hono";

// Define the environment bindings
interface Env {
	CHAT_HISTORY: KVNamespace;
	AI: {
		run: (
			model: string,
			input: {
				messages: Array<{
					role: "system" | "user" | "assistant";
					content: string;
				}>;
			}
		) => Promise<{ response: string }>;
	};
}

// Message type for conversation history
interface Message {
	role: "user" | "assistant";
	content: string;
}

const app = new Hono<{ Bindings: Env }>();

// Call Cloudflare Workers AI (Llama 3.3 instruct model)
async function generateAssistantReply(prompt: string, env: Env): Promise<string> {
	const result = await env.AI.run(
		"@cf/meta/llama-3.3-70b-instruct-fp8-fast",
		{
			messages: [
				{
					role: "system",
					content:
						"You are AskMyCampus, a helpful campus assistant for the University of Calgary. Be direct, friendly, and concise. Answer like a student peer, not a corporate chatbot. Make sure you give relevant University of Calgary information only"
				},
				{
					role: "user",
					content: prompt
				}
			]
		}
	);

	return result.response;
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
