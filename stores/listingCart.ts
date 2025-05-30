import { defineStore } from 'pinia'
import type {
  EntityWithId,
  NFTMetadata,
  TokenId,
} from '@/types'

export type ListCartItemMediaUrl = { image: string, mimeType?: string }

type ListCartItemInternal = {
  name: string
  price: string
  listPrice?: number
  sn: string
  collection: EntityWithId
  meta?: NFTMetadata
  metadata?: string
  mediaUrl?: ListCartItemMediaUrl // used inside the drop page to show the actual nft image before the metadata is updated
} & CartItem

export type ListCartItem = ListCartItemInternal & TokenId

export const DEFAULT_FLOOR_PRICE_RATE = 1

const localStorage = useLocalStorage<ListCartItem[]>('listingCart', [])

export const useListingCartStore = defineStore('listingCart', () => {
  const {
    items,
    chain,
    decimals,
    count,
    itemsInChain,
    allItemsInChain,
    getItem,
    existInItemIndex,
    isItemInCart,
    setItem,
    setItemDiscardedState,
    removeItem,
    clearDiscardedItems,
    clear: clearItems,
  } = useCart<ListCartItem>({ items: localStorage.value })

  const allOwnedItems = ref<ListCartItem[]>([])

  const incompleteListPrices = computed(() =>
    itemsInChain.value.filter(item => !item.listPrice).length,
  )

  function setItemPrice({ id, price }: { id: string, price?: number }) {
    const itemIndex = existInItemIndex(id, items.value)
    if (itemIndex !== -1) {
      items.value[itemIndex].listPrice = price
      localStorage.value = items.value
    }
  }

  function setOwnedItem(payload: ListCartItem) {
    const itemIndex = existInItemIndex(payload.id, allOwnedItems.value)
    if (itemIndex === -1) {
      allOwnedItems.value.push(payload)
    }
  }

  function setOwnedItems(payload: ListCartItem[]) {
    allOwnedItems.value = payload
  }

  function addAllToCart() {
    allOwnedItems.value.forEach(item => setItem(item))
  }

  function setFixedPrice(price: number) {
    itemsInChain.value.forEach((item) => {
      item.listPrice = price
    })
  }

  function setFloorPrice(rate = DEFAULT_FLOOR_PRICE_RATE) {
    itemsInChain.value.forEach((item) => {
      const floor = (Number(item.collection.floor) || 0) * +rate.toFixed(2)
      item.listPrice = Number(
        (floor / Math.pow(10, decimals.value)).toFixed(4),
      )
    })
  }

  function clearListedItems() {
    localStorage.value = []
    clearItems()
  }

  function clear() {
    clearItems()
    localStorage.value = []
    allOwnedItems.value = []
  }

  return {
    items,
    allOwnedItems,
    chain,
    decimals,
    allItemsInChain,
    itemsInChain,
    count,
    incompleteListPrices,
    getItem,
    isItemInCart,
    setItem,
    setItemPrice,
    setOwnedItem,
    setOwnedItems,
    addAllToCart,
    setFixedPrice,
    setFloorPrice,
    removeItem,
    setItemDiscardedState,
    clearDiscardedItems,
    clearListedItems,
    clear,
  }
})
