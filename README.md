# ZplitGPT

![ZplitGPT Logo](./public/ZplitGPT.svg)

**The AI Aggregator Built for Developers Who Actually Use AI Models**

ZplitGPT is a powerful AI aggregator platform that lets you compare multiple AI models side-by-side in real-time. Unlike other aggregators that hide behind credit systems and middle layers, ZplitGPT gives you direct API access with full control over your budget, models, and costs.

## Why ZplitGPT Exists: The AI Fiesta Problem

After using AI Fiesta and similar aggregators, we noticed critical issues that made them unsuitable for serious AI work:

### Problems with AI Fiesta & Similar Platforms:
- **Opaque Credit Systems**: Credits don't map to actual API costs, making budgeting impossible
- **Inconsistent Responses**: Middle layers and caching cause unpredictable behavior
- **No Budget Control**: You can't see or control actual API costs
- **Limited Model Access**: Premium models locked behind paywalls, not actual API availability
- **Made for General Users**: Designed to hide complexity, not empower developers
- **Fake Tokens**: Abstracted token systems that don't reflect real usage
- **Random Limits**: Arbitrary restrictions that don't align with your actual API quotas

### How ZplitGPT Solves This:

✅ **Bring Your Own API Keys** - Full control over your budget and costs  
✅ **Direct API Integration** - No middle layer, no fake tokens, just real API calls  
✅ **Transparent Pricing** - Pay only for platform access, optional database features  
✅ **Side-by-Side Comparison** - See how different models think in real-time  
✅ **Full Model Control** - Access all models your API keys support  
✅ **Advanced Configuration** - Fine-tune every parameter exactly as you need  
✅ **Built for Developers** - No abstraction, no simplification, just control

The name ZplitGPT comes from splitting your screen and perspective to see AI behavior clearly. It's not a product trying to simplify AI for general users—it's a sharp tool built for people who understand how AI models actually work.

## Features

### Core Aggregator Features

- **Multi-Model Aggregation**: Access 15+ AI providers (OpenAI, Anthropic, Google, Meta, Mistral, and more) from a single interface
- **Side-by-Side Comparison**: Run multiple models simultaneously in separate columns to see differences in real-time
- **Bring Your Own API Keys**: Use your own API keys for complete budget control—you pay providers directly
- **Direct API Integration**: No middle layer, no fake tokens, no abstraction—just direct API calls
- **Real-Time Responses**: See how different models respond to the same prompt simultaneously

### Advanced Control

- **Full Model Control**: Choose any model your API keys support—no artificial restrictions
- **Advanced Parameters**: Fine-tune temperature, top-p, top-k, frequency penalty, presence penalty, and stop sequences
- **Parameter Presets**: Save and reuse custom parameter configurations
- **Personalized Context Management**: Set personalized prompts that apply to all models for consistent comparisons

### Context Management System

ZplitGPT provides a sophisticated three-tier context management system that gives you complete control over how AI models understand your instructions and remember information across conversations. This system is designed to optimize token usage while maintaining precise control over what context is included in each conversation.

#### System Context (Global Context)

System Context is your global instruction set that applies across all chats and conversations. This is managed through the System Context component accessible from the top navigation bar. Think of it as your default personality and behavior settings for all AI interactions.

**How it works:**
- System Context is stored globally and persists across all chats
- When you set a System Context, it becomes the base instruction for all models in all conversations
- You can create, save, and manage multiple System Context templates
- Each System Context can define role, expertise, communication style, or specific guidelines
- The System Context is automatically included in every API call, ensuring consistent behavior across all models

**Use cases:**
- Define your preferred AI assistant personality ("You are a helpful technical assistant")
- Set domain expertise ("You are an expert React developer")
- Establish communication preferences ("Provide concise, code-first responses")
- Create specialized personas for different types of work

**Current implementation:** System Context is managed through the System Context modal accessible via the Command Dock button in the top navigation. All contexts are stored in browser localStorage and persist across sessions.

#### Chat Memory

Chat Memory is conversation-specific context that applies only to individual chats. This is managed through the Chat Memory component, accessible via the Brain icon in the top navigation. Unlike System Context which is global, Chat Memory allows you to provide context that is specific to a particular conversation thread.

**How it works:**
- Chat Memory is stored per chat and only included in that specific conversation
- You can add multiple memory items to a single chat
- Chat Memory supplements System Context with conversation-specific information
- Memories can include user preferences, project details, ongoing tasks, or context from previous messages in that chat
- Each chat maintains its own independent memory collection

**Use cases:**
- Store project-specific information ("Working on a Next.js e-commerce site")
- Remember user preferences for that conversation ("User prefers TypeScript examples")
- Track conversation context ("Discussing authentication implementation")
- Maintain thread-specific knowledge that shouldn't apply globally

**Current implementation:** Chat Memory is managed through the Chat Memory modal. Memories are stored in browser localStorage with chat-specific keys, allowing each conversation to maintain its own context independently.

#### Flow: Context Selection System

Flow is ZplitGPT's intelligent context management interface that solves a critical problem: token optimization when starting new conversations. When you have multiple System Contexts and Chat Memories saved, you don't want to waste tokens by including irrelevant context in every new chat. Flow allows you to selectively choose which contexts to bring into a new conversation.

**The problem Flow solves:**
- Without Flow, starting a new chat might include all your saved System Contexts and Memories
- This wastes tokens on irrelevant information
- It can also confuse models with conflicting or unnecessary context
- Flow lets you curate exactly what context is relevant for each new conversation

**How Flow works:**
- Flow Modal displays all your saved System Contexts in the left panel
- The right panel shows your Chat Memory items
- You can move System Contexts into Chat Memory by clicking the arrow button
- When you start a new chat, only the contexts you've selected in Flow are included
- This gives you precise control over token usage and context relevance

**Workflow:**
1. Open Flow Modal before starting a new chat
2. Review your available System Contexts in the left panel
3. Select relevant contexts by moving them to the Chat Memory panel (right side)
4. Start your new chat with only the selected contexts included
5. The LLM receives only the relevant context, saving tokens and improving response quality

**Visual indicators:**
- Selected contexts are highlighted with an orange border and background tint
- Newly added contexts to Chat Memory show a cyan "New" badge that fades after 3 seconds
- The interface clearly shows which contexts are active for the upcoming conversation

**Current implementation:** Flow Modal is accessible through the Flow button and provides a split-panel interface. System Contexts are stored in `Zplitgpt-flow-contexts` in localStorage, while Chat Memories for Flow are stored in `Zplitgpt-flow-memories`. The modal maintains a 2:1 aspect ratio (width to height) for optimal viewing of both panels simultaneously.

**Benefits:**
- Reduces token usage by excluding irrelevant context
- Improves response quality by providing only relevant information
- Gives you explicit control over what the AI knows in each conversation
- Prevents context pollution from unrelated previous work
- Allows you to create focused, purpose-specific conversations

This three-tier system (System Context, Chat Memory, and Flow) provides granular control over context management, enabling you to optimize both token costs and conversation quality. You can maintain a rich library of contexts while ensuring each conversation only includes what's necessary.

### Organization & Management

- **Project Management**: Organize your comparisons into projects with full chat history
- **Chat History**: Save and revisit conversations (optional feature with database storage)
- **Version Comparison**: Compare different versions of model responses side-by-side
- **Diff View**: Visual comparison of responses from different models

### Developer Experience

- **Clean Interface**: Minimal, focused UI that gets out of your way
- **Transparent Costs**: See exactly what you're paying—no hidden fees or credit confusion
- **Full Control**: Configure everything exactly as you need it

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Getting Started

1. **Set Up Your API Keys**: 
   - Add your API keys for the AI providers you want to use (OpenAI, Anthropic, Google, etc.)
   - Your keys are stored securely and used directly—we never see or store your API responses
   
2. **Select Models**: 
   - Choose which models to compare from the model selector
   - All models your API keys support are available—no premium restrictions
   
3. **Configure Parameters**: 
   - Adjust temperature, top-p, top-k, and other parameters in Advanced Controls
   - Save parameter presets for quick reuse
   - Set personalized context that applies to all models
   
4. **Send Prompts**: 
   - Type your prompt and watch all selected models respond side-by-side
   - See real-time responses as they stream in
   
5. **Compare Results**: 
   - View differences in reasoning, tone, and quality across models
   - Use the diff view to compare responses visually
   - Save versions to compare different iterations
   
6. **Manage Projects**: 
   - Organize your comparisons into projects
   - Save chat history (optional Pro feature)
   - Revisit and compare past conversations

## Pricing & Cost Control

### Transparent Pricing Model

ZplitGPT uses a transparent pricing model that gives you complete control:

1. **Platform Access Fee**: A small monthly fee for using the platform (covers infrastructure and development)
2. **Your API Costs**: You pay AI providers directly using your own API keys—we never touch your API costs
3. **Optional Database Features**: 
   - **Free Tier**: Basic usage without saved context or chat history
   - **Pro Tier**: Save personalized context and chat history (covers database storage costs, similar to ChatGPT's model)

### Why This Model?

- **Full Budget Control**: You see and control every dollar spent on AI APIs
- **No Hidden Markups**: We don't mark up API costs—you pay providers directly
- **Fair Platform Fee**: Small fee for the platform, optional fee for database features
- **Transparent Costs**: No credit confusion, no fake tokens, just real costs

### Comparison to AI Fiesta

| Feature | AI Fiesta | ZplitGPT |
|---------|-----------|----------|
| API Key Support | ❌ No | ✅ Yes (Bring Your Own) |
| Budget Control | ❌ Opaque credits | ✅ Full transparency |
| Direct API Access | ❌ Middle layer | ✅ Direct integration |
| Model Restrictions | ❌ Premium paywalls | ✅ All models available |
| Cost Visibility | ❌ Hidden markups | ✅ Direct provider costs |
| Database Features | ❌ Included (unclear cost) | ✅ Optional (transparent) |
| Developer Focus | ❌ General users | ✅ Built for developers |

## Philosophy

ZplitGPT is built on a simple principle: **give users full control and direct access**. 

- No artificial limits or credit systems
- No abstraction layer between you and the models
- No hidden costs or unexpected behavior
- Just your API keys, your models, and transparent results

It's a tool for people who understand AI models and want to see them work, not a product trying to simplify things for general users.

## Supported AI Providers

ZplitGPT aggregates models from 15+ AI providers:

- **OpenAI**: GPT-3.5 Turbo, GPT-4, GPT-4 Turbo
- **Anthropic**: Claude 3 Haiku, Claude 3 Sonnet, Claude 3 Opus
- **Google**: Gemini Pro, Gemini Flash, Gemini Ultra
- **Meta**: Llama 3.1 70B, Llama 3.1 8B, Llama 3.1 405B
- **Mistral AI**: Mistral 7B, Mixtral 8x7B, Mistral Large
- **Qwen**: Qwen 72B
- **xAI**: Grok 2
- **Perplexity**: Perplexity 70B
- **Zhipu AI**: GLM-4
- **DeepSeek**: DeepSeek Coder
- **Moonshot AI**: Moonshot v1
- **Amazon**: Titan Text
- **Nous Research**: Hermes 2
- **Cerebras**: Cerebras GPT

*More providers added regularly. All models available based on your API key access.*

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible, unstyled components
- **Lucide React** - Beautiful icon library
- **Prisma** - Database ORM (for optional chat history)
- **Z-AI SDK** - Direct AI API integration

## Current Frontend State

This README documents the current frontend implementation of ZplitGPT. All context management features (System Context, Chat Memory, and Flow) are fully implemented in the frontend using browser localStorage for persistence. The interface provides complete control over context selection and management, with all three tiers of the context system operational and ready for integration with backend API calls.

The frontend architecture supports:
- Real-time context management through modal interfaces
- Persistent storage of contexts and memories across browser sessions
- Visual feedback for context selection and state changes
- Split-panel interfaces for managing multiple contexts simultaneously
- Independent storage keys for different context types to prevent conflicts

All features described in this documentation are currently available in the frontend interface and ready for use.

## Assets

The project includes the following logo and icon assets in the `public` folder:

- **ZplitGPT.svg** - Main logo in SVG format (used in UI components)
- **ZplitGPT.png** - Main logo in PNG format (used for Apple touch icons and social sharing)
- **favicon.ico** - Browser favicon (used in browser tabs and bookmarks)

## License

Private project. No one else can use it or copy it.

---

Built for developers, by developers who actually use AI models.
