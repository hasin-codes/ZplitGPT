'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Check, MoreHorizontal, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { MODEL_BRANDS, type ModelBrand } from '@/lib/models'

interface ModelBrandSelectorProps {
  activeModels: string[]
  onModelToggle: (modelId: string) => void
}

export function ModelBrandSelector({ activeModels, onModelToggle }: ModelBrandSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [row1Brands, setRow1Brands] = useState<ModelBrand[]>([])
  const [dropdownBrands, setDropdownBrands] = useState<ModelBrand[]>([])

  // Determine which brands are active (have at least one active model)
  const isBrandActive = (brand: ModelBrand): boolean => {
    return brand.models.some((model) => activeModels.includes(model.id))
  }

  // Sort brands: ALL active brands first, then inactive brands
  const sortedBrands = useMemo(() => {
    const activeBrands = MODEL_BRANDS.filter(brand => isBrandActive(brand))
    const inactiveBrands = MODEL_BRANDS.filter(brand => !isBrandActive(brand))
    return [...activeBrands, ...inactiveBrands]
  }, [activeModels])

  // Calculate which brands fit in row 1 by actually measuring
  useEffect(() => {
    const calculateVisibleBrands = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerWidth = container.offsetWidth
      const padding = 0 // No padding on container
      const gap = 6 // gap-1.5 = 6px
      const moreButtonWidth = 36 // Width of the "More" button

      const availableWidth = containerWidth - padding - moreButtonWidth
      const brandsToShow: ModelBrand[] = []

      // Create a temporary container to measure button widths accurately
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.visibility = 'hidden'
      tempContainer.style.top = '-9999px'
      tempContainer.style.left = '-9999px'
      tempContainer.style.display = 'flex'
      tempContainer.style.gap = '6px'
      document.body.appendChild(tempContainer)

      let totalWidth = 0

      // Try to fit as many brands as possible
      for (const brand of sortedBrands) {
        const tempButton = document.createElement('button')
        // Match the styling of the actual button for accurate measurement
        tempButton.style.paddingLeft = '10px'
        tempButton.style.paddingRight = '10px'
        tempButton.style.fontSize = '12px'
        tempButton.style.fontWeight = '500'
        tempButton.textContent = brand.name
        tempContainer.appendChild(tempButton)

        // Force layout calculation
        void tempContainer.offsetHeight

        const buttonWidth = tempButton.offsetWidth
        const widthWithGap = totalWidth + (brandsToShow.length > 0 ? gap : 0) + buttonWidth

        if (widthWithGap <= availableWidth) {
          brandsToShow.push(brand)
          totalWidth = widthWithGap
        } else {
          tempContainer.removeChild(tempButton)
          break
        }
        tempContainer.removeChild(tempButton)
      }

      document.body.removeChild(tempContainer)

      setRow1Brands(brandsToShow)
      setDropdownBrands(sortedBrands.slice(brandsToShow.length))
    }

    // Use setTimeout to ensure DOM is ready after render
    const timeoutId = setTimeout(() => {
      calculateVisibleBrands()
    }, 0)

    window.addEventListener('resize', calculateVisibleBrands)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', calculateVisibleBrands)
    }
  }, [sortedBrands, activeModels])

  // Render a brand button with model dropdown
  const renderBrandButton = (brand: ModelBrand) => {
    const isActive = isBrandActive(brand)

    return (
      <DropdownMenu key={brand.id}>
        <DropdownMenuTrigger asChild>
          <button
            className={`
              h-[32px] px-2.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-2
              ${isActive
                ? 'bg-[#1a1a1a] text-[#f5f5f5] border border-[#333333]'
                : 'text-[#888888] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] border border-transparent hover:border-[#262626]'
              }
            `}
          >
            <span className="whitespace-nowrap">{brand.name}</span>
            {isActive && (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: brand.color }}
              />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="min-w-[220px] p-1 rounded-xl border-[#262626] bg-[#0a0a0a] text-[#f5f5f5] shadow-2xl"
          style={{ zIndex: 1000 }}
        >
          <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-[#666666] font-semibold">
            {brand.name} Models
          </div>
          {brand.models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onModelToggle(model.id)}
              disabled={!model.available}
              className={`
                flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors
                ${activeModels.includes(model.id) ? 'bg-[#1a1a1a] text-white' : 'text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-white'}
              `}
            >
              <span>{model.name}</span>
              {activeModels.includes(model.id) && <Check className="h-3.5 w-3.5 text-[#f5f5f5]" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[60px] bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center"
    >
      <div className="w-full flex items-center justify-between">
        {/* Row 1: Visible brand buttons */}
        <div className={`flex items-center gap-1.5 overflow-hidden flex-1 ${dropdownBrands.length === 0 ? 'justify-center' : ''}`}>
          {row1Brands.map((brand) => renderBrandButton(brand))}
        </div>

        {/* Dropdown for brands NOT in row 1 */}
        {dropdownBrands.length > 0 && (
          <div className="pl-2 border-l border-[#1a1a1a] ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-[32px] w-[32px] flex items-center justify-center rounded-md text-[#888888] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="min-w-[180px] p-1 rounded-xl border-[#262626] bg-[#0a0a0a] text-[#f5f5f5] shadow-2xl"
              >
                <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-[#666666] font-semibold">
                  More Brands
                </div>
                {dropdownBrands.map((brand) => (
                  <DropdownMenuSub key={brand.id}>
                    <DropdownMenuSubTrigger
                      className={`
                        flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors
                        ${isBrandActive(brand) ? 'text-white' : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {isBrandActive(brand) && (
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.color }} />
                        )}
                        <span>{brand.name}</span>
                      </div>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent
                      className="min-w-[180px] p-1 rounded-xl border-[#262626] bg-[#0a0a0a] text-[#f5f5f5] shadow-xl ml-1"
                    >
                      {brand.models.map((model) => (
                        <DropdownMenuItem
                          key={model.id}
                          onClick={() => onModelToggle(model.id)}
                          disabled={!model.available}
                          className={`
                            flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors
                            ${activeModels.includes(model.id) ? 'bg-[#1a1a1a] text-white' : 'text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-white'}
                          `}
                        >
                          <span>{model.name}</span>
                          {activeModels.includes(model.id) && (
                            <Check className="h-3.5 w-3.5 text-[#f5f5f5]" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  )
}
