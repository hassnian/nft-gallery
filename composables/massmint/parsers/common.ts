import type { OpenSeaAttribute } from '@kodadot1/hyperdata'
import { validFormats } from '@/composables/massmint/useZipValidator'

export type Entry = {
  file: string
  name?: string
  description?: string
  price?: number
  valid: boolean
  currency?: string
  attributes?: OpenSeaAttribute[]
}

export const validFileExtension = (stringWithFileName: string): boolean => {
  const extensionRegex = new RegExp(`\\.(${validFormats.join('|')})$`, 'i')
  return extensionRegex.test(stringWithFileName)
}

export const isValidEntry = (entry: Partial<Entry>): boolean => {
  if (!entry.file || !validFileExtension(entry.file)) {
    return false
  }

  if (!entry.name && !entry.description && entry.price === undefined) {
    return false
  }

  if (entry.attributes && !Array.isArray(entry.attributes)) {
    return false
  }

  return true
}

export const removeQuotes = (str: string) => {
  return str.replace(/^['"](.*)['"]$/g, '$1')
}
