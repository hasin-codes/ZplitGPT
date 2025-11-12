'use client'

import { useState } from 'react'
import { Menu, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CommandDock } from './CommandDock'
import { AdvanceControls } from './AdvanceControls'
import { ModelBrandSelector } from './ModelBrandSelector'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface TopBarProps {
  context: string
  onContextChange: (context: string) => void
  onSaveContext: () => void
  activeModels: string[]
  onModelToggle: (modelId: string) => void
  onSidebarToggle: () => void
}

export function TopBar({
  context,
  onContextChange,
  onSaveContext,
  activeModels,
  onModelToggle,
  onSidebarToggle
}: TopBarProps) {
  const [advanceControlsOpen, setAdvanceControlsOpen] = useState(false)

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

          {/* Advance Controls Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAdvanceControlsOpen(true)}
            className="h-9 w-9 text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#1a1a1a] flex-shrink-0"
          >
            <SlidersHorizontal className="h-5 w-5" />
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

        {/* Advance Controls Modal */}
        <Dialog open={advanceControlsOpen} onOpenChange={setAdvanceControlsOpen}>
          <DialogContent className="w-[95vw] max-w-[95vw] h-auto max-h-[95vh] bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5] overflow-hidden flex flex-col p-0 md:max-w-lg md:max-h-[85vh]">
            <DialogHeader className="px-4 pt-4 pb-2 flex-shrink-0">
              <DialogTitle className="sr-only">Advanced Controls</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto px-4 pb-4">
              <AdvanceControls autoOpen={true} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop TopBar - Original Layout */}
      <div className="hidden md:flex w-full">
        <div className="w-[28%] border-r border-[#1a1a1a]">
          <CommandDock
            context={context}
            onContextChange={onContextChange}
            onSaveContext={onSaveContext}
          />
        </div>
        <div className="w-[44%] border-r border-[#1a1a1a]">
          <ModelBrandSelector
            activeModels={activeModels}
            onModelToggle={onModelToggle}
          />
        </div>
        <div className="w-[28%]">
          <AdvanceControls />
        </div>
      </div>

      {/* Mobile Model Selector - Under TopBar */}
      <div className="md:hidden w-full border-b border-[#1a1a1a]">
        <ModelBrandSelector
          activeModels={activeModels}
          onModelToggle={onModelToggle}
        />
      </div>
    </>
  )
}


