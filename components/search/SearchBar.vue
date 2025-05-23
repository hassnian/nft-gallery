<template>
  <div class="search-bar-container">
    <NeoAutocomplete
      ref="searchRef"
      v-model="name"
      :root-class="`gallery-search ${
        isCollectionSearchMode && 'is-collection-search'
      }`"
      :class="{
        'gallery-search--skip-button': isTouchDevice,
      }"
      :placeholder="placeholderContent"
      data-testid="search-bar-input"
      icon="search"
      icon-pack="fasr"
      :open-on-focus="showDefaultSuggestions"
      menu-position="bottom"
      expanded
      @blur="onInputBlur"
      @focus="onInputFocus"
      @keydown.delete="exitCollectionSearch"
      @keydown.backSpace="exitCollectionSearch"
      @keydown.enter="onEnter"
    >
      <template
        v-if="!isCollectionSearchMode"
        #header
      >
        <SearchSuggestion
          ref="searchSuggestionRef"
          :name="name"
          :show-default-suggestions="showDefaultSuggestions"
          :query="query"
          @goto-gallery="$emit('redirect', $event)"
          @close="closeDropDown"
        />
      </template>
    </NeoAutocomplete>
    <div class="search-bar-bg" />
    <div
      v-if="isCollectionSearchMode"
      class="search-bar-collection-search flex items-center"
    >
      <span class="flex items-center">{{
        $i18n.t('search.searchCollection')
      }}</span>
      <svg
        width="7"
        height="14"
        viewBox="0 0 7 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.544 0.32L1.648 13.12H0.448L5.344 0.32H6.544Z"
          fill="#999999"
        />
      </svg>
    </div>
    <img
      v-if="!isTouchDevice"
      class="search-bar-keyboard-icon"
      :src="desktopKeyboardIcon.src"
      :alt="desktopKeyboardIcon.alt"
    >
  </div>
</template>

<script setup lang="ts">
import { NeoAutocomplete } from '@kodadot1/brick'
import type { PropType } from 'vue'
import type { SearchQuery } from './types'
import { useCollectionSearch } from '@/components/search/utils/useCollectionSearch'
import SearchSuggestion from '@/components/search/SearchSuggestion.vue'
import SearchKKeyboard from '@/assets/svg/search-k-keyboard.svg'
import SearchKEnter from '@/assets/svg/k-search-enter.svg'

const isTouchDevice = 'ontouchstart' in document.documentElement

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  query: Object as PropType<SearchQuery>,
})

const emits = defineEmits(['update:modelValue', 'blur-sm', 'enter', 'redirect'])
const { $i18n } = useNuxtApp()

const name = useVModel(props, 'modelValue', emits, {
  eventName: 'update:modelValue',
})

const searchRef = ref<InstanceType<typeof NeoAutocomplete>>()
const searchSuggestionRef = ref<InstanceType<typeof SearchSuggestion>>()
const enableSearchInCollection = ref(true)
const inputFocused = ref(false)
const { urlPrefix } = usePrefix()
const { isAssetHub } = useIsChain(urlPrefix)

const { isCollectionSearchMode, setCollectionSearchMode }
  = useCollectionSearch()
useKeyboardEvents({ k: bindSearchEvents })

const placeholderContent = computed(() =>
  inputFocused.value || isCollectionSearchMode.value
    ? ''
    : $i18n.t('general.searchPlaceholder'),
)

const showDefaultSuggestions = computed(() => isAssetHub.value)
const desktopKeyboardIcon = computed(() => name.value || inputFocused.value ? { src: SearchKEnter, alt: 'press enter to start search' } : { src: SearchKKeyboard, alt: 'press k to focus search input' })

function exitCollectionSearch() {
  if (isCollectionSearchMode.value && !name.value) {
    enableSearchInCollection.value = false
  }
}

function onEnter() {
  closeDropDown()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  searchRef.value?.$refs?.input?.$refs?.input?.blur()
  // insert search term in history
  searchSuggestionRef.value?.insertNewHistory()
  emits('enter')
}

function focusInput() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  searchRef.value?.focus()
}

function onInputFocus() {
  inputFocused.value = true
}

function onInputBlur() {
  // don't remove timeout,  blur is triggered before click this allows the click event to be called
  setTimeout(() => {
    emits('blur-sm')
    inputFocused.value = false
    if (!name.value) {
      enableSearchInCollection.value = true
    }
  }, 200)
}

function bindSearchEvents(event: KeyboardEvent) {
  event.preventDefault()
  if (
    event.key === 'k'
    && searchRef.value?.$el?.getBoundingClientRect()?.top > 0
  ) {
    focusInput()
  }
}

function closeDropDown() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  searchRef.value.isActive = false
}

watch(
  enableSearchInCollection,
  () => {
    setCollectionSearchMode(enableSearchInCollection.value)
  },
  { immediate: true },
)

defineExpose({ focusInput })
</script>
