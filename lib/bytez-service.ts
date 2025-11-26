/**
 * Bytez API Service
 * Wrapper around bytez.js SDK for chat completions
 */

import Bytez from 'bytez.js'
import type { ChatMessage, ModelInferenceResponse } from './types'

// Initialize Bytez SDK
const getBytezClient = () => {
    const apiKey = process.env.BYTEZ_API_KEY

    if (!apiKey || apiKey === 'demo_key_replace_me') {
        throw new Error('BYTEZ_API_KEY is not configured. Please add your API key to .env.local')
    }

    return new Bytez(apiKey)
}

/**
 * Run inference on a single model
 */
export async function runModelInference(
    modelId: string,
    messages: ChatMessage[],
    temperature: number = 0.7,
    maxTokens: number = 2000
): Promise<ModelInferenceResponse> {
    const startTime = Date.now()

    try {
        const sdk = getBytezClient()
        const model = sdk.model(modelId)

        // Convert messages to Bytez format
        const input = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }))

        // Run model without streaming (bytez.js uses simple input only)
        const { error, output } = await model.run(input)

        if (error) {
            throw new Error(error)
        }

        const endTime = Date.now()
        const latency = (endTime - startTime) / 1000 // Convert to seconds

        // Extract text content from output
        let content = ''
        if (typeof output === 'string') {
            content = output
        } else if (output && typeof output === 'object') {
            // Handle different output formats
            content = JSON.stringify(output)
        }

        // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
        const tokens = Math.ceil(content.length / 4)

        return {
            modelId,
            content,
            latency,
            tokens
        }
    } catch (err) {
        const endTime = Date.now()
        const latency = (endTime - startTime) / 1000

        const error = err as Error
        return {
            modelId,
            content: '',
            latency,
            tokens: 0,
            error: error.message || 'Unknown error occurred'
        }
    }
}

/**
 * Run inference on multiple models in parallel
 */
export async function runMultiModelInference(
    modelIds: string[],
    messages: ChatMessage[],
    temperature: number = 0.7,
    maxTokens: number = 2000
): Promise<ModelInferenceResponse[]> {
    const promises = modelIds.map(modelId =>
        runModelInference(modelId, messages, temperature, maxTokens)
    )

    return Promise.all(promises)
}

/**
 * Stream inference from a single model
 */
export async function streamModelInference(
    modelId: string,
    messages: ChatMessage[],
    temperature: number = 0.7,
    maxTokens: number = 2000
): Promise<ReadableStream> {
    try {
        const sdk = getBytezClient()
        const model = sdk.model(modelId)

        // Convert messages to Bytez format
        const input = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }))

        // Run model with streaming (bytez uses third param for streaming)
        const readStream = await model.run(input, undefined, true)

        // Create a ReadableStream that emits chunks
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const tokens of readStream) {
                        const chunk = JSON.stringify({
                            modelId,
                            chunk: tokens,
                            done: false
                        })
                        controller.enqueue(new TextEncoder().encode(chunk + '\n'))
                    }

                    // Send done signal
                    const doneChunk = JSON.stringify({
                        modelId,
                        chunk: '',
                        done: true
                    })
                    controller.enqueue(new TextEncoder().encode(doneChunk + '\n'))
                    controller.close()
                } catch (error) {
                    const err = error as Error
                    controller.error(err)
                }
            }
        })

        return stream
    } catch (err) {
        const error = err as Error
        throw new Error(`Streaming failed for ${modelId}: ${error.message}`)
    }
}
