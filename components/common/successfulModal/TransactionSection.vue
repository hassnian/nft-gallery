<template>
  <div
    class="border border-k-shade rounded-[4rem] py-[7px] px-2 flex items-center justify-between"
  >
    <div
      class="flex px-2 py-[6px] rounded-full gap-2"
      :class="[
        isFinalized
          ? 'text-k-green bg-k-green-accent-2'
          : 'text-k-grey bg-k-grey-light',
      ]"
    >
      <KIcon
        v-if="isFinalized"
        name="i-mdi:check-circle-outline"
      />

      <p class="text-xs">
        {{ isFinalized ? $t('confirmed') : `${$t('finalazing')}...` }}
      </p>
    </div>

    <div class="flex items-center">
      <a
        v-safe-href="txUrl"
        class="has-text-link ml-3 text-xs"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        {{ $t('helper.viewTx') }}
        <KIcon name="i-mdi:arrow-top-right" />
      </a>

      <KIcon
        name="i-mdi:circle"
        class="text-k-grey opacity-20 mx-2 text-[0.5rem]"
        size="small"
      />

      <NeoButton
        v-clipboard:copy="txUrl"
        variant="icon"
        no-shadow
        data-testid="tx-clipboard"
        @click="toast($t('general.copyToClipboard'))"
      >
        <KIcon
          name="i-mdi:content-copy"
          class="text-k-grey cursor-pointer"
        />
      </NeoButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { TransactionStatus } from '@/composables/useTransactionStatus'

const props = defineProps<{
  txHash?: string
  status: TransactionStatus
}>()

const { toast } = useToastOruga()
const { getTransactionUrl } = useExplorer()
const { urlPrefix } = usePrefix()

const isFinalized = computed(() => props.status == TransactionStatus.Finalized)

const txUrl = computed(() =>
  getTransactionUrl(props.txHash || '', urlPrefix.value),
)
</script>
