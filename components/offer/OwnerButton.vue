<template>
  <ProfileButtonConfig
    v-if="buttonConfig"
    :loading="loading"
    :button="buttonConfig"
  />
</template>

<script setup lang="ts">
import type { ButtonConfig } from '../profile/types'

const emit = defineEmits(['click'])
const props = defineProps<{ offer: NFTOfferItem, loading?: boolean }>()

const { accountId } = useAuth()
const { $i18n } = useNuxtApp()

const { isOwnerOfNft, isOwnerOfOffer } = useIsOffer(computed(() => props.offer), accountId)

const onClick = () => emit('click', props.offer)

const buttonConfig = computed<ButtonConfig | null>(() => {
  if (props.offer.status === 'EXPIRED') {
    return isOwnerOfOffer.value
      ? {
          label: $i18n.t('offer.withdrawAmount'),
          onClick,
        }
      : null
  }

  if (isOwnerOfOffer.value) {
    return {
      label: $i18n.t('transaction.offerWithdraw'),
      classes: '!border-k-red !bg-k-red-accent-2',
      onClick,
    }
  }

  if (isOwnerOfNft.value) {
    return {
      label: $i18n.t('transaction.offerAccept'),
      onClick,
    }
  }

  return null
})
</script>
