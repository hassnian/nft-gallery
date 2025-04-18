import type { PartialConfig, Prefix } from './types'

const hasCreate: PartialConfig = {
  dot: false,
  ksm: false,
}

const hasSales: PartialConfig = {
  ahk: false,
  dot: false,
  ahp: false,
}

const hasMassmintCreate: PartialConfig = {
  dot: false,
}

const hasExplorer: PartialConfig = {
  dot: false,
  ksm: false,
}

export const createVisible = (prefix: Prefix | string): boolean => {
  return isEvm(prefix as Prefix) ? false : hasCreate[prefix] ?? true
}

export const listVisible = (prefix: Prefix | string): boolean => {
  return isSub(prefix as Prefix)
}

export const transferVisible = (prefix: Prefix | string): boolean => {
  return isSub(prefix as Prefix)
}

export const teleportVisible = (prefix: Prefix | string): boolean => {
  return isSub(prefix as Prefix)
}

export const massmintCreateVisible = (prefix: Prefix | string) => {
  return hasMassmintCreate[prefix] ?? true
}

export const salesVisible = (prefix: Prefix | string) => {
  return hasSales[prefix] ?? true
}

export const dropsVisible = (prefix: Prefix | string) => {
  return isAssetHub(prefix as Prefix) || isEvm(prefix as Prefix)
}

export const explorerVisible = (prefix: Prefix | string): boolean => {
  return hasExplorer[prefix] ?? true
}

export const burnVisible = (prefix: Prefix): boolean => {
  return isSub(prefix) || isEvm(prefix)
}

export const offerVisible = (prefix: Prefix): boolean => {
  return tradeVisible(prefix)
}

export const swapVisible = (prefix: Prefix): boolean => {
  return tradeVisible(prefix)
}

export const tradeVisible = (prefix: Prefix): boolean => {
  return isAssetHub(prefix)
}
