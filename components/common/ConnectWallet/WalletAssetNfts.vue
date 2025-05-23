<template>
  <div v-if="nfts.length">
    <hr class="my-4">
    <p class="text-k-grey text-xs mb-2">
      Recent NFTs
    </p>
    <div class="nfts">
      <NuxtLink
        v-for="nft in nfts"
        :key="nft?.id"
        :to="`/${urlPrefix}/gallery/${nft?.id}`"
      >
        <BaseMediaItem
          :src="sanitizeIpfsUrl(nft?.meta.image)"
          :mime-type="nft?.type"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { getNftMetadata } from '@/composables/useNft'
import { getMimeType } from '@/utils/gallery/media'

import type { NFTWithMetadata } from '@/composables/useNft'

const { accountId } = useAuth()
const { urlPrefix } = usePrefix()

const { data } = useSearchNfts({
  search: [
    {
      currentOwner_eq: accountId.value,
    },
  ],
  first: 3,
  orderBy: 'createdAt_DESC',
})

const nfts = ref<NFTWithMetadata[]>([])

watchEffect(() => {
  if (data.value?.nFTEntities) {
    const nftEntities = data.value.nFTEntities

    nftEntities.forEach(async (nft, index) => {
      const nftMetadata = await getNftMetadata(nft)

      if (nftMetadata.meta.image) {
        const mimeType = await getMimeType(
          sanitizeIpfsUrl(nftMetadata.meta.image),
        )
        nfts.value[index] = { ...nftMetadata, type: mimeType }
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.nfts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  & > * {
    border: 1px solid var(--k-grey);

    &:hover {
      border-color: var(--border-color);
      opacity: 0.85;
    }
  }
}
</style>
