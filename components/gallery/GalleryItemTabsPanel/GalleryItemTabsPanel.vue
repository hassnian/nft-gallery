<template>
  <NeoTabs
    v-model="active"
    type="toggle"
    expanded
    data-testid="gallery-item-tabs"
    content-class="o-tabs__content--fixed gallery-item-tab-panel"
  >
    <!-- activity -->
    <NeoTabItem
      value="1"
      :label="$t('tabs.activity')"
      data-testid="offer-activity"
    >
      <GalleryItemActivity
        v-if="nft?.id"
        :nft-id="nft?.id"
      />
    </NeoTabItem>

    <!-- offers -->
    <NeoTabItem
      v-if="offerVisible(urlPrefix)"
      value="2"
      :label="$t('offers')"
      data-testid="offers-activity"
    >
      <GalleryItemOffers
        v-if="nft?.id"
        :nft-id="nft.id"
      />
    </NeoTabItem>

    <!-- chart -->
    <NeoTabItem
      value="3"
      :label="$t('tabs.chart')"
      class="p-5"
    >
      <GalleryItemChart :nft-events="nft?.events" />
    </NeoTabItem>
  </NeoTabs>
</template>

<script setup lang="ts">
import { NeoTabItem, NeoTabs } from '@kodadot1/brick'
import GalleryItemActivity from './GalleryItemActivity.vue'
import GalleryItemOffers from './GalleryItemOffers.vue'
import GalleryItemChart from './GalleryItemChart.vue'
import { offerVisible } from '@/utils/config/permission.config'

const props = withDefaults(
  defineProps<{
    activeTab?: string
  }>(),
  {
    activeTab: '0',
  },
)

const { urlPrefix } = usePrefix()
const { getNft: nft } = storeToRefs(useNftStore())

const active = ref('1')
const collectionId = ref('')

watchEffect(() => {
  if (props.activeTab) {
    active.value = props.activeTab
  }

  collectionId.value = nft.value?.collection.id || ''
})
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.o-tabs__content--fixed.gallery-item-tab-panel {
  @include mobile {
    height: 28rem;
  }
}
.offers-disabled-tooltip {
  transform: translateX(calc(-50% + 3rem));
  .o-tip__arrow--top {
    transform: translateX(-3rem);
  }
}
</style>
