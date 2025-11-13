/**
 * Model Configuration
 * Defines available models with their properties
 */

export interface ModelConfig {
  id: string
  name: string
  color: string
}

export const MODEL_CONFIGS: ModelConfig[] = [
  { id: 'mixtral-8x7b', name: 'Groq Mixtral 8x7B', color: '#ff6b4a' },
  { id: 'llama-3.1-70b', name: 'Groq Llama 3.1 70B', color: '#4a9eff' },
  { id: 'gpt-3.5-turbo', name: 'OpenAI GPT-3.5 Turbo', color: '#10a37f' },
  { id: 'claude-3-sonnet', name: 'Anthropic Claude 3 Sonnet', color: '#d97757' },
  { id: 'gemini-pro', name: 'Google Gemini Pro', color: '#4285f4' },
  { id: 'mistral-7b', name: 'Mistral 7B', color: '#ff7000' },
  { id: 'qwen-72b', name: 'Qwen 72B', color: '#ff6a00' },
  { id: 'deepseek-coder', name: 'DeepSeek Coder', color: '#1a56db' },
  { id: 'glm-4', name: 'Zhipu GLM-4', color: '#5b8def' }
]

export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_CONFIGS.find(m => m.id === modelId)
}

