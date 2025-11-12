'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Key, Eye, EyeOff, Save, Trash2, Check, AlertCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { MODEL_BRANDS } from '@/lib/models'
import { useIsMobile } from '@/hooks/use-mobile'

interface APIKeys {
  [brandId: string]: string
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const isMobile = useIsMobile()
  const [apiKeys, setApiKeys] = useState<APIKeys>({})
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [tempKeys, setTempKeys] = useState<APIKeys>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [expandedBrands, setExpandedBrands] = useState<{ [key: string]: boolean }>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Load API keys from localStorage on mount
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedKeys = window.localStorage.getItem('zplitgpt-api-keys')
        const loadedKeys: APIKeys = savedKeys ? JSON.parse(savedKeys) : {}
        
        // Merge loaded keys with all brands (to handle new brands added)
        const mergedKeys: APIKeys = {}
        MODEL_BRANDS.forEach(brand => {
          mergedKeys[brand.id] = loadedKeys[brand.id] || ''
        })
        
        setApiKeys(mergedKeys)
        setTempKeys(mergedKeys)
      } catch (error) {
        console.error('Failed to parse API keys:', error)
        // Initialize with empty keys on error
        const initialKeys: APIKeys = {}
        MODEL_BRANDS.forEach(brand => {
          initialKeys[brand.id] = ''
        })
        setApiKeys(initialKeys)
        setTempKeys(initialKeys)
      }
    }
  }, [isOpen])

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, isOpen])

  // Handle click outside modal (desktop only)
  useEffect(() => {
    if (isMobile) return // Don't close on outside click on mobile
    
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isMobile])

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      // Small delay to ensure the DOM is updated before starting animation
      setTimeout(() => {
        setIsAnimating(true)
      }, 10)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setShouldRender(false)
      onClose()
    }, 300) // Match the animation duration
  }

  const toggleKeyVisibility = (brandId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }))
  }

  const handleKeyChange = (brandId: string, value: string) => {
    setTempKeys(prev => ({
      ...prev,
      [brandId]: value
    }))
  }

  const saveSettings = async () => {
    setSaveStatus('saving')
    
    try {
      // Save API keys to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        // Filter out empty keys for cleaner storage
        const keysToSave: APIKeys = {}
        Object.keys(tempKeys).forEach(key => {
          const value = tempKeys[key]?.trim()
          if (value) {
            keysToSave[key] = value
          }
        })
        
        window.localStorage.setItem('zplitgpt-api-keys', JSON.stringify(keysToSave))
        // Update apiKeys state to match saved keys
        setApiKeys(keysToSave)
      }

      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const clearKey = (brandId: string) => {
    setTempKeys(prev => ({
      ...prev,
      [brandId]: ''
    }))
  }

  const toggleBrandExpanded = (brandId: string) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }))
  }

  // Check for unsaved changes by comparing normalized keys
  const normalizeKeys = (keys: APIKeys): APIKeys => {
    const normalized: APIKeys = {}
    Object.keys(keys).forEach(key => {
      const value = keys[key]?.trim() || ''
      if (value) {
        normalized[key] = value
      }
    })
    return normalized
  }

  const normalizedTempKeys = normalizeKeys(tempKeys)
  const normalizedApiKeys = normalizeKeys(apiKeys)
  
  const hasUnsavedChanges = 
    JSON.stringify(normalizedTempKeys) !== JSON.stringify(normalizedApiKeys)

  if (!shouldRender) return null

  // Render API key input for a brand
  const renderApiKeyInput = (brand: typeof MODEL_BRANDS[0]) => {
    // On mobile, check if expanded (default to false if not set)
    // On desktop, always expanded
    const isExpanded = isMobile 
      ? (expandedBrands[brand.id] !== undefined ? expandedBrands[brand.id] : false)
      : true
    const hasKey = !!(tempKeys[brand.id]?.trim())
    
    return (
      <div
        key={brand.id}
        className={cn(
          "border border-[#1a1a1a] rounded-lg overflow-hidden transition-all duration-200",
          "bg-[#111111] hover:bg-[#151515]",
          hasKey && "border-opacity-50"
        )}
      >
        {/* Mobile: Collapsible header */}
        {isMobile && (
          <button
            onClick={() => toggleBrandExpanded(brand.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: brand.color }}
              />
              <span className="text-sm font-medium text-[#f5f5f5] truncate">
                {brand.name}
              </span>
              {hasKey && (
                <div className="w-2 h-2 rounded-full bg-[#10a37f] flex-shrink-0" />
              )}
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-[#b3b3b3] flex-shrink-0 transition-transform",
                isExpanded && "transform rotate-180"
              )}
            />
          </button>
        )}
        
        {/* Content */}
        <div
          className={cn(
            "transition-all duration-200",
            isMobile && !isExpanded ? "max-h-0 opacity-0 overflow-hidden" : "opacity-100"
          )}
        >
          <div className={cn("p-4", isMobile && "pt-0")}>
            {/* Desktop: Show brand name */}
            {!isMobile && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: brand.color }}
                  />
                  <Label className="text-sm font-medium text-[#f5f5f5]">
                    {brand.name}
                  </Label>
                  {hasKey && (
                    <div className="w-2 h-2 rounded-full bg-[#10a37f] flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasKey && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(brand.id)}
                        className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] p-1.5 h-7 w-7"
                      >
                        {showKeys[brand.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearKey(brand.id)}
                        className="text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#1a1a1a] p-1.5 h-7 w-7"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Input field */}
            <div className="relative">
              <Input
                type={showKeys[brand.id] ? 'text' : 'password'}
                value={tempKeys[brand.id] || ''}
                onChange={(e) => handleKeyChange(brand.id, e.target.value)}
                placeholder={`Enter ${brand.name} API key...`}
                className={cn(
                  "bg-[#0a0a0a] border-[#2a2a2a] text-[#f5f5f5] placeholder-[#666666]",
                  "focus:border-[#ff4f2b] focus:ring-1 focus:ring-[#ff4f2b]",
                  "transition-colors",
                  isMobile && "h-12 text-base"
                )}
              />
              
              {/* Mobile: Action buttons */}
              {isMobile && hasKey && (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKeyVisibility(brand.id)}
                    className="flex-1 text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] h-9"
                  >
                    {showKeys[brand.id] ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Show
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearKey(brand.id)}
                    className="flex-1 text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#1a1a1a] h-9"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile: Full-screen modal
  if (isMobile) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col",
          "transition-transform duration-300 ease-out",
          isAnimating ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => {
          // Prevent closing when clicking inside modal
          e.stopPropagation()
        }}
      >
        {/* Mobile Header - Sticky */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a] bg-[#0a0a0a] flex-shrink-0">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-[#ff4f2b] flex-shrink-0" />
            <h2 className="text-lg font-semibold text-[#f5f5f5]">API Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] h-9 w-9"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Content - Scrollable */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Description */}
            <div className="text-sm text-[#b3b3b3] mb-2">
              Configure your API keys for different AI providers. Your keys are stored locally and never sent to our servers.
            </div>

            {/* API Key Inputs - Single column on mobile */}
            <div className="space-y-3">
              {MODEL_BRANDS.map((brand) => renderApiKeyInput(brand))}
            </div>

            {/* Security Notice */}
            <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#ff4f2b] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#b3b3b3]">
                  <p className="font-medium text-[#f5f5f5] mb-1">Security Notice</p>
                  <p>API keys are stored locally in your browser. Never share your API keys with others. If you suspect your keys have been compromised, regenerate them from provider's dashboard.</p>
                </div>
              </div>
            </div>

            {/* Spacer for sticky footer */}
            <div className="h-24" />
          </div>
        </div>

        {/* Mobile Footer - Sticky */}
        <div className="border-t border-[#1a1a1a] bg-[#0a0a0a] p-4 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          <div className="max-w-2xl mx-auto space-y-3">
            {/* Status messages */}
            <div className="flex items-center justify-center min-h-[20px]">
              {hasUnsavedChanges && (
                <span className="text-xs text-[#ff4f2b]">You have unsaved changes</span>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-1 text-xs text-[#10a37f]">
                  <Check className="w-3 h-3" />
                  <span>Saved successfully</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-1 text-xs text-[#ff4f2b]">
                  <AlertCircle className="w-3 h-3" />
                  <span>Failed to save</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="flex-1 text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={saveSettings}
                disabled={!hasUnsavedChanges || saveStatus === 'saving'}
                className="flex-1 bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white disabled:opacity-50 disabled:cursor-not-allowed h-12 font-medium"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop: Centered modal
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "transition-all duration-300 ease-out",
        isAnimating
          ? "bg-black/80 backdrop-blur-sm opacity-100"
          : "bg-black/0 backdrop-blur-none opacity-0 pointer-events-none"
      )}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg w-full max-w-6xl max-h-[90vh]",
          "overflow-hidden flex flex-col shadow-2xl",
          "transition-all duration-300 ease-out",
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a] flex-shrink-0">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-[#ff4f2b]" />
            <h2 className="text-xl font-semibold text-[#f5f5f5]">API Configuration</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="text-sm text-[#b3b3b3] mb-4">
              Configure your API keys for different AI providers. Your keys are stored locally and never sent to our servers.
            </div>

            {/* Desktop: 3-column grid layout for API keys */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MODEL_BRANDS.map((brand) => renderApiKeyInput(brand))}
            </div>

            {/* Security Notice */}
            <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#ff4f2b] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#b3b3b3]">
                  <p className="font-medium text-[#f5f5f5] mb-1">Security Notice</p>
                  <p>API keys are stored locally in your browser. Never share your API keys with others. If you suspect your keys have been compromised, regenerate them from provider's dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#1a1a1a] bg-[#0a0a0a] flex-shrink-0">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="text-xs text-[#ff4f2b]">You have unsaved changes</span>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-1 text-xs text-[#10a37f]">
                <Check className="w-3 h-3" />
                <span>Saved successfully</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-1 text-xs text-[#ff4f2b]">
                <AlertCircle className="w-3 h-3" />
                <span>Failed to save</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]"
            >
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              disabled={!hasUnsavedChanges || saveStatus === 'saving'}
              className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}