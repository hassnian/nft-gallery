<template>
  <div>
    <div
      class="flex max-md:flex-col items-start max-md:gap-8 md:items-center md:justify-between mb-14"
    >
      <h3 class="text-[2rem] font-bold leading-[1.125]">
        {{ $t('drops.latestMints') }}
      </h3>

      <div class="flex gap-4 items-center">
        <ProfileOrderByDropdown
          no-shadow
          rounded
          :preselect="defaultSort"
          variant="outlined-rounded"
        />
        <ProfileFilterButton
          :label="$t('sort.listed')"
          url-param="listed"
          variant="outlined-rounded"
          data-testid="drop-filter-button-buynow"
        />
      </div>
    </div>

    <ItemsGrid
      :search="itemsGridSearch"
      :grid-size="'medium'"
      hide-collection-popover
      hide-listing
      show-timestamp
      :reset-search-query-params="['sort']"
      fetch-onchain-data
    />
  </div>
</template>

<script setup lang="ts">
import ItemsGrid from '@/components/items/ItemsGrid/ItemsGrid.vue'

const defaultSort = 'blockNumber_DESC'

const props = defineProps<{
  collectionId: string
}>()

const route = useRoute()

const itemsGridSearch = computed(() => {
  const query: Record<string, any> = {
    collection: {
      id_eq: props.collectionId,
    },
    burned_eq: false,
  }

  if (route.query?.listed === 'true') {
    query['price_gt'] = 0
  }

  return query
})
</script>
