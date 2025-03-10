import { fromDecimals, toDecimals } from './math'
import type { SomethingWithMeta } from '@/utils/ipfs'
import type { NFTWithCollectionMeta } from '~/components/unique/graphqlResponseTypes'

export const mapOnlyMetadata = (item: SomethingWithMeta): string =>
  item.metadata
export const mapNFTorCollectionMetadata = ({
  metadata,
  collection,
}: NFTWithCollectionMeta): string => metadata || collection?.metadata

// DEV: to -> value * 10 ** decimals ; from -> value / 10 ** decimals
export function mapDecimals(decimals: number, to = true): (number) => number {
  return to
    ? value => toDecimals(value, decimals)
    : value => fromDecimals(value, decimals)
}

export const logError = (
  error: Error | any,
  cb: (message: string) => void,
): void => {
  if (error instanceof Error) {
    cb(error.message)
  }
}
