'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Key, Eye, EyeOff, Save, Trash2, Plus, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { MODEL_BRANDS } from '@/lib/models'

interface APIKeys {
  [brandId: string]: string
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKeys, setApiKeys] = useState<APIKeys>({})
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [tempKeys, setTempKeys] = useState<APIKeys>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Load API keys from localStorage on mount
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.localStorage) {
      const savedKeys = window.localStorage.getItem('zplitgpt-api-keys')
      if (savedKeys) {
        try {
          const parsed = JSON.parse(savedKeys)
          setApiKeys(parsed)
          setTempKeys(parsed)
        } catch (error) {
          console.error('Failed to parse API keys:', error)
        }
      }
    }
  }, [isOpen])

  // Handle click outside modal
  useEffect(() => {
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
  }, [isOpen])

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
      // Save API keys
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('zplitgpt-api-keys', JSON.stringify(tempKeys))
        setApiKeys(tempKeys)
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

  const hasUnsavedChanges = typeof window !== 'undefined' && window.localStorage ? (
    Object.keys(tempKeys).some(key => tempKeys[key] !== apiKeys[key])
  ) : false

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out ${
        isAnimating
          ? 'bg-black/80 backdrop-blur-sm opacity-100'
          : 'bg-black/0 backdrop-blur-none opacity-0'
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${
          isAnimating
            ? 'scale-100 opacity-100 translate-y-0 rotate-0'
            : 'scale-75 opacity-0 translate-y-12 rotate-2'
        }`}
        style={{
          boxShadow: `
            2px 2px 4px rgba(0, 0, 0, 0.3),
            -2px -2px 4px rgba(20, 20, 20, 0.3),
            inset 2px 2px 4px rgba(5, 5, 5, 0.3),
            inset -2px -2px 4px rgba(15, 15, 15, 0.2)
          `
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
          <h2 className="text-xl font-semibold text-[#f5f5f5]">Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-[#ff4f2b]" />
              <h3 className="text-lg font-medium text-[#f5f5f5]">API Configuration</h3>
            </div>
            
            <div className="text-sm text-[#b3b3b3] mb-6">
              Configure your API keys for different AI providers. Your keys are stored locally and never sent to our servers.
            </div>

            {/* 3-column grid layout for API keys */}
            <div className="grid grid-cols-3 gap-4">
              {MODEL_BRANDS.map((brand) => (
                <div
                  key={brand.id}
                  className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: brand.color }}
                      />
                      <Label className="text-sm font-medium text-[#f5f5f5]">
                        {brand.name}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      {tempKeys[brand.id] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(brand.id)}
                          className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] p-1"
                        >
                          {showKeys[brand.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      {tempKeys[brand.id] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearKey(brand.id)}
                          className="text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#1a1a1a] p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Input
                    type={showKeys[brand.id] ? 'text' : 'password'}
                    value={tempKeys[brand.id] || ''}
                    onChange={(e) => handleKeyChange(brand.id, e.target.value)}
                    placeholder={`Enter ${brand.name} API key...`}
                    className="bg-[#0a0a0a] border-[#2a2a2a] text-[#f5f5f5] placeholder-[#666666] focus:border-[#ff4f2b]"
                  />
                </div>
              ))}
            </div>

            <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-4">
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

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#1a1a1a] bg-[#0a0a0a]">
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
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}