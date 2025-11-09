'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ModelComparison {
  id: string
  name: string
  color: string
  content: string
}

interface DiffModalProps {
  isOpen: boolean
  onClose: () => void
  models: ModelComparison[]
}

export function DiffModal({ isOpen, onClose, models }: DiffModalProps) {
  if (models.length === 0) return null

  const colors = [
    '#ff6b4a', '#4a9eff', '#10a37f', '#d97757', '#4285f4', 
    '#ff7000', '#ff6a00', '#1a56db', '#5b8def'
  ]

  const renderDiffContent = () => {
    // Get all content arrays
    const allContents = models.map(m => m.content.split('\n'))
    const maxLines = Math.max(...allContents.map(c => c.length))
    
    return Array.from({ length: maxLines }, (_, lineIndex) => {
      const lineContents = allContents.map(content => content[lineIndex] || '')
      
      // Check if all lines are the same
      const allSame = lineContents.every((line, i) => 
        i === 0 || line === lineContents[0]
      )
      
      return (
        <tr key={lineIndex} className={allSame ? '' : 'bg-[#1a1a1a]'}>
          {models.map((model, modelIndex) => {
            const line = lineContents[modelIndex]
            const isDifferent = !allSame
            const color = model.color || colors[modelIndex % colors.length]
            
            return (
              <td
                key={model.id}
                className={`p-2 font-mono text-sm ${
                  modelIndex < models.length - 1 ? 'border-r border-[#1a1a1a]' : ''
                }`}
                style={{
                  color: isDifferent ? color : '#b3b3b3',
                  width: '500px',
                  minWidth: '500px'
                }}
              >
                {line || '\u00A0'}
              </td>
            )
          })}
        </tr>
      )
    })
  }

  // Calculate table width: 3 full columns + partial 4th = 3.2 columns visible
  // Each column is 500px, so visible width = 3.2 * 500 = 1600px
  // Total table width = number of models * 500px
  const tableWidth = `${models.length * 500}px`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-h-[85vh] bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5]"
        style={{
          width: '90vw',
          maxWidth: '90vw'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#f5f5f5]">
            Response Comparison: {models.length} Model{models.length > 1 ? 's' : ''}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-[#b3b3b3] hover:text-[#f5f5f5]"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div 
          className="overflow-x-auto overflow-y-auto max-h-[65vh]"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#333333 #0a0a0a'
          }}
        >
          <table 
            className="border-collapse"
            style={{
              width: tableWidth,
              minWidth: tableWidth
            }}
          >
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                {models.map((model, index) => {
                  const color = model.color || colors[index % colors.length]
                  return (
                    <th
                      key={model.id}
                      className={`p-3 text-left font-medium ${
                        index < models.length - 1 ? 'border-r border-[#1a1a1a]' : ''
                      }`}
                      style={{ 
                        color,
                        width: '500px',
                        minWidth: '500px'
                      }}
                    >
                      {model.name}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {renderDiffContent()}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-[#1a1a1a]">
          <div className="text-xs text-[#666666]">
            <span className="inline-block w-3 h-3 bg-[#1a1a1a] mr-2 border border-[#333333]"></span>
            Same content
            <span className="inline-block w-3 h-3 bg-[#1a1a1a] ml-4 mr-2 border border-[#333333]"></span>
            Different content (highlighted in model color)
          </div>
          <Button onClick={onClose} className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white text-sm">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}