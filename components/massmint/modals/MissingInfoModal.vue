<template>
  <NeoModal
    :value="isModalActive"
    @close="emit('close')"
  >
    <div class="p-6 w-[unset] lg:w-[25rem]">
      <div class="border-b border-k-shade">
        <p class="font-bold pb-4 text-xl flex justify-center px-0">
          {{ $t('massmint.missingRequiredInfo') }}
        </p>
      </div>
      <div class="pt-4">
        <div class="font-bold text-k-red">
          <div>{{ $t('massmint.required') }}</div>

          <div class="pl-3">
            • {{ $t('massmint.incompleteNfts', { count: missingNames.length }) }} ({{ missingNames.map(nft => `#${nft.id}`).join(', ') }})
          </div>
        </div>
        <div
          v-if="numMissingDescriptions || numMissingPrices"
          class="text-k-red mt-3"
        >
          <div>{{ $t('massmint.optional') }}</div>

          <div
            v-if="numMissingDescriptions"
            class="pl-3"
          >
            •
            {{
              $t('massmint.missingDescription', {
                count: numMissingDescriptions,
              })
            }}
          </div>
          <div
            v-if="numMissingPrices"
            class="pl-3"
          >
            •
            {{
              $t('massmint.missingPrice', {
                count: numMissingPrices,
              })
            }}
          </div>
        </div>
        <div class="mt-6 max-w-xs">
          {{ $t('massmint.cantMintNote') }}
        </div>
      </div>
      <div class="flex justify-center pt-5 px-8">
        <NeoButton
          :label="$t('massmint.goBack')"
          variant="primary"
          no-shadow
          class="flex grow h-[3.25rem]"
          @click="emit('close')"
        />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'
import type { NFT } from '../types'

const props = defineProps<{
  modelValue: boolean
  missingNames: NFT[]
  numMissingDescriptions: number
  numMissingPrices: number
}>()

const isModalActive = useVModel(props, 'modelValue')

const emit = defineEmits(['close'])
</script>
