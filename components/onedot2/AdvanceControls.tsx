'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'

interface AdvanceControlsProps {
  modelId?: string
}

export function AdvanceControls({ modelId }: AdvanceControlsProps) {
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([2048])
  const [topP, setTopP] = useState([0.9])
  const [topK, setTopK] = useState([40])
  const [frequencyPenalty, setFrequencyPenalty] = useState([0])
  const [presencePenalty, setPresencePenalty] = useState([0])
  const [stopSequences, setStopSequences] = useState('')
  const [showPresetInput, setShowPresetInput] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [presets, setPresets] = useState([
    { name: 'Creative', temp: 0.9, topP: 0.95, freqPen: 0.2, presPen: 0.2 },
    { name: 'Balanced', temp: 0.7, topP: 0.9, freqPen: 0, presPen: 0 },
    { name: 'Precise', temp: 0.3, topP: 0.7, freqPen: 0.1, presPen: 0.1 }
  ])

  const applyPreset = (preset: typeof presets[0]) => {
    setTemperature([preset.temp])
    setTopP([preset.topP])
    setFrequencyPenalty([preset.freqPen])
    setPresencePenalty([preset.presPen])
  }

  const handleCreatePreset = () => {
    if (presetName.trim()) {
      const newPreset = {
        name: presetName,
        temp: temperature[0],
        topP: topP[0],
        freqPen: frequencyPenalty[0],
        presPen: presencePenalty[0]
      }
      setPresets([newPreset, ...presets])
      setPresetName('')
      setShowPresetInput(false)
    }
  }

  return (
    <div className="w-full space-y-6 overflow-y-auto pr-2">
      {/* Model Parameters */}
      <div className="space-y-1">
        <h3 className="text-[#f5f5f5] font-medium text-sm mb-3">Model Parameters</h3>
        <div className="space-y-4">
          {/* Row 1: Temperature and Max Tokens */}
          <div className="grid grid-cols-2 gap-4">
            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#b3b3b3] text-xs font-medium">Temperature</Label>
                <span className="text-[#f5f5f5] text-xs">{temperature[0]}</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#b3b3b3] text-xs font-medium">Max Tokens</Label>
                <Input
                  type="number"
                  value={maxTokens[0]}
                  onChange={(e) => setMaxTokens([parseInt(e.target.value) || 0])}
                  className="w-20 h-6 text-xs bg-[#1a1a1a] border-[#333333] text-[#f5f5f5] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
              </div>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                min={1}
                max={4096}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Row 2: Top-p and Top K */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top-p */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#b3b3b3] text-xs font-medium">Top-p</Label>
                <span className="text-[#f5f5f5] text-xs">{topP[0]}</span>
              </div>
              <Slider
                value={topP}
                onValueChange={setTopP}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Top K */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#b3b3b3] text-xs font-medium">Top K</Label>
                <span className="text-[#f5f5f5] text-xs">{topK[0]}</span>
              </div>
              <Slider
                value={topK}
                onValueChange={setTopK}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Row 3: Frequency Penalty and Presence Penalty */}
          <div className="grid grid-cols-2 gap-4">
            {/* Frequency Penalty */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#b3b3b3] text-xs font-medium">Frequency Penalty</Label>
                <span className="text-[#f5f5f5] text-xs">{frequencyPenalty[0]}</span>
              </div>
              <Slider
                value={frequencyPenalty}
                onValueChange={setFrequencyPenalty}
                max={2}
                min={-2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Presence Penalty */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#b3b3b3] text-xs font-medium">Presence Penalty</Label>
                <span className="text-[#f5f5f5] text-xs">{presencePenalty[0]}</span>
              </div>
              <Slider
                value={presencePenalty}
                onValueChange={setPresencePenalty}
                max={2}
                min={-2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Stop Sequences */}
          <div className="space-y-2">
            <Label className="text-[#b3b3b3] text-xs font-medium">Stop Sequences</Label>
            <Input
              placeholder="Enter stop words..."
              value={stopSequences}
              onChange={(e) => setStopSequences(e.target.value)}
              className="text-xs bg-[#1a1a1a] border-[#333333] text-[#f5f5f5] placeholder-[#666666]"
            />
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <h3 className="text-[#f5f5f5] font-medium text-sm">Quick Presets</h3>
        
        {/* 4-column grid preset list */}
        <div className="grid grid-cols-4 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              variant="ghost"
              className="w-full justify-center text-xs h-8 bg-[#1a1a1a] text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#2a2a2a]"
            >
              {preset.name}
            </Button>
          ))}
        </div>
        
        {/* Save as Preset Section */}
        {showPresetInput ? (
          <div className="space-y-1.5">
            <Input
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreatePreset()
                if (e.key === 'Escape') setShowPresetInput(false)
              }}
              className="text-xs h-8 bg-[#1a1a1a] border-[#333333] text-[#f5f5f5] placeholder-[#666666]"
              autoFocus
            />
            <div className="flex gap-1.5">
              <Button
                onClick={handleCreatePreset}
                className="flex-1 text-xs h-7 bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white"
              >
                Create Preset
              </Button>
              <Button
                onClick={() => {
                  setShowPresetInput(false)
                  setPresetName('')
                }}
                variant="outline"
                className="flex-1 text-xs h-7 border-[#333333] text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowPresetInput(true)}
            variant="outline"
            className="w-full justify-start text-xs h-8 border-[#333333] border-dashed text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#1a1a1a] hover:border-[#ff4f2b]"
          >
            + Save as Preset
          </Button>
        )}
      </div>
    </div>
  )
}
