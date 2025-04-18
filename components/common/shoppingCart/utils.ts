import type { ShoppingCartItem } from './types'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import type { ListCartItem, ListCartItemMediaUrl } from '@/stores/listingCart'
import { useFiatStore } from '@/stores/fiat'
import { sum } from '@/utils/math'
import type { NFT, TokenId } from '@/types'
import { chainPropListOf } from '@/utils/config/chain.config'
import type { MakingOfferItem } from '@/components/trade/types'

export const prefixToToken = {
  ahk: 'KSM',
  ahp: 'DOT',
  dot: 'DOT',
  ahr: 'ROC',
}

const getTokenDecimal = (item: ShoppingCartItem) => {
  const token = prefixToToken[item.urlPrefix]
  return chainPropListOf(token.toLowerCase()).tokenDecimals
}

export const totalPriceUsd = (items: ShoppingCartItem[]) => {
  const fiatStore = useFiatStore()

  const nftSPrice = items.map(item =>
    calculateExactUsdFromToken(
      Number(item.price) * Math.pow(10, -getTokenDecimal(item)),
      Number(fiatStore.getCurrentTokenValue(prefixToToken[item.urlPrefix])),
    ),
  )

  const royalties = items.map(item =>
    item.royalty
      ? calculateExactUsdFromToken(
        Number(item.royalty.amount) * Math.pow(10, -getTokenDecimal(item)),
        Number(fiatStore.getCurrentTokenValue(prefixToToken[item.urlPrefix])),
      )
      : 0,
  )

  return {
    nfts: sum(nftSPrice),
    royalties: sum(royalties),
  }
}

export const nftToShoppingCartItem = (nft: NFT): ShoppingCartItem => {
  const { urlPrefix } = usePrefix()
  return {
    id: nft.id,
    name: nft.name,
    currentOwner: nft.currentOwner,
    price: nft.price ?? '0',
    urlPrefix: urlPrefix.value,
    collection: nft.collection,
    royalty: nft.royalty
      ? { amount: nft.royalty, address: nft.recipient ?? '' }
      : undefined,
    addedAt: new Date().getTime(),
    metadata: nft.metadata,
    meta: nft.meta,
    sn: nft.sn,
  }
}

export const nftToListingCartItem = (
  nft: NFT & TokenId,
  floor = '',
  mediaUrl?: ListCartItemMediaUrl,
): ListCartItem => {
  const { urlPrefix } = usePrefix()

  return {
    id: nft.id,
    name: nft.name,
    price: nft.price ?? '0',
    urlPrefix: urlPrefix.value,
    collection: {
      ...nft.collection,
      floor,
    },
    listPrice: undefined,
    metadata: nft.metadata,
    meta: nft.meta,
    token: nft.token,
    sn: nft.sn,
    mediaUrl: mediaUrl,
  }
}

export const nftToOfferItem = (nft: NFT & TokenId, highestOffer?: string): MakingOfferItem => {
  const { urlPrefix } = usePrefix()

  return {
    id: nft.id,
    name: nft.name,
    price: nft.price ?? '0',
    highestOffer,
    urlPrefix: urlPrefix.value,
    collection: nft.collection,
    metadata: nft.metadata,
    meta: nft.meta,
    sn: nft.sn,
    currentOwner: nft.currentOwner,
  }
}

export const shoppingCartItemToListingCartItem = (
  item: ShoppingCartItem,
  floor = '',
): ListCartItem => {
  return {
    id: item.id,
    name: item.name,
    price: item.price ?? '0',
    urlPrefix: item.urlPrefix,
    collection: { ...item.collection, floor },
    metadata: item.metadata,
    meta: item.meta,
    listPrice: undefined,
    sn: item.sn,
  }
}
