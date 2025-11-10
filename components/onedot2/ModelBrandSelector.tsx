'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MODEL_BRANDS, type ModelBrand } from '@/lib/models'

interface ModelBrandSelectorProps {
  activeModels: string[]
  onModelToggle: (modelId: string) => void
}

export function ModelBrandSelector({ activeModels, onModelToggle }: ModelBrandSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isBrandActive = (brand: ModelBrand): boolean => {
    return brand.models.some((model) => activeModels.includes(model.id))
  }

  const sortedBrands = [...MODEL_BRANDS].sort((a, b) => {
    const aActive = isBrandActive(a)
    const bActive = isBrandActive(b)
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    return 0
  })

  const renderBrandButton = (brand: ModelBrand) => (
    <DropdownMenu key={brand.id}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-[30px] shrink-0 gap-1 rounded-lg border px-3 transition-colors ${
            isBrandActive(brand)
              ? 'border-current'
              : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
          }`}
          style={{
            borderColor: isBrandActive(brand) ? brand.color : undefined,
          }}
        >
          <span className="whitespace-nowrap text-xs text-[#f5f5f5]">{brand.name}</span>
          <ChevronDown className="h-3 w-3 shrink-0 text-[#b3b3b3]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-[200px] rounded-lg border-[#1a1a1a] bg-[#0a0a0a] text-[#f5f5f5]"
      >
        {brand.models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelToggle(model.id)}
            disabled={!model.available}
            className={`flex cursor-pointer items-center justify-between rounded-md hover:bg-[#1a1a1a] ${
              activeModels.includes(model.id) ? 'bg-[#1a1a1a]' : ''
            }`}
          >
            <span className="text-sm">{model.name}</span>
            {activeModels.includes(model.id) && <Check className="h-3 w-3 text-[#4aff4a]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="relative w-full border-b border-[#1a1a1a] bg-[#0a0a0a]">
      {!isExpanded ? (
        <div className="px-4 py-3">
          <div className="flex items-center">
            <div 
              className="flex flex-1 gap-1.5 overflow-hidden pr-2"
              style={{ 
                maskImage: 'linear-gradient(to right, black calc(100% - 48px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 48px), transparent 100%)'
              }}
            >
              {sortedBrands.map((brand) => renderBrandButton(brand))}
            </div>

            <div className="absolute right-4 flex items-center bg-[#0a0a0a] pl-4">
              <Button
                onClick={() => setIsExpanded(true)}
                variant="ghost"
                size="sm"
                className="h-[30px] w-[30px] p-0 text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
                aria-label="Show all brands"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute left-0 right-0 top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a] shadow-xl">
          <div className="px-4 py-3">
            <div className="flex items-start">
              <div className="flex flex-1 flex-wrap gap-1.5 pr-2">
                {sortedBrands.map((brand) => renderBrandButton(brand))}
              </div>

              <div className="absolute right-4 top-3 flex items-center bg-[#0a0a0a] pl-4">
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant="ghost"
                  size="sm"
                  className="h-[30px] w-[30px] p-0 text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
                  aria-label="Show less brands"
                >
                  <ChevronDown className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}