<template>
  <div class="container-fluid">
    <CollectionGridWithBreadcrumbs />
  </div>
</template>

<script lang="ts" setup>
import { explorerVisible } from '@/utils/config/permission.config'
import { assetHub, chainNameSeoMap, getSeoPrefixName } from '@/utils/seo'

const { urlPrefix } = usePrefix()

const checkRouteAvailability = () => {
  if (!explorerVisible(urlPrefix.value)) {
    navigateTo('/ahp/explore/collectibles')
  }
}

const getSeoMeta = computed(() => {
  const prefix = urlPrefix.value
  const isAssetHub
    = Object.keys(chainNameSeoMap).includes(prefix) && assetHub.includes(prefix)

  return {
    title: isAssetHub
      ? `Collections on Asset Hub ${getSeoPrefixName(prefix)}`
      : 'Explore NFTs',
    description: isAssetHub
      ? `Collections on Asset Hub ${getSeoPrefixName(prefix)}`
      : 'Buy Carbonless NFTs on KodaDot',
    ogUrl: `/${urlPrefix.value}/explore/items`,
  }
})

watch(urlPrefix, () => checkRouteAvailability())

onBeforeMount(() => checkRouteAvailability())

definePageMeta({
  layout: 'explore-layout',
  middleware: [
    function (to) {
      if (to.query.listed !== undefined) {
        return navigateTo({
          path: to.path,
          query: { ...to.query, listed: undefined },
        })
      }
    },
  ],
})

useSeoMeta({
  ...getSeoMeta.value,
})
</script>
