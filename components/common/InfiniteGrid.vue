<template>
  <div>
    <DynamicGrid
      v-if="total !== 0 && (!isLoading || !isFetchingData)"
      :id="scrollContainerId"
      v-slot="{ isMobileVariant, grid }"
      :grid-section="gridSection"
      :mobile-cols="2"
      class="my-5">
      <template v-for="item in items">
        <slot
          name="item"
          :item="item"
          :is-mobile-variant="isMobileVariant"
          :grid="grid" />
      </template>

      <!-- skeleton on fetching next page -->
      <template v-if="isLoading || isFetchingData">
        <template v-for="skeleton in skeletonCount" :key="skeleton">
          <slot name="skeleton-item" />
        </template>
      </template>

      <!-- intersection observer element -->
      <div v-else ref="target"></div>
    </DynamicGrid>

    <!-- skeleton on first load -->
    <DynamicGrid
      v-if="total === 0 && (isLoading || isFetchingData)"
      :grid-section="gridSection"
      class="my-5"
      :mobile-cols="2">
      <template v-for="skeleton in skeletonCount" :key="skeleton">
        <slot name="skeleton-item" />
      </template>
    </DynamicGrid>
  </div>
</template>

<script setup lang="ts">
import { LoadDirection } from '@/composables/useListInfiniteScroll'
import isEqual from 'lodash/isEqual'

export type FetchSearchParams = {
  first: number
  offset: number
}

export type FetchSearchReturn = Promise<{
  success: boolean
  total: number
  items: any[]
}>

type FetchSearchCallback = (parmas: FetchSearchParams) => FetchSearchReturn

const props = defineProps<{
  gridSection: GridSection
  fetchSearch: FetchSearchCallback
  first: number
  resetOnChange: Record<string, any>
}>()

const isLoading = ref(true)
const items = ref<any[]>([])
const loadedPages = ref([] as number[])

function clearFetchResults() {
  items.value = []
  loadedPages.value = []
}

const gotoPage = (page: number) => {
  currentPage.value = page
  startPage.value = page
  endPage.value = page
  isFetchingData.value = false
  isLoading.value = true
  total.value = 0

  clearFetchResults()
  fetchPageData(page)
}

const fetchSearch = async ({
  page,
}: {
  page: number
  loadDirection?: LoadDirection
}) => {
  isFetchingData.value = true

  const response = await props.fetchSearch({
    first: first.value,
    offset: (page - 1) * first.value,
  })

  total.value = response.total

  if (!loadedPages.value.includes(page)) {
    loadedPages.value.push(page)
    items.value = [...items.value, ...response.items]
  }

  isFetchingData.value = false

  return response.success
}

const resetPage = () => {
  isLoading.value = true
  gotoPage(1)
}

const fetchPageData = async (
  page: number,
  loadDirection?: LoadDirection,
): Promise<boolean> => fetchSearch({ page, loadDirection })
const {
  first,
  total,
  startPage,
  endPage,
  currentPage,
  //   scrollItemClassName,
  isFetchingData,
  scrollContainerId,
  fetchNextPage,
} = useListInfiniteScroll({
  gotoPage,
  fetchPageData,
  defaultFirst: props.first,
})

const skeletonCount = first.value

// trigger intersection observer
const target = ref(null)
useIntersectionObserver(target, async ([{ isIntersecting }]) => {
  if (isIntersecting && !isFetchingData.value) {
    await fetchNextPage()
  }
})

onBeforeMount(() => {
  fetchSearch({ page: startPage.value }).then(() => {
    isLoading.value = false
  })
})

watch(
  () => props.resetOnChange,
  (value, oldValue) => {
    if (!isEqual(value, oldValue)) {
      resetPage()
    }
  },
)
</script>
