<template>
  <div
    v-if="isLogIn"
    class="rounded-[10rem] border border-k-shade flex justify-start grow pl-3"
  >
    <IdentityItem
      :label="$t('confirmPurchase.connectedWith')"
      hide-identity-popover
      disable-identity-link
      :prefix="urlPrefix"
      :account="accountId"
      class="identity-name-font-weight-regular"
      data-testid="item-creator"
    />
  </div>
</template>

<script setup lang="ts">
import IdentityItem from '@/components/identity/IdentityItem.vue'

const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
</script>
