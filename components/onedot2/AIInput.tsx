'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AIInputProps {
  leftCollapsed: boolean
  selectedChat: string
  onChatNameUpdate: (chatId: string, name: string) => void
}

export function AIInput({ leftCollapsed, selectedChat, onChatNameUpdate }: AIInputProps) {
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = Math.min(scrollHeight, 120) + 'px'
    }
  }, [input])

  // Reset hasSentFirstMessage when chat changes
  useEffect(() => {
    setHasSentFirstMessage(false)
  }, [selectedChat])

  const generateChatName = (prompt: string): string => {
    // Extract first few words (up to 4 words, max 30 characters)
    const words = prompt.trim().split(/\s+/).slice(0, 4)
    let name = words.join(' ')
    if (name.length > 30) {
      name = name.substring(0, 27) + '...'
    }
    return name || 'New Chat'
  }

  const handleSend = async () => {
    if (!input.trim() || isSending) return

    setIsSending(true)
    
    // Update chat name based on first prompt
    if (!hasSentFirstMessage && input.trim()) {
      const chatName = generateChatName(input.trim())
      onChatNameUpdate(selectedChat, chatName)
      setHasSentFirstMessage(true)
    }
    
    // Simulate sending prompt
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Sending prompt:', input)
    setInput('')
    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-center gap-3 bg-[#111111] border border-[#333333] rounded-lg px-4 py-3 focus-within:border-[#ff4f2b] transition-colors">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start typing..."
            className="flex-1 bg-transparent border-none resize-none text-[#f5f5f5] placeholder-[#666666] focus:outline-none focus:ring-0 min-h-[24px] max-h-[120px] overflow-y-auto text-sm font-mono"
            rows={1}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#333333 transparent'
            }}
          />

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            size="sm"
            className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

