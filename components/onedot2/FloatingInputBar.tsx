'use client'

import { useState, useRef, useEffect } from 'react'
import { Paperclip, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface FloatingInputBarProps {
  leftCollapsed: boolean
  rightCollapsed: boolean
}

export function FloatingInputBar({ leftCollapsed, rightCollapsed }: FloatingInputBarProps) {
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const maxHeight = 120 // 4 lines * 30px per line (approximate)
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px'
    }
  }, [input])

  const handleSend = async () => {
    if (!input.trim() || isSending) return

    setIsSending(true)
    
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

  // Calculate dimensions for layered layout
  const leftWidth = leftCollapsed ? 64 : 240
  const rightWidth = rightCollapsed ? 64 : 260
  const inputLeft = leftWidth + 16 // 16px margin from left sidebar
  const inputRight = rightWidth + 16 // 16px margin from right sidebar
  const inputWidth = `calc(100vw - ${inputLeft + inputRight}px)`

  return (
    <div 
      className="fixed bottom-6 z-50 transition-all duration-300 ease-in-out"
      style={{
        left: `${inputLeft}px`,
        right: `${inputRight}px`,
        width: inputWidth
      }}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#ff4f2b] opacity-20 blur-lg rounded-2xl" />
        
        {/* Main input container */}
        <div className="relative bg-[#111111] border border-[#333333] rounded-2xl shadow-2xl overflow-hidden">
          {/* Top gradient border */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 opacity-60"
            style={{
              background: 'linear-gradient(90deg, #ff4f2b, #ff6b4a, #ff4f2b)'
            }}
          />
          
          <div className="flex items-center gap-3 p-4">
            {/* Left icons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] rounded-lg"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Input field */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="w-full bg-transparent border-none resize-none text-[#f5f5f5] placeholder-[#666666] focus:outline-none focus:ring-0 min-h-[24px] max-h-[120px] py-0"
                style={{
                  fieldSizing: 'content',
                  overflow: 'hidden'
                }}
                rows={1}
              />
            </div>

            {/* Send button */}
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="absolute -top-6 right-4 text-[#666666] text-xs">
          <span className="bg-[#0a0a0a] px-2 py-1 rounded">Enter to send, Shift+Enter for newline</span>
        </div>
      </div>
    </div>
  )
}