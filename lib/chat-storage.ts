/**
 * Chat Storage Utility
 * Manages chat data persistence using localStorage
 */

export interface ChatMessage {
  id: string
  prompt: string
  timestamp: string
  modelResponses: {
    [modelId: string]: {
      id: string
      version: string
      content: string
      timestamp: string
      latency: number
      tokens: number
    }[]
  }
}

export interface ChatData {
  id: string
  title: string
  timestamp: string
  lastModified: string
  messages: ChatMessage[]
}

const CHAT_STORAGE_KEY = 'zplitgpt-chats'
const CHAT_HISTORY_KEY = 'zplitgpt-chat-history'

/**
 * Get all chats from storage
 */
export function getAllChats(): ChatData[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading chats:', error)
    return []
  }
}

/**
 * Get a specific chat by ID
 */
export function getChatById(chatId: string): ChatData | null {
  const chats = getAllChats()
  return chats.find(chat => chat.id === chatId) || null
}

/**
 * Save or update a chat
 */
export function saveChat(chat: ChatData): void {
  if (typeof window === 'undefined') return
  
  try {
    const chats = getAllChats()
    const existingIndex = chats.findIndex(c => c.id === chat.id)
    
    if (existingIndex >= 0) {
      chats[existingIndex] = chat
    } else {
      chats.unshift(chat) // Add new chats to the beginning
    }
    
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats))
    updateChatHistory(chat)
  } catch (error) {
    console.error('Error saving chat:', error)
  }
}

/**
 * Delete a chat
 */
export function deleteChat(chatId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const chats = getAllChats()
    const filtered = chats.filter(c => c.id !== chatId)
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(filtered))
    
    // Also remove from history
    const history = getChatHistory()
    const filteredHistory = history.filter(c => c.id !== chatId)
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(filteredHistory))
  } catch (error) {
    console.error('Error deleting chat:', error)
  }
}

/**
 * Clone a chat (create a copy with new ID)
 */
export function cloneChat(chatId: string): ChatData | null {
  if (typeof window === 'undefined') return null
  
  try {
    const originalChat = getChatById(chatId)
    if (!originalChat) return null
    
    const newChatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    const clonedChat: ChatData = {
      ...originalChat,
      id: newChatId,
      title: `${originalChat.title} (Copy)`,
      timestamp: now,
      lastModified: now,
      messages: originalChat.messages.map(msg => ({
        ...msg,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        modelResponses: Object.fromEntries(
          Object.entries(msg.modelResponses).map(([modelId, responses]) => [
            modelId,
            responses.map(resp => ({
              ...resp,
              id: `resp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }))
          ])
        )
      }))
    }
    
    saveChat(clonedChat)
    return clonedChat
  } catch (error) {
    console.error('Error cloning chat:', error)
    return null
  }
}

/**
 * Get chat history (for sidebar)
 */
export function getChatHistory(): Array<{ id: string; title: string; timestamp: string }> {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading chat history:', error)
    return []
  }
}

/**
 * Update chat history (simplified version for sidebar)
 */
function updateChatHistory(chat: ChatData): void {
  if (typeof window === 'undefined') return
  
  try {
    const history = getChatHistory()
    const existingIndex = history.findIndex(c => c.id === chat.id)
    
    const historyItem = {
      id: chat.id,
      title: chat.title,
      timestamp: chat.lastModified || chat.timestamp
    }
    
    if (existingIndex >= 0) {
      history[existingIndex] = historyItem
    } else {
      history.unshift(historyItem)
    }
    
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Error updating chat history:', error)
  }
}

/**
 * Create a new empty chat (not saved until first message is sent)
 */
export function createNewChat(): ChatData {
  const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const now = new Date().toISOString()
  
  const newChat: ChatData = {
    id: chatId,
    title: 'New Chat',
    timestamp: now,
    lastModified: now,
    messages: []
  }
  
  // Don't save to storage yet - will be saved when first message is sent
  return newChat
}

/**
 * Add a message to a chat
 * If chat doesn't exist in storage, it will be created and saved
 */
export function addMessageToChat(chatId: string, message: ChatMessage): void {
  let chat = getChatById(chatId)
  
  // If chat doesn't exist, create it (for new chats that weren't saved yet)
  if (!chat) {
    const now = new Date().toISOString()
    chat = {
      id: chatId,
      title: 'New Chat',
      timestamp: now,
      lastModified: now,
      messages: []
    }
  }
  
  chat.messages.push(message)
  chat.lastModified = new Date().toISOString()
  
  // Save chat (this will create it if it's new, or update if it exists)
  saveChat(chat)
}

/**
 * Update chat title
 */
export function updateChatTitle(chatId: string, title: string): void {
  const chat = getChatById(chatId)
  if (!chat) return
  
  chat.title = title
  chat.lastModified = new Date().toISOString()
  saveChat(chat)
}

/**
 * Initialize demo chat with quantum computing content
 * This creates a demo chat if it doesn't exist
 */
export function initializeDemoChat(): void {
  if (typeof window === 'undefined') return
  
  const DEMO_CHAT_ID = 'demo-quantum-computing'
  
  // Check if demo chat already exists
  const existingChat = getChatById(DEMO_CHAT_ID)
  if (existingChat) return
  
  const now = new Date().toISOString()
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  
  const demoChat: ChatData = {
    id: DEMO_CHAT_ID,
    title: 'Quantum computing basics',
    timestamp: twoHoursAgo,
    lastModified: twoHoursAgo,
    messages: [
      {
        id: 'msg-1',
        prompt: 'Explain quantum computing',
        timestamp: twoHoursAgo,
        modelResponses: {
          'mixtral-8x7b': [
            {
              id: 'resp-1',
              version: 'v1',
              content: `# Understanding Quantum Computing

Quantum computing represents a fundamental shift in how we process information. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or "qubits" that can exist in superposition.

## Key Principles

1. **Superposition**: Qubits can be in multiple states simultaneously
2. **Entanglement**: Qubits can be correlated in ways that classical bits cannot
3. **Interference**: Quantum states can interfere constructively or destructively

## Applications

- Cryptography and security
- Drug discovery and molecular modeling
- Optimization problems
- Machine learning and AI

The field is rapidly evolving with companies like IBM, Google, and startups making significant advances in hardware and algorithms.`,
              timestamp: twoHoursAgo,
              latency: 1.2,
              tokens: 156
            }
          ],
          'llama-3.1-70b': [
            {
              id: 'resp-2',
              version: 'v1',
              content: `# Quantum Computing: A Revolutionary Paradigm

Quantum computing harnesses the strange properties of quantum mechanics to solve problems that are intractable for classical computers.

## Core Concepts

### Qubits and Superposition
Unlike classical bits that are either 0 or 1, qubits leverage superposition to exist in multiple states at once. This exponential scaling enables quantum computers to process vast amounts of information simultaneously.

### Quantum Entanglement
When qubits become entangled, measuring one instantly affects the other, regardless of distance. This "spooky action at a distance" enables powerful computational correlations.

## Practical Impact

**Current Applications:**
- Quantum chemistry simulations
- Financial portfolio optimization
- Weather prediction models
- Cryptographic analysis

**Future Potential:**
- Breaking current encryption standards
- Simulating complex biological systems
- Revolutionizing artificial intelligence

The quantum advantage becomes apparent for specific problem classes where quantum algorithms offer exponential speedups over their classical counterparts.`,
              timestamp: twoHoursAgo,
              latency: 0.8,
              tokens: 189
            }
          ],
          'gpt-3.5-turbo': [
            {
              id: 'resp-3',
              version: 'v1',
              content: `# Quantum Computing Explained

Quantum computing is an emerging technology that uses quantum mechanical phenomena to process information in fundamentally new ways.

## What Makes Quantum Computing Different?

### Quantum Bits (Qubits)
- Classical bits: 0 or 1
- Quantum bits: 0, 1, or both simultaneously (superposition)

### Key Quantum Phenomena

**Superposition**
- Allows qubits to exist in multiple states at once
- Enables parallel processing of information

**Entanglement**
- Creates correlations between qubits
- Allows for complex computational relationships

**Quantum Interference**
- Can amplify correct answers and cancel wrong ones
- Essential for quantum algorithm speedups

## Real-World Applications

1. **Cryptography**: Breaking and creating secure communications
2. **Drug Discovery**: Simulating molecular interactions
3. **Financial Modeling**: Optimizing complex portfolios
4. **Artificial Intelligence**: Enhancing machine learning algorithms

## Current State

Major tech companies including Google, IBM, Microsoft, and various startups are racing to build practical quantum computers. While we're still in early stages, progress is accelerating rapidly.

The field represents one of the most exciting frontiers in modern technology.`,
              timestamp: twoHoursAgo,
              latency: 1.5,
              tokens: 167
            }
          ],
          'claude-3-sonnet': [
            {
              id: 'resp-4',
              version: 'v1',
              content: `# Quantum Computing: An Introduction

Quantum computing leverages quantum mechanics to process information in ways that classical computers cannot match.

## Foundational Principles

### Superposition
A qubit can exist in a combination of 0 and 1 states simultaneously, enabling massive parallelism in computation.

### Entanglement
Quantum particles can be correlated such that the state of one instantly influences another, regardless of distance.

### Measurement
Observing a quantum state causes it to "collapse" into a definite classical state.

## Practical Applications

- **Cryptography**: Quantum key distribution for secure communication
- **Optimization**: Solving complex logistics and scheduling problems
- **Simulation**: Modeling molecular and chemical processes
- **Machine Learning**: Quantum algorithms for pattern recognition

## Challenges

Building practical quantum computers faces significant hurdles:
- Maintaining quantum coherence
- Error correction
- Scaling to large numbers of qubits
- Operating at near-absolute zero temperatures

The technology is still in its infancy but shows tremendous promise.`,
              timestamp: twoHoursAgo,
              latency: 1.1,
              tokens: 142
            }
          ],
          'gemini-pro': [
            {
              id: 'resp-5',
              version: 'v1',
              content: `# The Quantum Revolution

Quantum computing is poised to revolutionize computing by exploiting quantum mechanical properties.

## Core Quantum Principles

**Superposition**: Unlike classical bits that are either 0 or 1, qubits can be both simultaneously. This allows quantum computers to explore many solutions in parallel.

**Entanglement**: Quantum particles can be linked so that measuring one affects the other instantaneously, even across vast distances.

**Quantum Tunneling**: Particles can pass through energy barriers, enabling novel computational approaches.

## Industry Impact

### Healthcare
- Drug discovery acceleration
- Protein folding simulation
- Personalized medicine optimization

### Finance
- Portfolio optimization
- Risk analysis
- Fraud detection

### Technology
- AI and machine learning enhancement
- Materials science
- Climate modeling

## Current Progress

Companies like IBM, Google, and IonQ are making rapid strides. Google claimed "quantum supremacy" in 2019, and the field continues to advance exponentially.`,
              timestamp: twoHoursAgo,
              latency: 0.9,
              tokens: 178
            }
          ],
          'mistral-7b': [
            {
              id: 'resp-6',
              version: 'v1',
              content: `# Quantum Computing Overview

Quantum computing represents a paradigm shift in computation, utilizing quantum mechanics to solve complex problems.

## Key Concepts

### Qubits
The fundamental unit of quantum information. Unlike classical bits, qubits can exist in superposition states.

### Quantum Gates
Operations that manipulate qubit states, analogous to logic gates in classical computing but with quantum properties.

### Decoherence
The loss of quantum properties due to environmental interference - a major challenge in quantum computing.

## Applications

1. Cryptanalysis and quantum-resistant encryption
2. Optimization problems (traveling salesman, resource allocation)
3. Quantum chemistry and materials science
4. Machine learning and neural networks

## Timeline

- 1980s: Theoretical foundations laid
- 2000s: First experimental quantum computers
- 2010s: Cloud-based quantum computing access
- 2020s: Approaching practical quantum advantage

The future of computing is quantum.`,
              timestamp: twoHoursAgo,
              latency: 1.3,
              tokens: 152
            }
          ]
        }
      }
    ]
  }
  
  saveChat(demoChat)
}

