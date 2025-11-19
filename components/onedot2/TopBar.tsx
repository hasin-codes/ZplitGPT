'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CommandDock } from './CommandDock'
import { ChatMemory } from './ChatMemory'
import { ModelBrandSelector } from './ModelBrandSelector'
import { ContextMemoryModal } from './ContextMemoryModal'

interface TopBarProps {
  context: string
  onContextChange: (context: string) => void
  onSaveContext: () => void
  memory: string
  onMemoryChange: (memory: string) => void
  onSaveMemory: () => void
  activeModels: string[]
  onModelToggle: (modelId: string) => void
  onSidebarToggle: () => void
  chatId?: string
  isHome?: boolean
}

export function TopBar({
  context,
  onContextChange,
  onSaveContext,
  memory,
  onMemoryChange,
  onSaveMemory,
  activeModels,
  onModelToggle,
  onSidebarToggle,
  chatId,
  isHome
}: TopBarProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'context' | 'memory'>('context')

  return (
    <>
      {/* Mobile TopBar */}
      <div className="md:hidden flex items-center justify-between w-full h-14 px-4 bg-[#0a0a0a] border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="h-9 w-9 text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* App Logo */}
        <div className="flex items-center flex-shrink-0">
          <Image
            src="/ZplitGPT.svg"
            alt="ZplitGPT Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
      </div>

      {/* Desktop TopBar - Original Layout */}
      <div className="hidden md:flex w-full">
        {!isHome && (
          <div className="w-[13%] border-r border-[#1a1a1a]">
            <CommandDock onOpenModal={() => {
              setActiveTab('context')
              setModalOpen(true)
            }} />
          </div>
        )}

        <div className={`${isHome ? 'w-full flex justify-center' : 'w-[74%]'} border-r border-[#1a1a1a]`}>
          <div className={isHome ? 'w-full px-4' : 'w-full'}>
            <ModelBrandSelector
              activeModels={activeModels}
              onModelToggle={onModelToggle}
            />
          </div>
        </div>

        {!isHome && (
          <div className="w-[13%]">
            <ChatMemory onOpenModal={() => {
              setActiveTab('memory')
              setModalOpen(true)
            }} />
          </div>
        )}
      </div>

      {/* Mobile Model Selector - Under TopBar */}
      <div className="md:hidden w-full border-b border-[#1a1a1a]">
        <ModelBrandSelector
          activeModels={activeModels}
          onModelToggle={onModelToggle}
        />
      </div>

      {/* Context & Memory Modal */}
      <ContextMemoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        context={context}
        onContextChange={onContextChange}
        onSaveContext={onSaveContext}
        memory={memory}
        onMemoryChange={onMemoryChange}
        onSaveMemory={onSaveMemory}
        chatId={chatId}
        defaultTab={activeTab}
      />
    </>
  )
}


