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
