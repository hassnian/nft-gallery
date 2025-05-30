<template>
  <div>
    <div
      class="shopping-cart-modal-container bg-background-color border-l flex flex-col"
      data-testid="shopping-cart-modal-container"
    >
      <NeoModalHead
        :title="$t('shoppingCart.title')"
        @close="closeShoppingCart(ModalCloseType.BACK)"
      />
      <div
        v-if="numberOfItems"
        class="mx-6 py-4 border-b border-k-shade flex justify-between items-center"
      >
        <span> {{ numberOfItems }} {{ $t('items') }}</span>

        <NeoButton
          v-safe-href="`/${urlPrefix}/explore/items`"
          :label="$t('shoppingCart.clearAll')"
          no-shadow
          variant="text"
          @click="clearAllItems"
        />
      </div>
      <div
        v-if="numberOfItems"
        class="scroll-y"
      >
        <div class="bg-background-color flex grow flex-col py-2">
          <ShoppingCartItemRow
            v-for="item in sortedItems"
            :key="item.id"
            :nft="item"
            clickable
            data-testid="shopping-cart-item"
            class="px-6 py-2 limit-name-width"
            allow-delete
            @delete="shoppingCartStore.removeItem"
            @click-item="closeShoppingCart"
          />
        </div>
        <div class="flex justify-between mx-6 py-4 border-t border-k-shade">
          {{ $t('shoppingCart.total') }}
          <div class="flex">
            <CommonTokenMoney
              :value="totalPrice"
              class="text-k-grey"
            />
            <span class="font-bold ml-4"> ${{ priceUSD }} </span>
          </div>
        </div>
        <div class="flex justify-center mx-6 pt-4 pb-5">
          <NeoButton
            :label="$t('shoppingCart.completePurchase')"
            :disabled="!numberOfItems"
            class="w-full"
            no-shadow
            size="large"
            variant="primary"
            @click="onCompletePurchase"
          />
        </div>
      </div>
      <div
        v-else
        class="flex justify-between px-6 py-4 flex-col h-full"
      >
        <div class="flex items-center flex-col pt-8">
          <img
            :src="emptyCartPlaceholder"
            alt="empty cart"
            width="140"
            class="mb-5"
          >
          <span class="font-bold mb-2">{{
            $t('shoppingCart.emptyCart.line1')
          }}</span>
          <span class="text-center mb-5">{{
            $t('shoppingCart.emptyCart.line2')
          }}</span>
          <NeoButton
            v-safe-href="`/${urlPrefix}/explore/items`"
            variant="outlined-rounded"
            :label="$t('shoppingCart.exploreNfts')"
            rounded
            no-shadow
            tag="a"
            icon="magnifying-glass"
          />
        </div>
        <div class="pt-4">
          <NeoButton
            :label="$t('shoppingCart.completePurchase')"
            disabled
            class="w-full"
            size="large"
            no-shadow
            variant="primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoModalHead } from '@kodadot1/brick'
import ShoppingCartItemRow from './ShoppingCartItemRow.vue'
import { totalPriceUsd } from './utils'
import { usePreferencesStore } from '@/stores/preferences'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { sum } from '@/utils/math'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { ModalCloseType } from '@/components/navbar/types'
import { doAfterCheckCurrentChainVM } from '@/components/common/ConnectWallet/openReconnectWalletModal'

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { urlPrefix } = usePrefix()
const { doAfterLogin } = useDoAfterlogin()
const { isDarkMode } = useTheme()

const emit = defineEmits(['close'])

const items = computed(() =>
  shoppingCartStore.getItemsByPrefix(urlPrefix.value),
)

const emptyCartPlaceholder = computed(() =>
  isDarkMode.value ? '/cart/empty-cart-dark.svg' : '/cart/empty-cart.svg',
)

const numberOfItems = computed(() => items.value.length)

const priceUSD = computed(() => {
  const { nfts, royalties } = totalPriceUsd(items.value)
  return (nfts + royalties).toFixed(1)
})

const isOpen = computed({
  get: () => prefrencesStore.getShoppingCartCollapse,
  set: value => prefrencesStore.setShoppingCartCollapse(value),
})

const clearAllItems = () => {
  shoppingCartStore.clear()
}

const sortedItems = computed(() =>
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  items.value.sort((a, b) => b.addedAt - a.addedAt),
)

const totalPrice = computed(() =>
  sum(sortedItems.value.map(nft => Number(nft.price))),
)

// properly close modal when being closed from outside,e.g. by changeing chain
watch(isOpen, (newValue, oldValue) => {
  if (newValue === false && oldValue === true) {
    emit('close')
  }
})

const closeShoppingCart = (
  type: ModalCloseType = ModalCloseType.NAVIGATION,
) => {
  emit('close', type)
  isOpen.value = false
  document.body.classList.remove('overflow-hidden')
}

const openCompletePurcahseModal = () => {
  doAfterCheckCurrentChainVM(() => {
    prefrencesStore.setCompletePurchaseModal({
      isOpen: true,
      mode: 'shopping-cart',
    })
  })
}

const onCompletePurchase = () => {
  closeShoppingCart()

  // fix: scroll clip mode not working
  setTimeout(() => {
    doAfterLogin({ onLoginSuccess: openCompletePurcahseModal })
  }, 100)
}
</script>

<style scoped>
@reference '@/assets/css/tailwind.css';

.shopping-cart-modal {
  .shopping-cart-modal-container {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    max-width: 360px;
    width: 100%;

    @apply bulma-mobile:max-w-[100vw] pt-navbar-desktop bulma-mobile:pt-navbar-mobile;
  }
}

.scroll-y {
  overflow-y: auto;
}
</style>
