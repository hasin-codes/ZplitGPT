'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Database, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CommandDock } from './CommandDock'
import { addMessageToChat, getChatById } from '@/lib/chat-storage'

interface AIInputProps {
  leftCollapsed: boolean
  selectedChat: string
  onChatNameUpdate: (chatId: string, name: string) => void
  context: string
  onContextChange: (context: string) => void
  onSaveContext: () => void
  onMessageSent?: () => void
}

export function AIInput({ 
  leftCollapsed, 
  selectedChat, 
  onChatNameUpdate,
  context,
  onContextChange,
  onSaveContext,
  onMessageSent
}: AIInputProps) {
  const [contextModalOpen, setContextModalOpen] = useState(false)
  const [commandDockModalOpen, setCommandDockModalOpen] = useState(false)
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
    
    const promptText = input.trim()
    
    // Create message object
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    // Check if this is the first message (chat might not be saved yet)
    const existingChat = getChatById(selectedChat)
    const isFirstMessage = !existingChat || existingChat.messages.length === 0
    
    // Create message object (empty model responses for now - will be populated when AI responds)
    const message = {
      id: messageId,
      prompt: promptText,
      timestamp: now,
      modelResponses: {}
    }
    
    // Save message to chat (this will create and save the chat if it doesn't exist)
    addMessageToChat(selectedChat, message)
    
    // Update chat name based on first prompt
    if (isFirstMessage && promptText) {
      const chatName = generateChatName(promptText)
      onChatNameUpdate(selectedChat, chatName)
      setHasSentFirstMessage(true)
    }
    
    // Simulate sending prompt
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Sending prompt:', promptText)
    setInput('')
    setIsSending(false)
    
    // Notify parent that message was sent (to refresh chat data)
    onMessageSent?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <div className="w-full p-4">
        <div className="w-full">
          <div className="relative flex items-center gap-2 bg-[#111111] border border-[#333333] rounded-lg px-2 py-3 focus-within:border-[#ff4f2b] transition-colors">
            {/* Mobile: Context Window Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setContextModalOpen(true)}
              className="md:hidden h-8 w-8 text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#1a1a1a] flex-shrink-0"
            >
              <Database className="h-4 w-4" />
            </Button>

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

            {/* Mobile: Command Dock Icon - Moved closer to right */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCommandDockModalOpen(true)}
              className="md:hidden h-8 w-8 text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#1a1a1a] flex-shrink-0"
            >
              <Mic className="h-4 w-4" />
            </Button>

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

      {/* Context Modal - Mobile Only */}
      <Dialog open={contextModalOpen} onOpenChange={setContextModalOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-auto max-h-[95vh] bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5] overflow-hidden flex flex-col p-0 md:max-w-lg md:max-h-[85vh]">
          <DialogHeader className="px-4 pt-4 pb-2 flex-shrink-0">
            <DialogTitle className="sr-only">System Context</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-4 pb-4">
            <CommandDock
              context={context}
              onContextChange={onContextChange}
              onSaveContext={onSaveContext}
              autoOpen={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Command Dock Modal - Mobile Only */}
      <Dialog open={commandDockModalOpen} onOpenChange={setCommandDockModalOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-auto max-h-[95vh] bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5] overflow-hidden flex flex-col p-0 md:max-w-lg md:max-h-[85vh]">
          <DialogHeader className="px-4 pt-4 pb-2 flex-shrink-0">
            <DialogTitle className="sr-only">Command Dock</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-4 pb-4">
            <CommandDock
              context={context}
              onContextChange={onContextChange}
              onSaveContext={onSaveContext}
              autoOpen={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

