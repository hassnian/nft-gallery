<template>
  <SiderbarFilterSection
    :title="$t('tabs.tabActivity.price')"
    :expanded="expanded"
    :fluid-padding="fluidPadding"
  >
    <form
      @submit.prevent="apply"
    >
      <div
        class="flex input-container mb-4"
        :class="[inputFocused ? 'input-focused' : '']"
      >
        <NeoInput
          v-model="range.min"
          class="input-sidebar"
          type="number"
          min="0"
          step="any"
          placeholder="MIN"
          data-testid="input-min"
          @focus="toggleInputFocused"
          @blur="toggleInputFocused"
        />
        <div class="flex items-center">
          <svg
            width="28"
            height="8"
            viewBox="0 0 28 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27.3536 4.35355C27.5488 4.15829 27.5488 3.84171 27.3536 3.64645L24.1716 0.464466C23.9763 0.269204 23.6597 0.269204 23.4645 0.464466C23.2692 0.659728 23.2692 0.976311 23.4645 1.17157L26.2929 4L23.4645 6.82843C23.2692 7.02369 23.2692 7.34027 23.4645 7.53553C23.6597 7.7308 23.9763 7.7308 24.1716 7.53553L27.3536 4.35355ZM0 4.5H27V3.5H0V4.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <NeoInput
          v-model="range.max"
          class="input-sidebar"
          min="0"
          step="any"
          type="number"
          placeholder="MAX"
          data-testid="input-max"
          @focus="toggleInputFocused"
          @blur="toggleInputFocused"
        />
      </div>
      <div class="flex">
        <div class="unit mr-2 flex items-center py-1 px-3">
          {{ unit }}
        </div>
        <NeoButton
          data-testid="apply"
          :disabled="!isValidFilter(range.min, range.max)"
          no-shadow
          variant="primary"
          expanded
          @click="apply"
        >
          {{ $t('general.apply') }}
        </NeoButton>
      </div>
    </form>
  </SiderbarFilterSection>
</template>

<script lang="ts" setup>
import { NeoButton, NeoInput } from '@kodadot1/brick'
import { fromDecimals, toDecimals } from '@/utils/math'
import { useExploreFiltersStore } from '@/stores/exploreFilters'

const exploreFiltersStore = useExploreFiltersStore()
const { replaceUrl } = useReplaceUrl()
type DataModel = 'query' | 'store'

const props = withDefaults(
  defineProps<{
    expanded?: boolean
    dataModel?: DataModel
    fluidPadding?: boolean
  }>(),
  {
    expanded: false,
    dataModel: 'query',
    fluidPadding: false,
  },
)

const route = useRoute()
const { decimals, unit } = useChain()

const range
  = props.dataModel === 'query'
    ? ref({
      min:
          fromDecimals(Number(route.query?.min), decimals.value) || undefined,
      max:
          fromDecimals(Number(route.query?.max), decimals.value) || undefined,
    })
    : ref({
      min: fromDecimals(Number(exploreFiltersStore.min), decimals.value),
      max: fromDecimals(Number(exploreFiltersStore.max), decimals.value),
    })

const emit = defineEmits(['resetPage'])
const apply = () => {
  if (props.dataModel === 'query') {
    applyToQuery()
  }
  if (props.dataModel === 'store') {
    applyToStore()
  }
}

const applyToStore = () => {
  const min = range.value.min
    ? toDecimals(range.value.min, decimals.value)
    : undefined
  const max = range.value.max
    ? toDecimals(range.value.max, decimals.value)
    : undefined
  exploreFiltersStore.setPriceRange({ min, max })
  exploreFiltersStore.setListed(true)
}

const applyToQuery = () => {
  const priceMin = range.value.min
    ? String(toDecimals(range.value.min, decimals.value))
    : undefined
  const priceMax = range.value.max
    ? String(toDecimals(range.value.max, decimals.value))
    : undefined

  replaceUrl({ listed: String(true), min: priceMin, max: priceMax })
  emit('resetPage')
}
const isValidFilter = (
  min: number | string | undefined,
  max: number | string | undefined,
): boolean => {
  const minValue = typeof min === 'string' ? min.trim() : min
  const maxValue = typeof max === 'string' ? max.trim() : max
  return ((minValue || maxValue)
    && (!minValue || !maxValue || Number(maxValue) > Number(minValue))) as boolean
}

const inputFocused = ref(false)

const toggleInputFocused = (): void => {
  inputFocused.value = !inputFocused.value
}
</script>

<style lang="scss">
.input-container {
  border: 1px solid var(--border-color);

  .input-sidebar {
    border: none !important;
    height: 2.5rem;
    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
  }
}

.unit {
  border: 1px solid var(--border-color);
}

.input-focused {
  box-shadow: 0 0 0 1px var(--k-blue);
}
</style>
