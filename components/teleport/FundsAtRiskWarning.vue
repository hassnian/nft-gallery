<template>
  <div class="text-k-red flex items-center cursor-default">
    <KIcon
      name="i-mdi:alert"
      class="mr-3"
      size="medium"
    />
    <span>{{ $t('teleport.fundsAtRisk') }} -&nbsp;</span>
    <NeoTooltip
      multiline
      :multiline-width="256"
      :auto-close="['outside', 'inside']"
    >
      <u>{{ $t('teleport.why') }}</u>
      <template #content>
        <div class="text-left py-2 flex flex-col">
          <span class="mb-3">
            {{
              reason === 'source'
                ? $t('teleport.sourceExistentialDepositWarning', [
                  sourceExistentialDeposit,
                ])
                : $t('teleport.targetExistentialDepositWarning', [
                  targetExistentialDeposit,
                ])
            }}
            <b>{{ $t('teleport.failedTransaction') }}</b>
          </span>
          <a
            v-safe-href="
              'https://hello.kodadot.xyz/information/existential-deposit'
            "
            target="_blank"
            class="text-k-blue hover:text-k-blue-hover"
          >
            {{ $t('teleport.whatIsExistentialDeposit') }}
          </a>
        </div>
      </template>
    </NeoTooltip>
  </div>
</template>

<script setup lang="ts">
import { NeoTooltip } from '@kodadot1/brick'

defineProps<{
  targetExistentialDeposit: number | string
  sourceExistentialDeposit: number | string
  reason: 'source' | 'target'
}>()
</script>
