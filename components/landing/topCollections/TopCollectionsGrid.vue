<template>
  <DynamicGrid
    grid-size="medium"
    :default-width="GRID_DEFAULT_WIDTH"
    persist
    :fill-rows="collections.length || skeletonCount"
  >
    <template v-if="loading">
      <LandingTopCollectionsCard
        v-for="skeleton in skeletonCount"
        :key="`top-collection-skeleton-card-${skeleton}`"
      />
    </template>

    <template v-else>
      <div
        v-for="(collection, index) in collections"
        :key="collection.id"
        :data-testid="`top-collection-index-${index}`"
      >
        <LandingTopCollectionsCard
          :collection="collection"
          :time-range="timeRange"
        />
      </div>
    </template>
  </DynamicGrid>
</template>

<script setup lang="ts">
import type { CollectionEntityWithVolumes } from './utils/types'
import type { TimeRange } from '@/components/series/types'

const GRID_DEFAULT_WIDTH = {
  small: 0,
  medium: 16 * 16,
  large: 0,
}

defineProps<{
  collections: CollectionEntityWithVolumes[]
  timeRange: TimeRange
  loading: boolean
  skeletonCount: number
}>()
</script>
