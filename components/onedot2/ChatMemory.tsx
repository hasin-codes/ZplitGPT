'use client'

import { Brain } from 'lucide-react'

interface ChatMemoryProps {
  onOpenModal: () => void
}

export function ChatMemory({ onOpenModal }: ChatMemoryProps) {
  return (
    <div className="w-full h-[60px] bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center justify-center group cursor-pointer hover:bg-[#111111] transition-colors duration-200" onClick={onOpenModal}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-[#1a1a1a] group-hover:bg-[#222222] transition-colors border border-[#262626] group-hover:border-[#333333]">
          <Brain className="w-4 h-4 text-[#888888] group-hover:text-[#f5f5f5] transition-colors" />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-[#e5e5e5] leading-none mb-1">Chat Memory</span>
          <span className="text-[11px] text-[#666666] leading-none group-hover:text-[#888888] transition-colors">Session Data</span>
        </div>
      </div>
    </div>
  )
}

