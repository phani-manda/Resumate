/**
 * AI Provider Fallback Chain
 * Automatically switches between AI providers when one fails
 * Chain: Groq → Google (Gemini) → Fallback error
 */

import { createGroq } from '@ai-sdk/groq'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText, streamText, LanguageModel } from 'ai'

export type AIProvider = 'groq' | 'google'

interface ProviderConfig {
  name: AIProvider
  model: LanguageModel
  available: boolean
}

// Initialize providers
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

// Provider chain configuration
const providerChain: ProviderConfig[] = [
  {
    name: 'groq',
    model: groq('llama-3.3-70b-versatile'),
    available: !!process.env.GROQ_API_KEY,
  },
  {
    name: 'google',
    model: google('gemini-1.5-flash'),
    available: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
]

// Get available providers
export function getAvailableProviders(): AIProvider[] {
  return providerChain
    .filter(p => p.available)
    .map(p => p.name)
}

// Get the first available provider
export function getPrimaryProvider(): ProviderConfig | null {
  return providerChain.find(p => p.available) || null
}

// Fallback text generation with automatic provider switching
export async function generateWithFallback(
  prompt: string,
  system?: string,
  options?: {
    maxTokens?: number
    temperature?: number
  }
): Promise<{ text: string; provider: AIProvider }> {
  const availableProviders = providerChain.filter(p => p.available)

  if (availableProviders.length === 0) {
    throw new Error('No AI providers available. Please configure at least one API key.')
  }

  let lastError: Error | null = null

  for (const provider of availableProviders) {
    try {
      console.log(`Attempting AI generation with ${provider.name}...`)

      const result = await generateText({
        model: provider.model,
        prompt,
        system,
        maxTokens: options?.maxTokens ?? 2000,
        temperature: options?.temperature ?? 0.7,
      })

      console.log(`Successfully generated with ${provider.name}`)
      return {
        text: result.text,
        provider: provider.name,
      }
    } catch (error) {
      console.error(`${provider.name} failed:`, error)
      lastError = error instanceof Error ? error : new Error(String(error))
      // Continue to next provider
    }
  }

  throw new Error(
    `All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`
  )
}

// Fallback streaming with automatic provider switching
export async function streamWithFallback(
  prompt: string,
  system?: string,
  options?: {
    maxTokens?: number
    temperature?: number
    onProvider?: (provider: AIProvider) => void
  }
) {
  const availableProviders = providerChain.filter(p => p.available)

  if (availableProviders.length === 0) {
    throw new Error('No AI providers available. Please configure at least one API key.')
  }

  let lastError: Error | null = null

  for (const provider of availableProviders) {
    try {
      console.log(`Attempting AI stream with ${provider.name}...`)

      const result = streamText({
        model: provider.model,
        prompt,
        system,
        maxTokens: options?.maxTokens ?? 2000,
        temperature: options?.temperature ?? 0.7,
      })

      // Notify which provider is being used
      options?.onProvider?.(provider.name)

      return result
    } catch (error) {
      console.error(`${provider.name} streaming failed:`, error)
      lastError = error instanceof Error ? error : new Error(String(error))
      // Continue to next provider
    }
  }

  throw new Error(
    `All AI providers failed for streaming. Last error: ${lastError?.message || 'Unknown error'}`
  )
}

// Health check for all providers
export async function checkProviderHealth(): Promise<Record<AIProvider, boolean>> {
  const health: Record<string, boolean> = {}

  for (const provider of providerChain) {
    if (!provider.available) {
      health[provider.name] = false
      continue
    }

    try {
      await generateText({
        model: provider.model,
        prompt: 'Say "OK"',
        maxTokens: 10,
      })
      health[provider.name] = true
    } catch {
      health[provider.name] = false
    }
  }

  return health as Record<AIProvider, boolean>
}

// Get model for a specific provider
export function getProviderModel(provider: AIProvider): LanguageModel | null {
  const config = providerChain.find(p => p.name === provider)
  return config?.available ? config.model : null
}
