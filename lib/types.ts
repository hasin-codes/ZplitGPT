/**
 * Shared TypeScript types for Bytez API integration
 */

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export interface ModelInferenceRequest {
    modelId: string
    messages: ChatMessage[]
    temperature?: number
    maxTokens?: number
    stream?: boolean
}

export interface ModelInferenceResponse {
    modelId: string
    content: string
    latency: number
    tokens: number
    error?: string
}

export interface StreamChunk {
    modelId: string
    chunk: string
    done: boolean
}

export interface BytezError {
    message: string
    code?: string
    modelId?: string
}
