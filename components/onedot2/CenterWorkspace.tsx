'use client'

import { useState, useRef, useEffect } from 'react'
import { DiffModal } from './DiffModal'
import { ModelColumn, ModelResponse } from './ModelColumn'

interface CenterWorkspaceProps {
  leftCollapsed: boolean
  activeModels: string[]
}

interface ModelColumnData {
  id: string
  name: string
  color: string
  responses: ModelResponse[]
}

export function CenterWorkspace({ leftCollapsed, activeModels }: CenterWorkspaceProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [models, setModels] = useState<ModelColumnData[]>([
    {
      id: 'mixtral-8x7b',
      name: 'Groq Mixtral 8x7B',
      color: '#ff6b4a',
      responses: [
        {
          id: '1',
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
          timestamp: '2024-01-15T10:30:00Z',
          latency: 1.2,
          tokens: 156
        }
      ]
    },
    {
      id: 'llama-3.1-70b',
      name: 'Groq Llama 3.1 70B',
      color: '#4a9eff',
      responses: [
        {
          id: '2',
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
          timestamp: '2024-01-15T10:31:00Z',
          latency: 0.8,
          tokens: 189
        }
      ]
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'OpenAI GPT-3.5 Turbo',
      color: '#10a37f',
      responses: [
        {
          id: '3',
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
          timestamp: '2024-01-15T10:32:00Z',
          latency: 1.5,
          tokens: 167
        }
      ]
    },
    {
      id: 'claude-3-sonnet',
      name: 'Anthropic Claude 3 Sonnet',
      color: '#d97757',
      responses: [
        {
          id: '4',
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
          timestamp: '2024-01-15T10:33:00Z',
          latency: 1.1,
          tokens: 142
        }
      ]
    },
    {
      id: 'gemini-pro',
      name: 'Google Gemini Pro',
      color: '#4285f4',
      responses: [
        {
          id: '5',
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
          timestamp: '2024-01-15T10:34:00Z',
          latency: 0.9,
          tokens: 178
        }
      ]
    },
    {
      id: 'mistral-7b',
      name: 'Mistral 7B',
      color: '#ff7000',
      responses: [
        {
          id: '6',
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
          timestamp: '2024-01-15T10:35:00Z',
          latency: 1.3,
          tokens: 152
        }
      ]
    },
    {
      id: 'qwen-72b',
      name: 'Qwen 72B',
      color: '#ff6a00',
      responses: [
        {
          id: '7',
          version: 'v1',
          content: `# Quantum Computing Technology

Quantum computing utilizes quantum mechanics principles to achieve computational capabilities beyond classical systems.

## Quantum Mechanics in Computing

### Superposition Principle
Qubits maintain multiple states simultaneously until measurement, enabling parallel computation paths.

### Quantum Entanglement
Correlations between qubits create powerful computational resources that have no classical analog.

### Quantum Interference
Constructive and destructive interference amplifies correct solutions while suppressing incorrect ones.

## Real-World Use Cases

**Pharmaceutical Industry**
- Molecular simulation for drug discovery
- Protein structure prediction
- Treatment optimization

**Financial Sector**
- Risk assessment modeling
- Trading strategy optimization
- Portfolio diversification

**Artificial Intelligence**
- Enhanced training algorithms
- Pattern recognition improvements
- Optimization of neural networks

The quantum computing industry is rapidly maturing with significant investments from tech giants and startups alike.`,
          timestamp: '2024-01-15T10:36:00Z',
          latency: 1.0,
          tokens: 165
        }
      ]
    },
    {
      id: 'deepseek-coder',
      name: 'DeepSeek Coder',
      color: '#1a56db',
      responses: [
        {
          id: '8',
          version: 'v1',
          content: `# Quantum Computing Architecture

Quantum computers leverage quantum mechanical phenomena to perform calculations that would be impractical for classical computers.

## Technical Foundation

### Qubit Implementation
- Superconducting circuits (IBM, Google)
- Trapped ions (IonQ, Honeywell)
- Topological qubits (Microsoft)
- Photonic systems (Xanadu)

### Quantum Algorithms
- **Shor's Algorithm**: Integer factorization
- **Grover's Algorithm**: Database search
- **VQE**: Variational quantum eigensolver
- **QAOA**: Quantum approximate optimization

## Development Challenges

1. Quantum error correction
2. Scalability issues
3. Maintaining coherence times
4. Temperature requirements
5. Software development tools

## Industry Adoption

Major players investing in quantum:
- IBM Quantum Network
- Amazon Braket
- Microsoft Azure Quantum
- Google Quantum AI

The quantum ecosystem is expanding rapidly with new frameworks, languages, and cloud platforms emerging.`,
          timestamp: '2024-01-15T10:37:00Z',
          latency: 1.4,
          tokens: 195
        }
      ]
    },
    {
      id: 'glm-4',
      name: 'Zhipu GLM-4',
      color: '#5b8def',
      responses: [
        {
          id: '9',
          version: 'v1',
          content: `# Understanding Quantum Computing

Quantum computing harnesses quantum mechanical properties to solve computational problems more efficiently than classical computers.

## Quantum Mechanics Fundamentals

### Wave-Particle Duality
Quantum objects exhibit both wave and particle properties, fundamental to quantum computation.

### Uncertainty Principle
Cannot simultaneously know exact position and momentum - affects measurement in quantum systems.

### Quantum Tunneling
Particles can traverse energy barriers, enabling novel computational pathways.

## Commercial Applications

**Logistics Optimization**
- Route planning
- Supply chain management
- Warehouse optimization

**Energy Sector**
- Grid optimization
- Battery material discovery
- Nuclear fusion modeling

**Telecommunications**
- Quantum networks
- Secure communication protocols
- Signal processing

## Future Outlook

Quantum computing is transitioning from research to practical applications. The next decade will likely see:
- Quantum advantage in specific domains
- Hybrid classical-quantum systems
- Quantum machine learning breakthroughs
- Standardization of quantum software

We are witnessing the dawn of the quantum era.`,
          timestamp: '2024-01-15T10:38:00Z',
          latency: 1.2,
          tokens: 183
        }
      ]
    }
  ])

  const [activeVersions, setActiveVersions] = useState<Record<string, string>>({
    'mixtral-8x7b': 'v1',
    'llama-3.1-70b': 'v1',
    'gpt-3.5-turbo': 'v1',
    'claude-3-sonnet': 'v1',
    'gemini-pro': 'v1',
    'mistral-7b': 'v1',
    'qwen-72b': 'v1',
    'deepseek-coder': 'v1',
    'glm-4': 'v1'
  })

  const [diffModal, setDiffModal] = useState<{
    isOpen: boolean
    models: Array<{
      id: string
      name: string
      color: string
      content: string
    }>
  }>({
    isOpen: false,
    models: []
  })

  const addNewVersion = (modelId: string) => {
    setModels(prev => prev.map(model => {
      if (model.id === modelId) {
        const newVersion = `v${model.responses.length + 1}`
        const newResponse: ModelResponse = {
          id: Date.now().toString(),
          version: newVersion,
          content: `# New Response - ${newVersion}\n\nGenerating new response...`,
          timestamp: new Date().toISOString(),
          latency: Math.random() * 2 + 0.5,
          tokens: Math.floor(Math.random() * 200) + 50
        }
        return {
          ...model,
          responses: [...model.responses, newResponse]
        }
      }
      return model
    }))
    setActiveVersions(prev => {
      const model = models.find(m => m.id === modelId)
      const numResponses = model ? model.responses.length : 0
      return {
        ...prev,
        [modelId]: `v${numResponses + 1}`
      }
    })
  }

  const handleVersionChange = (modelId: string, version: string) => {
    setActiveVersions(prev => ({
      ...prev,
      [modelId]: version
    }))
  }

  const openDiffModal = (modelId: string) => {
    // Get all active models (all models that are currently selected/visible)
    const activeModelsList = models.filter(model => activeModels.includes(model.id))
    
    if (activeModelsList.length === 0) return
    
    // Get active responses for all active models
    const comparisonModels = activeModelsList.map(model => {
      const activeVersion = activeVersions[model.id] || model.responses[0]?.version || 'v1'
      const activeResponse = model.responses.find(r => r.version === activeVersion) || model.responses[0]
      
      return {
        id: model.id,
        name: model.name,
        color: model.color,
        content: activeResponse?.content || ''
      }
    }).filter(m => m.content) // Only include models with content
    
    if (comparisonModels.length > 0) {
      setDiffModal({
        isOpen: true,
        models: comparisonModels
      })
    }
  }

  const activeModelsList = models.filter(model => activeModels.includes(model.id))
  const activeCount = activeModelsList.length
  
  // Calculate column width: if 2 or less, full width; if 3+, show 3 full + peek of 4th
  const getColumnWidth = () => {
    if (activeCount <= 2) {
      return `${100 / activeCount}%`
    } else {
      // Show 3 full columns + a bit of 4th (approximately 3.2 columns visible)
      return `${100 / 3.2}%`
    }
  }

  // Handle smooth scroll snapping one model at a time
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || activeCount <= 2) return

    let scrollTimeout: NodeJS.Timeout
    let isSnapping = false

    const handleScroll = () => {
      if (isSnapping) return

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        snapToNearestModel()
      }, 100)
    }

    const snapToNearestModel = () => {
      if (!container || isSnapping) return
      
      isSnapping = true
      const containerWidth = container.clientWidth
      const scrollLeft = container.scrollLeft
      const columnWidth = containerWidth / 3.2
      
      // Calculate which model we should snap to (one at a time)
      const currentModelIndex = Math.round(scrollLeft / columnWidth)
      const targetScroll = currentModelIndex * columnWidth
      
      // Ensure we don't scroll beyond bounds
      const maxScroll = container.scrollWidth - containerWidth
      const clampedScroll = Math.max(0, Math.min(targetScroll, maxScroll))
      
      container.scrollTo({
        left: clampedScroll,
        behavior: 'smooth'
      })

      setTimeout(() => {
        isSnapping = false
      }, 300)
    }

    // Handle wheel events - move one model at a time
    const handleWheel = (e: WheelEvent) => {
      if (isSnapping) {
        e.preventDefault()
        return
      }

      // Only handle horizontal scrolling (even small amounts)
      if (Math.abs(e.deltaX) > 0) {
        e.preventDefault()
        e.stopPropagation()
        
        const containerWidth = container.clientWidth
        const columnWidth = containerWidth / 3.2
        const currentScroll = container.scrollLeft
        
        // Determine direction based on scroll delta
        // Even small scrolls should move to next/previous model
        const direction = e.deltaX > 0 ? 1 : -1
        
        // Calculate current model index
        const currentModelIndex = Math.round(currentScroll / columnWidth)
        
        // Move to next or previous model
        const targetModelIndex = currentModelIndex + direction
        const targetScroll = targetModelIndex * columnWidth
        
        // Ensure we don't scroll beyond bounds
        const maxScroll = container.scrollWidth - containerWidth
        const clampedScroll = Math.max(0, Math.min(targetScroll, maxScroll))
        
        // Only move if we're not already at the target
        if (Math.abs(clampedScroll - currentScroll) > 10) {
          isSnapping = true
          container.scrollTo({
            left: clampedScroll,
            behavior: 'smooth'
          })

          setTimeout(() => {
            isSnapping = false
          }, 300)
        }
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('wheel', handleWheel)
      clearTimeout(scrollTimeout)
    }
  }, [activeCount, activeModelsList])

  return (
    <div className="flex-1 bg-black overflow-hidden w-full">
      <div 
        ref={scrollContainerRef}
        className="h-full w-full flex overflow-x-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#333333 #0a0a0a',
          scrollBehavior: 'smooth',
          userSelect: 'none',
          padding: '12px',
          gap: '12px'
        }}
      >
        {activeModelsList.map((model) => (
          <ModelColumn
            key={model.id}
            id={model.id}
            name={model.name}
            color={model.color}
            responses={model.responses}
            activeVersion={activeVersions[model.id] || 'v1'}
            onVersionChange={(version) => handleVersionChange(model.id, version)}
            onAddVersion={() => addNewVersion(model.id)}
            onOpenDiff={() => openDiffModal(model.id)}
            width={getColumnWidth()}
          />
        ))}
      </div>

      {/* Diff Modal */}
      <DiffModal
        isOpen={diffModal.isOpen}
        onClose={() => setDiffModal(prev => ({ ...prev, isOpen: false }))}
        models={diffModal.models}
      />
    </div>
  )
}