// Model and Brand data structure
// This will be replaced with database queries in the future

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

// Model brands and their models
// TODO: Replace with database queries
export const MODEL_BRANDS: ModelBrand[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: 'https://1000logos.net/wp-content/uploads/2024/07/OpenAI-Logo-2022.png',
    color: '#10a37f',
    models: [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', available: true, brandId: 'openai' },
      { id: 'gpt-4', name: 'GPT-4', available: true, brandId: 'openai' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', available: true, brandId: 'openai' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: 'https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/68309ab48369f7ad9b4a40e1_open-graph.jpg',
    color: '#d97757',
    models: [
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', available: true, brandId: 'anthropic' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', available: true, brandId: 'anthropic' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', available: true, brandId: 'anthropic' },
    ],
  },
  {
    id: 'google',
    name: 'Gemini',
    logo: 'https://bcassetcdn.com/public/blog/wp-content/uploads/2022/08/29145131/Google-PNG-1024x640.png',
    color: '#4285f4',
    models: [
      { id: 'gemini-pro', name: 'Gemini Pro', available: true, brandId: 'google' },
      { id: 'gemini-flash', name: 'Gemini Flash', available: true, brandId: 'google' },
      { id: 'gemini-ultra', name: 'Gemini Ultra', available: true, brandId: 'google' },
    ],
  },
  {
    id: 'meta',
    name: 'LLAMA',
    logo: 'https://static0.xdaimages.com/wordpress/wp-content/uploads/2021/10/Meta-logo.jpeg?w=1200&h=675&fit=crop',
    color: '#0668e1',
    models: [
      { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', available: true, brandId: 'meta' },
      { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', available: true, brandId: 'meta' },
      { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', available: true, brandId: 'meta' },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    logo: 'https://www.bigdatawire.com/wp-content/uploads/2024/02/mistral-ai.png',
    color: '#ff7000',
    models: [
      { id: 'mistral-7b', name: 'Mistral 7B', available: true, brandId: 'mistral' },
      { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', available: true, brandId: 'mistral' },
      { id: 'mistral-large', name: 'Mistral Large', available: true, brandId: 'mistral' },
    ],
  },
  {
    id: 'qwen',
    name: 'Qwen',
    logo: 'https://images.lifestyleasia.com/wp-content/uploads/sites/2/2025/02/21112012/1_o-q4mpszxwmg4-ofjo2qxw-1600x900.jpeg',
    color: '#ff6a00',
    models: [
      { id: 'qwen-72b', name: 'Qwen 72B', available: true, brandId: 'qwen' },
    ],
  },
  {
    id: 'xai',
    name: 'xAI',
    logo: 'https://1000logos.net/wp-content/uploads/2023/10/xAI-Logo.jpg',
    color: '#000000',
    models: [
      { id: 'grok-2', name: 'Grok 2', available: true, brandId: 'xai' },
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    logo: 'https://1000logos.net/wp-content/uploads/2024/08/Perplexity-Logo.png',
    color: '#20808d',
    models: [
      { id: 'pplx-70b', name: 'Perplexity 70B', available: true, brandId: 'perplexity' },
    ],
  },
  {
    id: 'zhipu',
    name: 'Zhipu AI',
    logo: 'https://beehiiv-images-production.s3.amazonaws.com/uploads/asset/file/86d7d9aa-e263-48b8-8a51-771d4e2985a5/Frame_236.png?t=1714896117',
    color: '#5b8def',
    models: [
      { id: 'glm-4', name: 'GLM-4', available: true, brandId: 'zhipu' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logo: 'https://images.fastcompany.com/image/upload/f_webp,q_auto,c_fit,w_1024,h_1024/wp-cms-2/2025/01/i-0-91268357-deepseek-logo.jpg',
    color: '#1a56db',
    models: [
      { id: 'deepseek-coder', name: 'DeepSeek Coder', available: true, brandId: 'deepseek' },
    ],
  },
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    logo: 'https://cdn.upmarket.co/staticfiles/2025/11/png/78a3e57adaf9a2ec8b5d48b2a5737816',
    color: '#6e45e2',
    models: [
      { id: 'moonshot-v1', name: 'Moonshot v1', available: true, brandId: 'moonshot' },
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://fabrikbrands.com/wp-content/uploads/Amazon-Logo-6.png',
    color: '#ff9900',
    models: [
      { id: 'titan-text', name: 'Titan Text', available: true, brandId: 'amazon' },
    ],
  },
  {
    id: 'nous',
    name: 'Nous Research',
    logo: 'https://pbs.twimg.com/media/G2ByMVwaIAAKMyL.jpg',
    color: '#8b5cf6',
    models: [
      { id: 'hermes-2', name: 'Hermes 2', available: true, brandId: 'nous' },
    ],
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    logo: 'https://cdn.sanity.io/images/e4qjo92p/production/9e2d0caa81c6ac5927545b31fb92878d0395f7f6-1442x962.jpg?auto=format&dpr=2&fit=crop&fp-x=0.5&fp-y=0.5&h=240&q=75&w=385',
    color: '#00d4ff',
    models: [
      { id: 'cerebras-gpt', name: 'Cerebras GPT', available: true, brandId: 'cerebras' },
    ],
  },
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

