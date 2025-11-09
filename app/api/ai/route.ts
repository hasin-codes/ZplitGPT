import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, temperature, maxTokens, stream } = await request.json()

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create the completion request
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 2048,
      stream: stream || false
    })

    if (stream) {
      // Handle streaming response
      return new NextResponse(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of completion) {
                const text = chunk.choices[0]?.delta?.content || ''
                if (text) {
                  controller.enqueue(new TextEncoder().encode(text))
                }
              }
              controller.close()
            } catch (error) {
              controller.error(error)
            }
          }
        }),
        {
          headers: {
            'Content-Type': 'text/plain',
            'Transfer-Encoding': 'chunked',
          },
        }
      )
    } else {
      // Handle non-streaming response
      const messageContent = completion.choices[0]?.message?.content || ''
      
      return NextResponse.json({
        response: messageContent,
        model: model || 'default',
        usage: completion.usage,
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}

