'use client'

import { useState } from 'react'
import { ChevronDown, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ModelBrand {
  id: string
  name: string
  logo: string
  color: string
  models: {
    standard: Array<{ id: string; name: string; available: boolean }>
    premium: Array<{ id: string; name: string; available: boolean; locked?: boolean }>
  }
}

interface ModelBrandSelectorProps {
  activeModels: string[]
  onModelToggle: (modelId: string) => void
}

const MODEL_BRANDS: ModelBrand[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: 'https://1000logos.net/wp-content/uploads/2024/07/OpenAI-Logo-2022.png',
    color: '#10a37f',
    models: {
      standard: [
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', available: true },
        { id: 'gpt-4', name: 'GPT-4', available: true },
      ],
      premium: [{ id: 'gpt-4-turbo', name: 'GPT-4 Turbo', available: true, locked: true }],
    },
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: 'https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/68309ab48369f7ad9b4a40e1_open-graph.jpg',
    color: '#d97757',
    models: {
      standard: [
        { id: 'claude-3-haiku', name: 'Claude 3 Haiku', available: true },
        { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', available: true },
      ],
      premium: [{ id: 'claude-3-opus', name: 'Claude 3 Opus', available: true, locked: true }],
    },
  },
  {
    id: 'google',
    name: 'Gemini',
    logo: 'https://bcassetcdn.com/public/blog/wp-content/uploads/2022/08/29145131/Google-PNG-1024x640.png',
    color: '#4285f4',
    models: {
      standard: [
        { id: 'gemini-pro', name: 'Gemini Pro', available: true },
        { id: 'gemini-flash', name: 'Gemini Flash', available: true },
      ],
      premium: [{ id: 'gemini-ultra', name: 'Gemini Ultra', available: true, locked: true }],
    },
  },
  {
    id: 'meta',
    name: 'LLAMA',
    logo: 'https://static0.xdaimages.com/wordpress/wp-content/uploads/2021/10/Meta-logo.jpeg?w=1200&h=675&fit=crop',
    color: '#0668e1',
    models: {
      standard: [
        { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', available: true },
        { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', available: true },
      ],
      premium: [{ id: 'llama-3.1-405b', name: 'Llama 3.1 405B', available: true, locked: true }],
    },
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    logo: 'https://www.bigdatawire.com/wp-content/uploads/2024/02/mistral-ai.png',
    color: '#ff7000',
    models: {
      standard: [
        { id: 'mistral-7b', name: 'Mistral 7B', available: true },
        { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', available: true },
      ],
      premium: [{ id: 'mistral-large', name: 'Mistral Large', available: true, locked: true }],
    },
  },
  {
    id: 'qwen',
    name: 'Qwen',
    logo: 'https://images.lifestyleasia.com/wp-content/uploads/sites/2/2025/02/21112012/1_o-q4mpszxwmg4-ofjo2qxw-1600x900.jpeg',
    color: '#ff6a00',
    models: {
      standard: [{ id: 'qwen-72b', name: 'Qwen 72B', available: true }],
      premium: [],
    },
  },
  {
    id: 'xai',
    name: 'xAI',
    logo: 'https://1000logos.net/wp-content/uploads/2023/10/xAI-Logo.jpg',
    color: '#000000',
    models: {
      standard: [{ id: 'grok-2', name: 'Grok 2', available: true }],
      premium: [],
    },
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    logo: 'https://1000logos.net/wp-content/uploads/2024/08/Perplexity-Logo.png',
    color: '#20808d',
    models: {
      standard: [{ id: 'pplx-70b', name: 'Perplexity 70B', available: true }],
      premium: [],
    },
  },
  {
    id: 'zhipu',
    name: 'Zhipu AI',
    logo: 'https://beehiiv-images-production.s3.amazonaws.com/uploads/asset/file/86d7d9aa-e263-48b8-8a51-771d4e2985a5/Frame_236.png?t=1714896117',
    color: '#5b8def',
    models: {
      standard: [{ id: 'glm-4', name: 'GLM-4', available: true }],
      premium: [],
    },
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logo: 'https://images.fastcompany.com/image/upload/f_webp,q_auto,c_fit,w_1024,h_1024/wp-cms-2/2025/01/i-0-91268357-deepseek-logo.jpg',
    color: '#1a56db',
    models: {
      standard: [{ id: 'deepseek-coder', name: 'DeepSeek Coder', available: true }],
      premium: [],
    },
  },
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    logo: 'https://cdn.upmarket.co/staticfiles/2025/11/png/78a3e57adaf9a2ec8b5d48b2a5737816',
    color: '#6e45e2',
    models: {
      standard: [{ id: 'moonshot-v1', name: 'Moonshot v1', available: true }],
      premium: [],
    },
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://fabrikbrands.com/wp-content/uploads/Amazon-Logo-6.png',
    color: '#ff9900',
    models: {
      standard: [{ id: 'titan-text', name: 'Titan Text', available: true }],
      premium: [],
    },
  },
  {
    id: 'nous',
    name: 'Nous Research',
    logo: 'https://pbs.twimg.com/media/G2ByMVwaIAAKMyL.jpg',
    color: '#8b5cf6',
    models: {
      standard: [{ id: 'hermes-2', name: 'Hermes 2', available: true }],
      premium: [],
    },
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    logo: 'https://cdn.sanity.io/images/e4qjo92p/production/9e2d0caa81c6ac5927545b31fb92878d0395f7f6-1442x962.jpg?auto=format&dpr=2&fit=crop&fp-x=0.5&fp-y=0.5&h=240&q=75&w=385',
    color: '#00d4ff',
    models: {
      standard: [{ id: 'cerebras-gpt', name: 'Cerebras GPT', available: true }],
      premium: [],
    },
  },
]

export function ModelBrandSelector({ activeModels, onModelToggle }: ModelBrandSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isBrandActive = (brand: ModelBrand): boolean => {
    const allModels = [...brand.models.standard, ...brand.models.premium]
    return allModels.some((model) => activeModels.includes(model.id))
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
        {brand.models.standard.length > 0 && (
          <>
            <div className="px-2 py-1.5">
              <span className="text-xs font-medium text-[#b3b3b3]">Standard</span>
            </div>
            {brand.models.standard.map((model) => (
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
          </>
        )}

        {brand.models.premium.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-[#1a1a1a]" />
            <div className="px-2 py-1.5">
              <span className="text-xs font-medium text-[#b3b3b3]">Premium</span>
            </div>
            {brand.models.premium.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => !model.locked && onModelToggle(model.id)}
                disabled={!model.available || model.locked}
                className={`flex cursor-pointer items-center justify-between rounded-md hover:bg-[#1a1a1a] ${
                  activeModels.includes(model.id) ? 'bg-[#1a1a1a]' : ''
                } ${model.locked ? 'opacity-50' : ''}`}
              >
                <span className="text-sm">{model.name}</span>
                <div className="flex items-center gap-1">
                  {model.locked && <Lock className="h-3 w-3 text-[#ff4f2b]" />}
                  {activeModels.includes(model.id) && <Check className="h-3 w-3 text-[#4aff4a]" />}
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
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