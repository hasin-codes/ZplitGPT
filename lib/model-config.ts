export interface ModelConfig {
  id: string
  name: string
  color: string
}

// Quick model configurations for specific UI elements
// Uses FREE-tier Bytez models
export const MODEL_CONFIGS: ModelConfig[] = [
  { id: 'Qwen/Qwen2.5-3B-Instruct', name: 'Qwen 2.5 3B', color: '#ff6a00' },
  { id: 'google/gemma-3-4b-it', name: 'Gemma 3 4B', color: '#4285f4' },
  { id: 'microsoft/Phi-3-mini-4k-instruct', name: 'Phi 3 Mini', color: '#00a4ef' },
  { id: 'HuggingFaceTB/SmolLM2-1.7B-Instruct', name: 'SmolLM2 1.7B', color: '#FFD21E' },
  { id: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0', name: 'TinyLlama 1.1B', color: '#10b981' },
  { id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B', name: 'DeepSeek R1 1.5B', color: '#1a56db' }
]

export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_CONFIGS.find(config => config.id === modelId)
}
