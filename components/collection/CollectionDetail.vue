<template>
  <div class="collection-detail">
    <div class="collection-detail__header is-12 flex">
      <div class="collection-detail__header-image-wrapper">
        <BasicImage
          v-if="!isLoading"
          :src="image"
          :alt="name"
          :lazy="lazyLoading"
          sizes="70px"
          custom-class="collection-card__image-wrapper-sub p-1"
        />
        <div
          v-else
          class="relative w-full h-full collection-card__image-wrapper-sub p-1"
        >
          <NeoSkeleton
            no-margin
            :rounded="false"
            full-size
          />
        </div>
      </div>
      <span
        v-if="!isLoading"
        class="collection-detail__name"
        :title="name"
      >{{
        name
      }}</span>
      <span
        v-else
        class="collection-detail__name"
      >
        <NeoSkeleton
          no-margin
          size="medium"
          width="100px"
        />
      </span>
    </div>
    <div
      v-if="nfts && !isLoading"
      class="flex justify-around is-vcentered"
    >
      <div class="detail-item text-center basis-0 grow shrink p-3">
        <p class="detail-item__title text-k-grey">
          {{ $t('collectionCard.volume') }}
        </p>
        <CommonTokenMoney
          :round="2"
          :value="collectionTradedVolumeNumber"
        />
      </div>
      <div class="detail-item text-center basis-0 grow shrink p-3">
        <p class="detail-item__title text-k-grey">
          {{ $t('series.highestSale') }}
        </p>
        <CommonTokenMoney
          :round="2"
          :value="collectionHighestSalePrice"
        />
      </div>

      <div class="detail-item text-center basis-0 grow shrink p-3">
        <p class="detail-item__title text-k-grey">
          {{ $t('collectionCard.items') }}
        </p>
        {{ collectionLength }}
      </div>
    </div>
    <div
      v-else
      class="flex justify-around is-vcentered"
    >
      <div
        v-for="n in DESC_SKELETON_COUNT"
        :key="n"
        class="flex items-center detail-item basis-0 grow shrink p-3 px-5"
      >
        <NeoSkeleton
          no-margin
          size="medium"
          position="centered"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'
import type { Interaction, NFT } from '@/types'
import { getVolume } from '@/utils/math'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

const DESC_SKELETON_COUNT = 3

const props = defineProps<{
  isLoading?: boolean
  nfts: NFT[]
  name: string
  image?: string
  lazyLoading?: boolean
}>()

const saleEvents = computed((): Interaction[] => {
  return props.nfts.map(nft => nft.events).flat()
})
const collectionLength = computed((): number => {
  return props.nfts.length
})

const collectionHighestSalePrice = computed((): number => {
  return Math.max(...saleEvents.value.map(event => Number(event.meta)))
})

const collectionTradedVolumeNumber = computed((): bigint => {
  return getVolume(saleEvents.value)
})
</script>
