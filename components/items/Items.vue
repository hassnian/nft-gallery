<template>
  <div class="flex self-start">
    <SidebarFilter />
    <div class="grow pb-8">
      <div class="is-hidden-mobile">
        <div class="flex justify-between pb-4 pt-5 content-center">
          <BreadcrumbsFilter />
          <div class="mt-1 shrink-0">
            <div v-if="isLoading">
              <NeoSkeleton
                no-margin
                :width="80"
              />
            </div>
            <div v-else-if="total">
              {{ total }} {{ $t('items') }}
            </div>
          </div>
        </div>
        <hr class="my-0">
      </div>
      <ItemsGrid
        fetch-onchain-data
        @total="(v) => (total = v)"
        @loading="
          (loading) => {
            isLoading = loading
          }
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
import ItemsGrid from './ItemsGrid/ItemsGrid.vue'
import SidebarFilter from '@/components/shared/filters/SidebarFilter.vue'
import BreadcrumbsFilter from '@/components/shared/BreadcrumbsFilter.vue'

const total = ref(0)
const isLoading = ref(false)
</script>
