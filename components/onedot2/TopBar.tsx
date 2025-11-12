'use client'

import { CommandDock } from './CommandDock'
import { AdvanceControls } from './AdvanceControls'
import { ModelBrandSelector } from './ModelBrandSelector'

interface TopBarProps {
  context: string
  onContextChange: (context: string) => void
  onSaveContext: () => void
  activeModels: string[]
  onModelToggle: (modelId: string) => void
}

export function TopBar({
  context,
  onContextChange,
  onSaveContext,
  activeModels,
  onModelToggle
}: TopBarProps) {
  return (
    <div className="flex w-full">
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
  )
}


