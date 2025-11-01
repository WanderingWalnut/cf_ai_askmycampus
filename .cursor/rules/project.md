# AskMyCampus - Cloudflare AI Assistant Project Rules

## Project Overview

AskMyCampus is a lightweight AI-powered campus assistant built on Cloudflare's full stack:

- **Frontend**: React + Vite on Cloudflare Pages
- **Backend**: Hono framework on Cloudflare Workers
- **AI**: Workers AI with Llama 3.3 model
- **State/Memory**: KV store or Durable Objects for conversation context
- **Architecture**: Edge-first, serverless, globally distributed

## Tech Stack & Patterns

### Core Technologies

- **Runtime**: Cloudflare Workers (edge compute)
- **Framework**: Hono 4.x for API routing
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6.x
- **AI Model**: Llama 3.3 via Workers AI binding
- **State**: Cloudflare KV for simple storage, Durable Objects for complex state/coordination

### Code Organization

- `src/worker/` - Worker backend logic (Hono routes, AI orchestration, memory management)
- `src/react-app/` - React frontend components
- `public/` - Static assets
- Worker endpoints: `/api/*` for backend APIs

### Development Commands

- `npm run dev` - Start local dev server (Vite HMR + Wrangler)
- `npm run build` - Build for production
- `npm run deploy` - Deploy to Cloudflare
- `npm run cf-typegen` - Generate TypeScript types for bindings

## AI Assistant Architecture

### Key Components Required

1. **LLM Integration**: Workers AI binding with Llama 3.3
2. **Chat Interface**: React frontend with message history
3. **Memory/Context**: Store conversation history (KV or Durable Objects)
4. **Orchestration**: Worker routes handling chat requests, AI calls, and state updates
5. **Real-time**: Consider WebSockets or Server-Sent Events for live updates

### Implementation Patterns

#### Workers AI Integration

```typescript
// Use Workers AI binding pattern
async function callAI(messages: Message[], env: Env) {
  const response = await env.AI.run("@cf/meta/llama-3.3-8b-instruct", {
    messages: messages,
    stream: true, // For streaming responses
  });
  return response;
}
```

#### Memory Management

- Store conversation history per user/session in KV or Durable Object
- Maintain context window efficiently (consider summarization for long conversations)
- Use KV for simple key-value storage, Durable Objects for transactional or complex state

#### API Route Structure

- `POST /api/chat` - Handle chat messages, call AI, update memory
- `GET /api/history/:sessionId` - Retrieve conversation history
- `DELETE /api/history/:sessionId` - Clear conversation history
- Use Hono's type-safe request/response handling

## Code Standards

### TypeScript

- Always use strict TypeScript types
- Define `Env` interface for Cloudflare bindings (AI, KV, Durable Objects)
- Use TypeScript interfaces for API request/response shapes
- Generate types with `npm run cf-typegen` after adding bindings

### Error Handling

- Use try-catch blocks for all async operations
- Return appropriate HTTP status codes (200, 400, 500)
- Log errors appropriately for debugging in production
- Handle AI API failures gracefully with user-friendly messages

### React Patterns

- Use functional components with hooks
- Implement proper loading states for AI responses
- Handle streaming responses if using streaming AI
- Use TypeScript for all components and props

### Wrangler Configuration

- Keep `wrangler.json` updated with correct bindings
- Document all bindings (AI, KV namespaces, Durable Objects) in comments
- Use environment-specific configs when needed

## Cloudflare-Specific Guidelines

### Workers AI

- Use `@cf/meta/llama-3.3-8b-instruct` model
- Implement streaming for better UX
- Handle rate limits and errors gracefully
- Optimize prompts for concise, context-aware responses

### Bindings

- Add bindings to `wrangler.json` for AI, KV, Durable Objects
- Use `wrangler dev` environment variables for local testing
- Never commit secrets - use `wrangler secret put` for production

### Deployment

- Build before deploying: `npm run build && npm run deploy`
- Test locally with `npm run dev` before deploying
- Use Wrangler's observability features for monitoring

### Performance

- Leverage edge compute for low latency
- Minimize cold starts with proper Worker configuration
- Use KV efficiently (avoid unnecessary reads/writes)
- Consider caching for frequently accessed data

## Project-Specific Requirements

### Assignment Requirements

This project must demonstrate:

- ✅ LLM integration (Llama 3.3 on Workers AI)
- ✅ Workflow/coordination (Workers + Durable Objects or KV)
- ✅ User input via chat (React frontend + Pages)
- ✅ Memory/state persistence (KV or Durable Objects)

### Documentation

- Maintain clear, comprehensive README.md with setup and running instructions
- Document all AI prompts used in PROMPTS.md
- Include API documentation in code comments

### Code Quality

- Follow ESLint rules (already configured)
- Write self-documenting code with clear variable names
- Add comments for complex AI prompt engineering or state management logic
- Keep components modular and reusable

## AI Assistant Behavior

- Focus on campus-related queries (schedules, locations, services, general info)
- Maintain conversational context across messages
- Provide helpful, accurate responses
- Handle edge cases gracefully (unclear questions, out-of-scope topics)

## When Adding Features

1. Check if it requires new Cloudflare bindings (update wrangler.json)
2. Update TypeScript types with `npm run cf-typegen`
3. Test locally with `npm run dev`
4. Update README.md if needed
5. Document AI prompts in PROMPTS.md if they're new or modified

## Common Patterns to Follow

### Hono Route Handler

```typescript
app.post("/api/chat", async (c) => {
  try {
    const { message, sessionId } = await c.req.json();
    // Validate input
    // Retrieve context from KV/Durable Object
    // Call Workers AI
    // Save response to memory
    // Return response
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
```

### React Chat Component

```typescript
// Use useState for messages, sessionId
// Use useEffect for initializing session
// Handle streaming responses if applicable
// Implement proper error boundaries
```

## Prohibited Patterns

- Don't hardcode API keys or secrets
- Don't commit `wrangler.toml` with secrets
- Don't use Node.js-specific APIs (use Web APIs instead)
- Don't create blocking operations in Workers
- Don't ignore TypeScript errors

## Testing & Debugging

- Use `wrangler tail` to monitor live logs
- Test AI responses with various inputs
- Verify memory persistence across requests
- Check edge cases and error scenarios

