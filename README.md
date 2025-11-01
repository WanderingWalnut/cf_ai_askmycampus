# AskMyCampus - AI Campus Assistant

An AI-powered chat assistant built on Cloudflare's edge platform for the **Cloudflare Internship Assignment**. AskMyCampus helps University of Calgary students get instant answers to campus-related questions using natural conversation.

## 🏗️ Architecture

Built entirely on Cloudflare's platform:

- **Frontend**: React + Vite (served via Cloudflare Pages)
- **Backend**: Cloudflare Workers (Hono framework)
- **AI**: Workers AI (Llama 3.3 70B Instruct)
- **Storage**: KV Namespace (conversation memory)
- **Language**: TypeScript

## ✅ Assignment Requirements

This project fulfills all four required components:

### 1. **LLM Integration**

- Uses **Cloudflare Workers AI** with the `@cf/meta/llama-3.3-70b-instruct-fp8-fast` model
- System prompt configures the AI as a University of Calgary campus assistant
- Responses are direct, friendly, and student-focused

### 2. **Multi-Step Workflow**

- **User Input** → Parse & validate (Worker)
- **Memory Retrieval** → Load conversation history from KV by sessionId
- **Context Building** → Format chat history into prompt
- **AI Inference** → Call Workers AI with full conversation context
- **Persistence** → Save updated conversation to KV
- **Response** → Return AI reply to frontend

### 3. **User Input via Chat Interface**

- Clean, responsive React chat UI
- Real-time message display with user/assistant distinction
- Persistent session management via localStorage
- Auto-scrolling, loading states, and error handling
- Enter key support for quick messaging

### 4. **Conversation Memory**

- Each user gets a unique `sessionId` (UUID) stored in localStorage
- Full conversation history persisted in **Cloudflare KV**
- Messages stored as JSON array: `{ role: "user" | "assistant", content: string }[]`
- Context maintained across page reloads and multiple conversations
- Each request loads history, adds new messages, and saves back to KV

## 🚀 Run Locally

### Prerequisites

```bash
npm install -g wrangler
wrangler login
```

### Setup & Development

```bash
# Install dependencies
npm install

# Run development server (recommended)
npm run dev
```

This starts the integrated dev environment with:

- React frontend with hot reload (Vite)
- Worker backend with KV and AI bindings
- Automatic routing between frontend/backend

The app will be available at `http://localhost:5173`


Or test the Worker directly:

```bash
# Build frontend first
npm run build

# Run Worker with wrangler
npx wrangler dev
```

## 📁 Project Structure

```
cf_ai_askmycampus/
├── src/
│   ├── react-app/          # Frontend React application
│   │   ├── Chat.tsx         # Main chat component
│   │   ├── Chat.css         # Chat UI styles
│   │   └── App.tsx          # Root component
│   └── worker/
│       └── index.ts         # Worker API (POST /api/chat)
├── wrangler.json            # Cloudflare Worker configuration
└── PROMPTS.MD               # Development log with prompts
```

## 🔌 API Endpoints

### POST `/api/chat`

Chat with the AI assistant.

**Request:**

```json
{
  "sessionId": "uuid-v4-string",
  "message": "What time does the library close?"
}
```

**Response:**

```json
{
  "reply": "The Taylor Family Digital Library is typically open..."
}
```

**Error Responses:**

- `400` - Missing required fields (sessionId or message)
- `500` - Internal server error

## 🎯 Key Features

- ✅ **Serverless & Edge-Native**: Runs entirely on Cloudflare's global network
- ✅ **Persistent Sessions**: Conversation history maintained across reloads
- ✅ **Context-Aware AI**: Full conversation context sent with each request
- ✅ **Clean UI**: Modern, responsive chat interface
- ✅ **Error Handling**: Graceful fallbacks for network/API errors
- ✅ **TypeScript**: Fully typed for safety and maintainability

## 🧪 Testing the Chat

1. Start the dev server: `npm run dev`
2. Open `http://localhost:5173`
3. Type a message like "Tell me about the University of Calgary"
4. The AI will respond with campus-specific information
5. Refresh the page - your conversation persists!
6. Open DevTools → Application → Local Storage to see your `sessionId`

## 📦 Deployment

Deploy to Cloudflare Workers:

```bash
npm run build
npm run deploy
```

This will:

1. Build the React frontend
2. Deploy the Worker with AI and KV bindings
3. Serve the SPA from Worker assets

**Note**: You'll need to create a production KV namespace and update `wrangler.json`:

```bash
wrangler kv:namespace create "CHAT_HISTORY"
# Update wrangler.json with the returned namespace ID
```

## 🔧 Configuration

### Worker Bindings

Configured in `wrangler.json`:

```json
{
  "kv_namespaces": [
    {
      "binding": "CHAT_HISTORY",
      "id": "CHAT_HISTORY_DEV"
    }
  ],
  "ai": {
    "binding": "AI"
  }
}
```

### AI Model

Using **Llama 3.3 70B Instruct (FP8 Fast)** - optimized for speed and quality.

Model ID: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`

## 📝 Development Log

See [PROMPTS.MD](./PROMPTS.MD) for detailed development prompts and implementation summaries.

## 🛠️ Tech Stack

| Component | Technology             |
| --------- | ---------------------- |
| Runtime   | Cloudflare Workers     |
| Framework | Hono                   |
| Frontend  | React 19 + Vite 6      |
| AI        | Workers AI (Llama 3.3) |
| Storage   | KV Namespace           |
| Language  | TypeScript             |
| Styling   | Vanilla CSS            |

## 📄 License

See [LICENSE](./LICENSE) file for details.

---

**Built with ☁️ on Cloudflare's Edge Platform**
