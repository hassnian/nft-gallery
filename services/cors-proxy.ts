const BASE_URL = 'https://cors-proxy.kodadot.workers.dev/'

export const getProxiedUrl = (url: string): string => {
  return `${BASE_URL}/?url=${encodeURIComponent(url)}`
}