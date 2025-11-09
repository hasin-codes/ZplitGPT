# Zplitgpt

![ZplitGPT Logo](./public/ZplitGPT.svg)

**A clean, direct AI model comparison tool built for developers and AI enthusiasts.**

## The Story

Zplitgpt started as an experiment after trying AI Fiesta for a while and realizing it wasn't built for people who actually understand how AI models work. Fiesta looked good but it felt more like a closed playground — credits didn't make sense, responses were inconsistent, and users had no real control over models or cost. It was made for general users, not for those who wanted to test, compare, and actually understand what each model is doing.

So Zplitgpt was made to fix that. It's a clean web app that lets you connect to real APIs directly, pick your own models, and run them side by side in a single screen. No fake tokens, no middle layer, no random limits. Just your API key, your models, and full control over what happens.

The goal is simple: make a space where you can compare how different LLMs think using the same prompt. Every model runs in its own column, so you can literally see the differences in reasoning, tone, and quality at once. It's built for developers, AI tinkerers, and anyone who likes understanding why one model answers differently than another.

The name Zplitgpt comes from that idea — splitting your screen and your perspective to see AI behavior clearly. It's not a product or a social platform. It's just a sharp tool built to work exactly how enthusiasts expect it to.

## Features

- **Direct API Integration**: Connect directly to real AI APIs — no middle layer, no fake tokens
- **Side-by-Side Comparison**: Run multiple models simultaneously in separate columns
- **Full Model Control**: Choose your own models, configure parameters, and control costs
- **Advanced Parameters**: Fine-tune temperature, top-p, top-k, frequency penalty, and more
- **Project Management**: Organize your comparisons into projects with chat history
- **Clean Interface**: Minimal, focused UI that gets out of your way
- **Real-Time Comparison**: See how different models respond to the same prompt in real-time

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

1. **Set Up Your API Keys**: Configure your API keys for the models you want to use
2. **Select Models**: Choose which models to compare from the model selector
3. **Configure Parameters**: Adjust temperature, top-p, and other parameters in Advanced Controls
4. **Send Prompts**: Type your prompt and watch all selected models respond side-by-side
5. **Compare Results**: See the differences in reasoning, tone, and quality across models
6. **Manage Projects**: Organize your comparisons into projects with full chat history

## Philosophy

Zplitgpt is built on a simple principle: **give users full control and direct access**. 

- No artificial limits or credit systems
- No abstraction layer between you and the models
- No hidden costs or unexpected behavior
- Just your API keys, your models, and transparent results

It's a tool for people who understand AI models and want to see them work, not a product trying to simplify things for general users.

## Technology Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons

## Assets

The project includes the following logo and icon assets in the `public` folder:

- **ZplitGPT.svg** - Main logo in SVG format (used in UI components)
- **ZplitGPT.png** - Main logo in PNG format (used for Apple touch icons and social sharing)
- **favicon.ico** - Browser favicon (used in browser tabs and bookmarks)

## License

Private project. No one else can use it or copy it.

---

Built for developers, by developers who actually use AI models.
