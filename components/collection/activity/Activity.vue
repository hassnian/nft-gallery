<template>
  <div class="flex">
    <SidebarFilter />
    <div
      ref="wrapper"
      class="w-full mt-4"
    >
      <div v-if="tablet">
        <div class="flex gap-4">
          <div class="w-2/3 pr-2">
            <ActivityChart
              :events="events"
              :loading="loading"
              :class="{ 'mt-2': !loading }"
            />
          </div>
          <div class="flex-1">
            <OwnerInsights
              :owners="owners"
              :flippers="flippers"
            />
          </div>
        </div>
        <BreadcrumbsFilter />
      </div>
      <div v-else>
        <div class="flex flex-col gap">
          <OwnerInsights
            :owners="owners"
            :flippers="flippers"
          />
          <div class="max-width">
            <ActivityChart
              :events="events"
              :loading="loading"
            />
          </div>
        </div>
      </div>
      <hr
        class="mb-7"
        :class="{ 'my-7': !isBreadCrumbsShowing }"
      >
      <Events
        :events="filteredEvents"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import ActivityChart from './ActivityChart.vue'
import OwnerInsights from './OwnerInsights.vue'
import Events from './events/Events.vue'
import { isAnyActivityFilterActive } from './utils'
import { Interaction } from '@/utils/shoppingActions'
import BreadcrumbsFilter from '@/components/shared/BreadcrumbsFilter.vue'
import SidebarFilter from '@/components/shared/filters/SidebarFilter.vue'
import { mintInteraction } from '@/composables/collectionActivity/helpers'
import { useCollectionActivity } from '@/composables/collectionActivity/useCollectionActivity'

const mobileBreakpoint = 800
const route = useRoute()
const tablet = ref(true)
const wrapper = ref<HTMLDivElement | null>(null)

const isBreadCrumbsShowing = computed(
  () => isAnyActivityFilterActive() && tablet.value,
)

const collectionId = computed(() => route.params.id.toString())

const { events, flippers, owners, loading } = useCollectionActivity({
  collectionId,
})

const InteractionIncluded = [
  Interaction.BUY,
  Interaction.LIST,
  mintInteraction(),
  Interaction.SEND,
]

// newest events first (bigger timestamp first)
const filteredEvents = computed(() =>
  events.value
    .filter(event =>
      InteractionIncluded.includes(event.interaction as Interaction),
    ).sort((a, b) => b.timestamp - a.timestamp),
)

useResizeObserver(wrapper, (entry) => {
  if (entry[0].contentRect.width >= mobileBreakpoint) {
    tablet.value = true
  }
  else {
    tablet.value = false
  }
})
</script>

<style lang="scss" scoped>
.gap {
  gap: 2.5rem;
}

//hack to make the chart responsive
.max-width {
  max-width: calc(100% - 1px);
}
</style>
