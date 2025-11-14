'use client'

import { Brain } from 'lucide-react'

interface ChatMemoryProps {
  onOpenModal: () => void
}

export function ChatMemory({ onOpenModal }: ChatMemoryProps) {
  return (
    <div className="w-full bg-[#0a0a0a] border-b border-[#1a1a1a] h-[60px] flex items-center">
      <button
        onClick={onOpenModal}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#0a0a0a]/50 transition-colors cursor-pointer"
      >
        <Brain className="w-4 h-4 text-[#ff4f2b]" />
        <span className="text-[#b3b3b3] text-sm font-medium">Chat Memory</span>
      </button>
    </div>
  )
}

