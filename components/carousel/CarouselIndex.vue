<template>
  <div v-if="nfts.length">
    <h2 class="title is-2">
      {{ title }}
    </h2>

    <CarouselList
      v-if="showCarousel"
      :key="nftIds"
      :nfts="nfts"
      :gallery-item-carousel="galleryItemCarousel"
      :step="steps"
    />
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import type { CarouselNFT } from '@/components/base/types'

const CarouselList = defineAsyncComponent(
  () => import('./module/NftCarousel.vue'),
)

const props = defineProps<{
  title?: string
  subtitle?: string
  nfts: CarouselNFT[]
  loading?: boolean
  actionType?: 'pagination' | 'link'
  linkUrl?: string
  linkText?: string
  itemUrl?: string
  galleryItemCarousel?: boolean
}>()

const itemUrl = computed(() => props.itemUrl || 'gallery')
provide('itemUrl', itemUrl.value)

const showCarousel = computed(() => props.nfts.length)
const nftIds = computed(() => props.nfts.map(nft => nft.id).join(''))

const { width } = useWindowSize()
const steps = computed(() => {
  if (width.value > 1540) {
    return 6
  }
  if (width.value > 1280) {
    return 5
  }
  if (width.value > 1024) {
    return 4
  }
  if (width.value > 768) {
    return 2
  }
  return 1
})
</script>
