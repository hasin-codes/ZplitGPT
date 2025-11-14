'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Check, MoreHorizontal } from 'lucide-react'
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
      const padding = 32 // px-4 = 16px on each side
      const gap = 4 // gap-1 = 4px (reduced for tighter spacing)
      const moreButtonWidth = 38 // 30px button + 8px for spacing
      
      const availableWidth = containerWidth - padding - moreButtonWidth
      const brandsToShow: ModelBrand[] = []
      
      // Create a temporary container to measure button widths accurately
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.visibility = 'hidden'
      tempContainer.style.top = '-9999px'
      tempContainer.style.left = '-9999px'
      tempContainer.style.display = 'flex'
      tempContainer.style.gap = '4px'
      document.body.appendChild(tempContainer)
      
      let totalWidth = 0
      
      // Try to fit as many brands as possible, prioritizing active ones (already sorted)
      for (const brand of sortedBrands) {
        // Create a temporary button to measure actual width
        const tempButton = document.createElement('button')
        tempButton.style.height = '30px'
        tempButton.style.paddingLeft = '8px'
        tempButton.style.paddingRight = '8px'
        tempButton.style.fontSize = '12px'
        tempButton.style.whiteSpace = 'nowrap'
        tempButton.style.border = '1px solid'
        tempButton.style.borderRadius = '8px'
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
          // Remove the test button before breaking
          tempContainer.removeChild(tempButton)
          break
        }
        
        // Remove the test button after measurement
        tempContainer.removeChild(tempButton)
      }
      
      // Clean up
      document.body.removeChild(tempContainer)
      
      // Ensure ALL active brands are in row 1 if possible
      const activeBrands = sortedBrands.filter(b => isBrandActive(b))
      const activeInRow1 = brandsToShow.filter(b => isBrandActive(b)).length
      
      // If not all active brands fit, try with tighter spacing (px-2 instead of px-3)
      if (activeInRow1 < activeBrands.length && brandsToShow.length > 0) {
        const tempContainer2 = document.createElement('div')
        tempContainer2.style.position = 'absolute'
        tempContainer2.style.visibility = 'hidden'
        tempContainer2.style.top = '-9999px'
        tempContainer2.style.left = '-9999px'
        tempContainer2.style.display = 'flex'
        tempContainer2.style.gap = '4px'
        document.body.appendChild(tempContainer2)
        
        let totalWidth2 = 0
        const activeBrandsToShow: ModelBrand[] = []
        
        for (const brand of activeBrands) {
          const tempButton = document.createElement('button')
          tempButton.style.height = '30px'
          tempButton.style.paddingLeft = '8px'
          tempButton.style.paddingRight = '8px'
          tempButton.style.fontSize = '12px'
          tempButton.style.whiteSpace = 'nowrap'
          tempButton.style.border = '1px solid'
          tempButton.style.borderRadius = '8px'
          tempButton.textContent = brand.name
          tempContainer2.appendChild(tempButton)
          
          void tempContainer2.offsetHeight
          
          const buttonWidth = tempButton.offsetWidth
          const widthWithGap = totalWidth2 + (activeBrandsToShow.length > 0 ? gap : 0) + buttonWidth
          
          if (widthWithGap <= availableWidth) {
            activeBrandsToShow.push(brand)
            totalWidth2 = widthWithGap
            tempContainer2.removeChild(tempButton)
          } else {
            tempContainer2.removeChild(tempButton)
            break
          }
        }
        
        document.body.removeChild(tempContainer2)
        
        // If all active brands fit, use them
        if (activeBrandsToShow.length === activeBrands.length) {
          setRow1Brands(activeBrandsToShow)
          setDropdownBrands(sortedBrands.slice(activeBrandsToShow.length))
          return
        }
      }
      
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
  const renderBrandButton = (brand: ModelBrand) => (
    <DropdownMenu key={brand.id}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-[30px] shrink-0 rounded-lg border px-2 transition-colors ${
            isBrandActive(brand)
              ? 'border-current'
              : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
          }`}
          style={{
            borderColor: isBrandActive(brand) ? brand.color : undefined,
          }}
        >
          <span className="whitespace-nowrap text-xs text-[#f5f5f5]">{brand.name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-[200px] max-w-[90vw] rounded-lg border-[#1a1a1a] bg-[#0a0a0a] text-[#f5f5f5]"
        style={{
          zIndex: 1000,
        }}
      >
        {brand.models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelToggle(model.id)}
            disabled={!model.available}
            className={`flex cursor-pointer items-center justify-between rounded-md hover:bg-[#1a1a1a] px-2 py-1.5 ${
              activeModels.includes(model.id) ? 'bg-[#1a1a1a]' : ''
            }`}
          >
            <span className="text-sm">{model.name}</span>
            {activeModels.includes(model.id) && <Check className="h-3 w-3 text-[#4aff4a] ml-2 flex-shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div 
      ref={containerRef}
      className="relative w-full border-b border-[#1a1a1a] bg-[#0a0a0a] h-[60px] flex items-center"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="px-4 py-3 w-full">
        <div className="flex items-center gap-1 relative">
          {/* Row 1: Visible brand buttons - fixed position, never moves */}
          <div className="flex flex-1 gap-1 overflow-hidden">
            {row1Brands.map((brand) => renderBrandButton(brand))}
          </div>

          {/* Dropdown for brands NOT in row 1 - overlaps content below */}
          {dropdownBrands.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[30px] w-[30px] shrink-0 rounded-lg border border-[#1a1a1a] hover:border-[#2a2a2a] p-0"
                >
                  <MoreHorizontal className="h-4 w-4 text-[#b3b3b3]" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={4}
                className="min-w-[140px] max-w-[min(90vw,180px)] max-h-[400px] overflow-y-auto rounded-lg border-[#1a1a1a] bg-[#0a0a0a] text-[#f5f5f5] [&_[data-slot='dropdown-menu-sub-trigger']>svg.ml-auto]:!hidden"
                style={{
                  zIndex: 1000,
                }}
              >
                {dropdownBrands.map((brand) => (
                  <DropdownMenuSub key={brand.id}>
                    <DropdownMenuSubTrigger
                      className={`flex items-center justify-between gap-0 rounded-md hover:bg-[#1a1a1a] px-2 py-1.5 ${
                        isBrandActive(brand) ? 'bg-[#1a1a1a]' : ''
                      }`}
                      style={{
                        borderLeft: isBrandActive(brand) ? `3px solid ${brand.color}` : '3px solid transparent',
                      }}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className="text-sm truncate">{brand.name}</span>
                        {isBrandActive(brand) && (
                          <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: brand.color }} />
                        )}
                      </div>
                      <svg className="h-3.5 w-3.5 flex-shrink-0 text-[#b3b3b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent
                      alignOffset={-4}
                      className="min-w-[140px] max-w-[min(90vw,180px)] rounded-lg border-[#1a1a1a] bg-[#0a0a0a] text-[#f5f5f5]"
                      style={{
                        zIndex: 1001,
                      }}
                    >
                      {brand.models.map((model) => (
                        <DropdownMenuItem
                          key={model.id}
                          onClick={() => onModelToggle(model.id)}
                          disabled={!model.available}
                          className={`flex cursor-pointer items-center justify-between rounded-md hover:bg-[#1a1a1a] px-2 py-1.5 ${
                            activeModels.includes(model.id) ? 'bg-[#1a1a1a]' : ''
                          }`}
                        >
                          <span className="text-sm flex-1 min-w-0 truncate">{model.name}</span>
                          {activeModels.includes(model.id) && (
                            <Check className="h-3 w-3 text-[#4aff4a] ml-2 flex-shrink-0" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}
