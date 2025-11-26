// Model and Brand data structure
// Free-tier Bytez models only

export interface Model {
  id: string
  name: string
  available: boolean
  brandId: string
}

export interface ModelBrand {
  id: string
  name: string
  logo: string
  color: string
  models: Model[]
}

// Model brands with FREE Bytez models
export const MODEL_BRANDS: ModelBrand[] = [
  {
    id: 'qwen',
    name: 'Qwen',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/alibabacloud.svg',
    color: '#ff6a00',
    models: [
      { id: 'Qwen/Qwen2.5-3B-Instruct', name: 'Qwen 2.5 3B', available: true, brandId: 'qwen' },
      { id: 'Qwen/Qwen2.5-1.5B-Instruct', name: 'Qwen 2.5 1.5B', available: true, brandId: 'qwen' },
      { id: 'Qwen/Qwen2-1.5B-Instruct', name: 'Qwen 2 1.5B', available: true, brandId: 'qwen' },
      { id: 'Qwen/Qwen3-4B', name: 'Qwen 3 4B', available: true, brandId: 'qwen' },
      { id: 'Qwen/Qwen3-1.7B', name: 'Qwen 3 1.7B', available: true, brandId: 'qwen' },
      { id: 'Qwen/Qwen3-0.6B', name: 'Qwen 3 0.6B', available: true, brandId: 'qwen' }
    ]
  },
  {
    id: 'google',
    name: 'Google',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/google.svg',
    color: '#4285f4',
    models: [
      { id: 'google/gemma-3-4b-it', name: 'Gemma 3 4B IT', available: true, brandId: 'google' },
      { id: 'google/gemma-3-1b-it', name: 'Gemma 3 1B IT', available: true, brandId: 'google' }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/microsoft.svg',
    color: '#00a4ef',
    models: [
      { id: 'microsoft/Phi-3-mini-4k-instruct', name: 'Phi 3 Mini 4K', available: true, brandId: 'microsoft' },
      { id: 'microsoft/Phi-3-mini-128k-instruct', name: 'Phi 3 Mini 128K', available: true, brandId: 'microsoft' }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/deepseek.svg',
    color: '#1a56db',
    models: [
      { id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B', name: 'DeepSeek R1 Distill 1.5B', available: true, brandId: 'deepseek' }
    ]
  },
  {
    id: 'ibm',
    name: 'IBM',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/ibm.svg',
    color: '#0f62fe',
    models: [
      { id: 'ibm-granite/granite-4-0-h-tiny', name: 'Granite 4.0 Tiny', available: true, brandId: 'ibm' },
      { id: 'ibm-granite/granite-docling-258M', name: 'Granite Docling 258M', available: true, brandId: 'ibm' }
    ]
  },
  {
    id: 'tinyllama',
    name: 'TinyLlama',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/meta.svg',
    color: '#10b981',
    models: [
      { id: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0', name: 'TinyLlama 1.1B Chat', available: true, brandId: 'tinyllama' }
    ]
  },
  {
    id: 'smol',
    name: 'SmolLM',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/huggingface.svg',
    color: '#FFD21E',
    models: [
      { id: 'HuggingFaceTB/SmolLM2-1.7B-Instruct', name: 'SmolLM2 1.7B', available: true, brandId: 'smol' },
      { id: 'HuggingFaceTB/SmolVLM-Instruct', name: 'SmolVLM Instruct', available: true, brandId: 'smol' }
    ]
  }
]

// Helper function to get all models from all brands
export function getAllModels(): Model[] {
  return MODEL_BRANDS.flatMap(brand => brand.models)
}

// Helper function to get a brand by ID
export function getBrandById(brandId: string): ModelBrand | undefined {
  return MODEL_BRANDS.find(brand => brand.id === brandId)
}

// Helper function to get a model by ID
export function getModelById(modelId: string): Model | undefined {
  return getAllModels().find(model => model.id === modelId)
}
