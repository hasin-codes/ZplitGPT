'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface DiffModalProps {
  isOpen: boolean
  onClose: () => void
  model1Name: string
  model2Name: string
  content1: string
  content2: string
}

export function DiffModal({ isOpen, onClose, model1Name, model2Name, content1, content2 }: DiffModalProps) {
  const renderDiffContent = (text1: string, text2: string) => {
    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    const maxLines = Math.max(lines1.length, lines2.length)
    
    return Array.from({ length: maxLines }, (_, i) => {
      const line1 = lines1[i] || ''
      const line2 = lines2[i] || ''
      
      if (line1 === line2) {
        return (
          <tr key={i}>
            <td className="p-2 text-[#b3b3b3] font-mono text-sm border-r border-[#1a1a1a]">{line1 || '\u00A0'}</td>
            <td className="p-2 text-[#b3b3b3] font-mono text-sm">{line2 || '\u00A0'}</td>
          </tr>
        )
      } else {
        return (
          <tr key={i} className="bg-[#1a1a1a]">
            <td className="p-2 text-[#ff6b4a] font-mono text-sm border-r border-[#ff4f2b]">{line1 || '\u00A0'}</td>
            <td className="p-2 text-[#4a9eff] font-mono text-sm">{line2 || '\u00A0'}</td>
          </tr>
        )
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#f5f5f5]">
            Response Comparison: {model1Name} vs {model2Name}
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
        
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="p-3 text-left text-[#ff6b4a] font-medium">{model1Name}</th>
                <th className="p-3 text-left text-[#4a9eff] font-medium">{model2Name}</th>
              </tr>
            </thead>
            <tbody>
              {renderDiffContent(content1, content2)}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-[#1a1a1a]">
          <div className="text-xs text-[#666666]">
            <span className="inline-block w-3 h-3 bg-[#ff6b4a] mr-2"></span>
            Removed/Modified
            <span className="inline-block w-3 h-3 bg-[#4a9eff] ml-4 mr-2"></span>
            Added/Modified
          </div>
          <Button onClick={onClose} className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}