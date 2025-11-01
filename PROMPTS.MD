# Development Prompts

## Prompt 1: Basic Chat UI Implementation

**Date:** 2025-11-01

### Original Prompt:

You are working in a repo called cf_ai_askmycampus, created from the Cloudflare vite-react template.

Task:

1. Create a basic chat UI in React:

   - A chat history area that shows messages in order.

   - An input box and a Send button.

   - Local state for `messages` (array of { role: "user" | "assistant", content: string }).

   - On Send:

     - Append the user's message to local state immediately.

     - POST to `/api/chat` with { sessionId, message } as JSON.

     - Read the JSON response `{ reply }` and append that as `{ role: "assistant", content: reply }`.

2. Generate or reuse a `sessionId` and store it in `localStorage` so it persists across page reloads:

   - On first load, if no sessionId exists, create a random UUID and store it.

   - Include `sessionId` in the POST body.

3. Add very simple styling (just flex/column, scrollable history div, nothing fancy).

4. Update the main App component (or create a Chat component and render it from App) so that when I run the dev server I see the chat box.

5. Also, append THIS EXACT prompt text and a short summary of what code you generated to a file called `PROMPTS.md` at the repo root. If `PROMPTS.md` doesn't exist yet, create it.

Notes:

- Don't wire up the backend call logic yet beyond the fetch(`/api/chat`). The /api/chat Worker doesn't exist yet – that's the next step.

- Keep the code clean and readable, TypeScript if the template is TS, JS if the template is JS.

- Do not add any external component libraries.

Goal:

I want a minimal working chat UI that can talk to `/api/chat` once I implement the backend.

### Summary of Generated Code:

Created a fully functional chat UI with the following components:

1. **Chat.tsx** - Main chat component with:

   - TypeScript interface for Message type (user/assistant roles)
   - UUID generation function for sessionId
   - localStorage integration for persistent sessionId across page reloads
   - Local state management for messages array
   - Async fetch call to `/api/chat` endpoint with sessionId and message in POST body
   - Error handling for failed API calls
   - Auto-scrolling to bottom on new messages
   - Loading state during API calls
   - Enter key support for sending messages

2. **Chat.css** - Simple, clean styling with:

   - Flexbox column layout for full-height chat container
   - Scrollable message history area
   - Distinct styling for user vs assistant messages (blue for user, gray for assistant)
   - Responsive input area with Send button
   - Empty state message when no chat history exists

3. **App.tsx** - Updated to render the Chat component instead of boilerplate content

4. **index.css** - Modified body and #root styles to support full-height chat layout

The implementation uses no external libraries, is fully TypeScript-typed, and ready to connect to the backend `/api/chat` endpoint once implemented.

---

## Prompt 2: Worker API Chat Endpoint Implementation

**Date:** 2025-11-01

### Original Prompt:

You are editing the cf_ai_askmycampus project created from the Cloudflare vite-react template.

Goal:

Implement a Worker route `/api/chat` that will act as the coordination layer for the AI assistant.

Requirements:

1. Create (or update) the Worker entrypoint so it handles a POST request to `/api/chat`.

   - Parse JSON from the request body: `{ sessionId, message }`.

   - If either is missing, return 400.

2. Conversation memory:

   - We'll be using a KV namespace for memory. For now:

     - Assume we have a binding called `CHAT_HISTORY` (Cloudflare KV).

     - Key is the `sessionId`.

     - Value is a JSON string of an array of messages shaped like:

       `{ role: "user" | "assistant", content: string }[]`.

   - On each request:

     - Get the history from KV (if missing, default to `[]`).

     - Append the new user message to the history.

     - Build a prompt string for the LLM from that history. For now just join messages like:

       "user: ...\nassistant: ...\nuser: ...\n"

     - Call a placeholder `generateAssistantReply(prompt)` function (see #3).

     - Append the assistant reply to history.

     - Save the updated history back to KV under that same `sessionId`.

3. Stub the LLM call:

   - Implement `async function generateAssistantReply(prompt: string, env: Env): Promise<string>`.

   - For now, DO NOT call a real model. Just return something like:

     `"This is a placeholder AI response based on: " + prompt.slice(0, 200)`

   - We will later replace this with a real Workers AI (Llama 3.3) call.

4. Response:

   - Return JSON `{ reply: <assistantReply> }` so the frontend can render it.

5. Types / bindings:

   - Define an `Env` interface that includes:

     - `CHAT_HISTORY: KVNamespace` (for KV)

   - Make sure the fetch handler is `export default { fetch(request, env) { ... } }` or whatever pattern the template uses.

   - Use TypeScript if the Worker is TS, JS if the Worker is JS. Match the template.

6. Add/update `wrangler.toml`:

   - Add a KV binding stub so we remember to wire it up for real deploy:

     [[kv_namespaces]]

     binding = "CHAT_HISTORY"

     id = "CHAT_HISTORY_DEV"

   - If the template already has wrangler.toml, modify it instead of creating a duplicate. If something similar already exists, extend it.

   - If wrangler.toml is managed differently in this template, follow that structure.

7. Make sure CORS / headers are fine for local dev:

   - Return a Response with `content-type: application/json`.

   - You can assume same-origin fetch from the React dev server for now, so no need to overcomplicate CORS.

8. IMPORTANT FOR THE ASSIGNMENT:

   - Append THIS EXACT prompt and a short summary of the code you generated to `PROMPTS.md` at the repo root. If `PROMPTS.md` exists, append. If it doesn't, create it.

   - The summary in PROMPTS.md should mention:

     - Added /api/chat route

     - KV-based memory per sessionId

     - placeholder LLM function

     - updated wrangler.toml with KV binding

After this change, I should be able to:

- run wrangler dev

- send a POST to /api/chat with { sessionId, message }

- get back { reply: "placeholder..." }

- and see that memory is persisted per session in KV.

### Summary of Generated Code:

Implemented the `/api/chat` Worker endpoint with full conversation memory using Cloudflare KV:

1. **worker/index.ts** - Updated Worker with:

   - Added `Env` interface with `CHAT_HISTORY: KVNamespace` binding
   - Added `Message` interface for type safety (role: "user" | "assistant", content: string)
   - Implemented POST `/api/chat` route that:
     - Validates required fields (sessionId, message) and returns 400 if missing
     - Retrieves conversation history from KV by sessionId (defaults to empty array if new)
     - Appends user message to history
     - Builds a formatted prompt string from conversation history
     - Calls placeholder `generateAssistantReply()` function
     - Appends assistant reply to history
     - Saves updated history back to KV
     - Returns JSON response `{ reply: assistantReply }`
   - Created `generateAssistantReply()` placeholder function that returns mock response with prompt preview
   - Created `buildPrompt()` helper function to format conversation history as "role: content" lines
   - Added error handling with try/catch and proper error responses

2. **wrangler.json** - Added KV namespace binding:
   - Added `kv_namespaces` array with CHAT_HISTORY binding
   - Set binding name as "CHAT_HISTORY" and id as "CHAT_HISTORY_DEV" for development
   - Added documentation comments for the KV configuration

The implementation:

- Uses Hono framework (already in template) with proper TypeScript typing
- Returns JSON responses with correct content-type headers (handled by Hono's c.json())
- Maintains conversation context per sessionId in KV
- Ready for local testing with `wrangler dev` or `npm run dev`
- Placeholder LLM function is ready to be replaced with real Workers AI (Llama 3.3) call in the next step
