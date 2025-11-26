import { NextRequest, NextResponse } from 'next/server'
import { runMultiModelInference } from '@/lib/bytez-service'
import type { ChatMessage } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { modelIds, messages, temperature = 0.7, maxTokens = 2000 } = body

        // Validate input
        if (!modelIds || !Array.isArray(modelIds) || modelIds.length === 0) {
            return NextResponse.json(
                { error: 'modelIds is required and must be a non-empty array' },
                { status: 400 }
            )
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'messages is required and must be a non-empty array' },
                { status: 400 }
            )
        }

        // Validate message format
        const validMessages: ChatMessage[] = messages.map((msg: any) => {
            if (!msg.role || !msg.content) {
                throw new Error('Each message must have role and content')
            }
            return {
                role: msg.role,
                content: msg.content
            }
        })

        // Run inference on all models in parallel
        const responses = await runMultiModelInference(
            modelIds,
            validMessages,
            temperature,
            maxTokens
        )

        return NextResponse.json({
            success: true,
            responses
        })
    } catch (error) {
        console.error('Chat API error:', error)
        const err = error as Error

        // Check for API key error
        if (err.message.includes('BYTEZ_API_KEY')) {
            return NextResponse.json(
                {
                    error: 'API key not configured',
                    message: 'Please add your BYTEZ_API_KEY to .env.local file'
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: err.message
            },
            { status: 500 }
        )
    }
}
