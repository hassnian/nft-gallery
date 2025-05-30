<template>
  <NeoModal
    :value="isModalActive"
    class="neo-modal"
    data-testid="on-ramp-modal"
    append-to-body
    :no-overlap="noOverlap"
    @close="onClose"
  >
    <ModalBody
      :title="$t('general.chooseProvider')"
      @close="onClose"
    >
      <div>
        <div class="mb-4 flex">
          <NeoCheckbox
            v-model="agreeTos"
            class="self-start pt-1"
          />
          <div>
            {{ $t('fiatOnRamp.agree') }}
            <a
              href="/terms-of-use"
              target="_blank"
              rel="nofollow noopener noreferrer"
              class="text-k-blue hover:text-k-blue-hover"
            >{{ $t('fiatOnRamp.tos') }}</a>
          </div>
        </div>
        <div
          v-for="(provider, index) in providers"
          :key="provider.value"
        >
          <div
            class="provider cursor-pointer flex justify-center items-start flex-col my-4"
            :class="{
              provider__disabled: provider.disabled || !agreeTos,
            }"
            @click="onSelect(provider.value)"
          >
            <div class="flex justify-center">
              <img
                :alt="`${provider.value} provider logo`"
                :src="provider.image"
                class="provider-logo"
              >
              <p
                v-if="provider.disabled"
                class="ml-2 text-xs text-k-grey"
              >
                {{ $t('soon') }}
              </p>
            </div>

            <div class="mt-4 flex items-center justify-between w-full">
              <div class="text-xs text-k-grey">
                {{ $t('general.supports') }}
              </div>

              <div class="text-xs text-k-grey">
                {{ getSupportedTokensToText(provider.supports[vm]) }}
              </div>
            </div>
          </div>

          <hr
            v-if="index !== providers.length - 1"
            class="my-0"
          >
        </div>
      </div>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoCheckbox, NeoModal } from '@kodadot1/brick'
import type { ChainVM } from '@kodadot1/static'
import ModalBody from '@/components/shared/modals/ModalBody.vue'

enum Provider {
  TRANSAK,
  RAMP,
}

const emit = defineEmits(['close'])
const props = defineProps<{
  modelValue: boolean
  noOverlap?: boolean
}>()

const { accountId } = useAuth()
const { $i18n } = useNuxtApp()

const isModalActive = useVModel(props, 'modelValue')
const agreeTos = ref<boolean>(false)

const { vm } = useChain()
const { init: initTransak } = useTransak()
const { init: initRamp } = useRamp()

const { isDarkMode } = useTheme()

const getImage = (service: string) => {
  return `/onramp-providers/${service}-logo${
    isDarkMode.value ? '-dark' : ''
  }.svg`
}

const getSupportedTokensToText = (tokens: string[]) =>
  tokens.map(token => `$${token}`).join(', ')

const PROVIDER_TOKEN_SUPPORTS = {
  SUB: ['DOT', 'KSM'],
  EVM: ['ETH'],
}

const providers = computed<{ image: string, disabled: boolean, supports: Record<ChainVM, string[]>, value: Provider }[]>(() => [
  {
    image: getImage('transak'),
    disabled: false,
    supports: PROVIDER_TOKEN_SUPPORTS,
    value: Provider.TRANSAK,
  },
  {
    image: getImage('ramp'),
    disabled: false,
    supports: PROVIDER_TOKEN_SUPPORTS,
    value: Provider.RAMP,
  },
])

const onClose = () => {
  emit('close')
}

const onSelect = (provider: Provider) => {
  const selectedProvider = providers.value.find(p => p.value === provider)

  if (selectedProvider?.disabled || !agreeTos.value) {
    return
  }

  onClose()

  switch (selectedProvider?.value) {
    case Provider.TRANSAK:
      transakInit()
      break
    case Provider.RAMP:
      rampInit()
      break
    default:
      break
  }
}

const rampInit = () => {
  initRamp({
    address: accountId.value,
    onSuccess,
  })
}

const transakInit = () => {
  initTransak({
    address: accountId.value,
    onSuccess,
  })
}

const onSuccess = () => {
  successMessage($i18n.t('general.successfullyAddedFunds'))
}
</script>

<style scoped>
.provider {
  .provider-logo {
    width: 122px;
  }

  &__disabled {
    cursor: default;
    .provider-logo {
      opacity: 30%;
    }
  }
}
</style>
