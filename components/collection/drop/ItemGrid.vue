<template>
  <div>
    <div class="flex items-center justify-between">
      <h3 class="title is-3">{{ $t('drops.lastestMints') }}</h3>

      <div class="flex gap-2">
        <ProfileOrderByDropdown no-shadow rounded :preselect="defaultSort" />
        <ProfileFilterButton
          :label="$t('sort.listed')"
          url-param="buy_now"
          data-testid="profile-filter-button-buynow" />
      </div>
    </div>

    <InfiniteGrid
      ref="infiniteGrid"
      :grid-section="gridSection"
      :fetch-search="fetchSearch"
      :first="40"
      :reset-on-change="queryParams">
      <template #item="{ item }">
        <NftCard :key="item.id" :nft="item" :prefix="urlPrefix" />
      </template>

      <template #skeleton-item>
        <NftCard is-loading :prefix="urlPrefix" />
      </template>
    </InfiniteGrid>
  </div>
</template>

<script setup lang="ts">
import { flattenNFT } from '@/components/carousel/utils/useCarouselEvents'
import resolveQueryPath from '@/utils/queryPathResolver'
import {
  FetchSearchParams,
  FetchSearchReturn,
} from '@/components/common/InfiniteGrid.vue'

const gridSection = GridSection.PROFILE_GALLERY
const defaultSort = 'blockNumber_DESC'

const props = defineProps<{
  collectionId: string
}>()

const { urlPrefix, client } = usePrefix()
const route = useRoute()
const infiniteGrid = ref()

const query = await resolveQueryPath(client.value, 'latestEvents')

const queryParams = computed(() => {
  const sort = route.query?.sort || defaultSort
  const orderBy = Array.isArray(sort) ? sort : [sort]

  const listed = route.query?.buy_now === 'true'

  return { orderBy, listed }
})

const fetchSearch = async ({
  first,
  offset,
}: FetchSearchParams): FetchSearchReturn => {
  const { orderBy, listed } = queryParams.value

  const queryVariables = {
    limit: first,
    offset: offset,
    orderBy: orderBy,
    where: {
      interaction_eq: 'MINT',
      nft: {
        price_gt: listed ? 0 : undefined,
        collection: {
          id_eq: props.collectionId,
        },
      },
    },
  }

  const { data: result } = await useAsyncQuery<{
    events: any[]
    eventsConnection: { totalCount: number }
  }>({
    query: query.default,
    variables: queryVariables,
    clientId: client.value,
  })

  const total = result.value.eventsConnection.totalCount
  const items = flattenNFT(result.value.events || [], urlPrefix.value)

  return { items, success: true, total: total }
}
</script>
