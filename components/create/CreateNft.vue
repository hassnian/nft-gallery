<template>
  <div
    class="lg:py-[4.5rem] flex flex-col md:flex-row justify-center gap-3 lg:bg-k-primary-light"
  >
    <SigningModal
      v-if="!autoTeleport"
      :is-loading="isLoading"
      :title="$t('mint.nft.minting')"
      :status="status"
      @try-again="createNft"
    />

    <MintConfirmModal
      v-model="modalShowStatus"
      :auto-teleport-actions="autoTeleportActions"
      :nft-information="nftInformation"
      @confirm="confirm"
    />

    <form
      ref="formRef"
      class="px-[1.2rem] md:px-8 lg:px-16 py-[3.1rem] sm:py-16 w-full sm:w-1/2 max-w-[40rem] shadow-none lg:shadow-primary lg:border-[1px] lg:border-border-color lg:bg-background-color"
    >
      <CreateNftPreview
        :name="form.name"
        :collection="selectedCollection?.name"
        :price="form.salePrice"
        :symbol="chainSymbol"
        :chain="currentChain"
        :image="imagePreview || ''"
        data-testid="create-nft-preview-box"
      />

      <h1 class="title text-3xl mb-7">
        {{ $t('mint.nft.create') }}
      </h1>

      <!-- nft art -->
      <NeoField
        :label="`${$t('mint.nft.art.label')} *`"
        :addons="false"
      >
        <div>
          <p>{{ $t('mint.nft.art.message') }}</p>
          <DropUpload
            v-model="form.file"
            required
            expanded
            preview
            :label="$t('mint.nft.drop')"
          />
        </div>
      </NeoField>

      <!-- nft name -->
      <NeoField
        :label="`${$t('mint.nft.name.label')} *`"
        required
        :error="!form.name"
      >
        <NeoInput
          v-model="form.name"
          data-testid="create-nft-input-name"
          required
          :placeholder="$t('mint.nft.name.placeholder')"
        />
      </NeoField>

      <!-- nft description -->
      <NeoField :label="`${$t('mint.nft.description.label')} (optional)`">
        <NeoInput
          v-model="form.description"
          data-testid="create-nft-input-description"
          type="textarea"
          has-counter
          maxlength="1000"
          height="10rem"
          :placeholder="$t('mint.nft.description.placeholder')"
        />
      </NeoField>

      <!-- select blockchain -->
      <NeoField :label="`${$t('mint.blockchain.label')} *`">
        <div class="w-full">
          <p>{{ $t('mint.blockchain.message') }}</p>
          <NeoSelect
            v-model="selectChain"
            class="mt-3"
            data-testid="create-nft-dropdown-select"
            expanded
            required
          >
            <option
              v-for="menu in menus"
              :key="menu.value"
              :value="menu.value"
              :data-testid="`nft-chain-dropdown-option-${menu.value}`"
            >
              {{ menu.text }}
            </option>
          </NeoSelect>
        </div>
      </NeoField>

      <!-- list for sale -->
      <NeoField
        :key="currentChain"
        :label="$t('mint.nft.sale.label')"
        required
      >
        <div class="w-full">
          <p>{{ $t('mint.nft.sale.message') }}</p>
        </div>
        <NeoSwitch
          v-model="form.sale"
          data-testid="create-nft-sale-switch"
        />
      </NeoField>
      <!-- list for sale price -->
      <NeoField
        v-if="form.sale"
        required
        :error="!form.salePrice"
        :label="`${$t('price')} *`"
      >
        <div class="w-full">
          <div class="flex justify-between items-center relative">
            <NeoInput
              v-model="form.salePrice"
              data-testid="create-nft-input-list-value"
              type="number"
              step="0.01"
              min="0.01"
              pattern="[0-9]+([\.,][0-9]+)?"
              placeholder="0.01 is the minimum"
              expanded
            />
            <div class="position-absolute-right text-xs text-k-grey">
              ~{{ salePriceUsd }} usd
            </div>
            <div class="form-addons">
              {{ chainSymbol }}
            </div>
          </div>
        </div>
      </NeoField>

      <!-- select collections -->
      <NeoField
        ref="chooseCollectionRef"
        :label="`${$t('mint.nft.collection.label')} *`"
        @click="startSelectedCollection = true"
      >
        <div class="w-full">
          <p
            :class="{
              'text-k-red': startSelectedCollection && !selectedCollection,
            }"
          >
            {{ $t('mint.nft.collection.message') }}
          </p>
          <ChooseCollectionDropdown
            full-width
            no-shadow
            class="mt-3"
            :preselected="preselectedCollectionId"
            @selected-collection="onCollectionSelected"
          />
        </div>
      </NeoField>

      <!-- no of copies -->
      <NeoField :label="`${$t('mint.nft.copies.label')} (optional)`">
        <div class="w-full">
          <p>{{ $t('mint.nft.copies.message') }}</p>
          <NeoInput
            v-model="form.copies"
            data-testid="create-nft-input-copies"
            class="mt-3"
            type="number"
            placeholder="e.g 10"
            min="1"
            expanded
          />
          <BasicSwitch
            v-if="form.copies > 1"
            v-model="form.postfix"
            data-testid="create-nft-input-copies-switch"
            class="mt-3"
            label="mint.expert.postfix"
          />
        </div>
      </NeoField>

      <!-- nft properties -->
      <NeoField :label="`${$t('tabs.properties')} (optional)`">
        <CustomAttributeInput
          v-model="form.tags"
          :max="10"
          data-testid="create-nft-properties"
        />
      </NeoField>

      <!-- royalty -->
      <NeoField>
        <RoyaltyForm
          v-model:amount="form.royalty.amount"
          v-model:address="form.royalty.address"
          data-testid="create-nft-royalty"
        />
      </NeoField>

      <!-- explicit content -->
      <NeoField :label="`${$t('mint.nfsw')}`">
        <div class="w-full">
          <p>{{ $t('mint.nfswMessage') }}</p>
        </div>
        <NeoSwitch
          v-model="form.nsfw"
          data-testid="create-nft-nsfw-switch"
        />
      </NeoField>

      <hr class="my-6">

      <!-- deposit and balance -->
      <div>
        <div class="flex font-medium text-k-blue hover:text-k-blue-hover">
          <div>{{ $t('mint.deposit') }}:&nbsp;</div>
          <div>
            <span data-testid="create-nft-deposit-amount-token">
              {{ deposit }} {{ chainSymbol }}
            </span>
            <span
              class="text-xs text-k-grey ml-2"
              data-testid="create-nft-deposit-amount-usd"
            >
              {{ depositUsd }} usd
            </span>
          </div>
        </div>
        <div class="flex">
          <div>{{ $t('general.balance') }}:&nbsp;</div>
          <div>
            <span>{{ balance }} {{ chainSymbol }}</span>
            <span class="text-xs text-k-grey ml-2"> {{ balanceUsd }} usd </span>
          </div>
        </div>
      </div>

      <hr class="my-6">

      <!-- create nft button -->
      <NeoButton
        expanded
        :label="submitButtonLabel"
        data-testid="create-nft-button-new"
        class="text-base"
        size="medium"
        :loading="isLoading"
        @click="submitHandler"
      />
      <div class="p-4 flex">
        <KIcon
          name="i-mdi:information-slab-circle-outline"
          size="medium"
          class="mr-4"
        />
        <p class="text-xs">
          <span
            v-dompurify-html="
              $t('mint.requiredDeposit', [`${deposit} ${chainSymbol}`, 'NFT'])
            "
          />
          <a
            href="https://hello.kodadot.xyz/information/fees"
            target="_blank"
            class="text-k-blue hover:text-k-blue-hover"
            data-testid="create-nft-learn-more-link"
            rel="nofollow noopener noreferrer"
          >
            {{ $t('helper.learnMore') }}
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import {
  NeoButton,
  NeoField,
  NeoInput,
  NeoSelect,
  NeoSwitch,
} from '@kodadot1/brick'
import CreateNftPreview from './CreateNftPreview.vue'
import { toNFTId } from '@/utils/nft'
import { Interaction } from '@/utils/shoppingActions'
import type { ActionMintToken, ActionList, TokenToList } from '@/composables/transaction/types'
import ChooseCollectionDropdown from '@/components/common/ChooseCollectionDropdown.vue'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import CustomAttributeInput from '@/components/create/CustomAttributeInput.vue'
import RoyaltyForm from '@/components/create/RoyaltyForm.vue'
import MintConfirmModal from '@/components/create/Confirm/MintConfirmModal.vue'
import { availablePrefixes } from '@/utils/chain'
import { balanceFrom } from '@/utils/balance'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import { delay } from '@/utils/fetch'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import type { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import nftByBlockNumber from '@/queries/subsquid/general/nftByBlockNumber'
// composables
const { $consola, $i18n } = useNuxtApp()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { accountId } = useAuth()
const { transaction, status, isLoading, blockNumber, isError }
  = useTransaction()
const router = useRouter()
const { decimals } = useChain()
const { toUsdPrice } = useUsdValue()
const { doAfterLogin } = useDoAfterlogin()
const { isLogIn } = useAuth()
// form state
const form = reactive({
  file: null,
  name: '',
  description: '',
  collections: null,
  sale: false,
  salePrice: 0,
  copies: 1,
  postfix: false,
  nsfw: false,
  tags: [],
  royalty: {
    amount: 0,
    address: accountId.value,
  },
})

// select collections
const { selectedCollection, preselectedCollectionId, onCollectionSelected }
  = useCollectionDropdown()
const startSelectedCollection = ref<boolean>(false)
const chooseCollectionRef = ref()
const formRef = ref<HTMLFormElement>()
const modalShowStatus = ref(false)

const nftInformation = computed(() => ({
  file: form.file,
  name: form.name,
  selectedCollection: selectedCollection.value,
  price: balanceFrom(form.salePrice, decimals.value),
  listForSale: form.sale,
  paidToken: chain.value,
  mintType: CreateComponent.NFT,
}))

const imagePreview = computed(() => {
  if (form.file) {
    return URL?.createObjectURL(form.file)
  }

  return null
})

// select available blockchain
const menus = availablePrefixes().filter(
  (menu) => {
    const { isEvm } = useIsChain(computed(() => menu.value as Prefix))
    return !isEvm.value
  })

const chainByPrefix = computed(() =>
  menus.find(menu => menu.value === urlPrefix.value),
)
const selectChain = ref(chainByPrefix.value?.value || menus[0].value)

watch(urlPrefix, (value) => {
  selectChain.value = value
})

// get/set current chain/prefix
const currentChain = computed(() => selectChain.value as Prefix)
watch(currentChain, () => {
  // reset some state on chain change
  form.salePrice = 0
  form.royalty.amount = 0

  if (currentChain.value !== urlPrefix.value) {
    setUrlPrefix(currentChain.value as Prefix)
  }
})

// deposit stuff
const { balance, totalItemDeposit, chainSymbol, chain }
  = useDeposit(currentChain)

const deposit = computed(() =>
  (Number(totalItemDeposit.value) * form.copies).toFixed(4),
)

// usd value

// when left undefined urlPrefix will be used
// TODO: evaluate better
const tokenType = computed(() => undefined)

const calculateUsdValue = (amount) => {
  // remove comma from amount - required because bsx balance is formatted string
  const parsedAmount = parseFloat(amount?.replace(/,/g, '') || '0')
  return toUsdPrice(parsedAmount, tokenType.value)
}

const salePriceUsd = computed(() => toUsdPrice(form.salePrice, tokenType.value))
const depositUsd = computed(() => calculateUsdValue(deposit.value))
const balanceUsd = computed(() => calculateUsdValue(balance.value))

// create nft
const transactionStatus = ref<
  'list' | 'checkListed' | 'mint' | 'done' | 'idle'
>('idle')
const createdItems = ref()
const mintedBlockNumber = ref()

const mintAction = computed<ActionMintToken>(() => ({
  interaction: Interaction.MINTNFT,
  urlPrefix: currentChain.value,
  token: {
    file: form.file,
    name: form.name,
    description: form.description,
    selectedCollection: selectedCollection.value || null,
    copies: form.copies,
    nsfw: form.nsfw,
    postfix: form.postfix,
    price: balanceFrom(form.salePrice, decimals.value),
    tags: form.tags,
    secondFile: null,
    hasRoyalty: Boolean(form.royalty.amount),
    royalty: form.royalty,
  },
}))

const listAction = computed<ActionList>(() => {
  const list: TokenToList[] = createdItems.value?.map(nft => ({
    price: balanceFrom(form.salePrice, decimals.value),
    nftId: toNFTId(nft, String(blockNumber.value)),
  }))

  return {
    interaction: Interaction.LIST,
    urlPrefix: currentChain.value,
    token: list,
    successMessage: `[💰] Listed ${form.name} for ${form.salePrice} ${chainSymbol.value}`,
  }
})

const submitButtonLabel = computed(() =>
  $i18n.t(isLogIn.value ? 'mint.nft.create' : 'mint.nft.connect'),
)

const submitHandler = () => {
  doAfterLogin({
    onLoginSuccess: () => {
      if (formRef.value && !formRef.value.checkValidity()) {
        formRef.value.reportValidity()
        return
      }

      startSelectedCollection.value = true
      if (selectedCollection.value) {
        toggleConfirm()
      }
      else {
        ;(chooseCollectionRef.value?.$el as HTMLElement)?.scrollIntoView({
          block: 'center',
        })
      }
    },
  })
}

const toggleConfirm = () => {
  modalShowStatus.value = !modalShowStatus.value
}

const confirm = async ({
  autoteleport,
}: AutoTeleportActionButtonConfirmEvent) => {
  toggleConfirm()

  autoTeleport.value = autoteleport

  if (!autoteleport) {
    await createNft()
  }
}

const createNft = async () => {
  try {
    await transaction(
      mintAction.value,
      currentChain.value,
    )

    transactionStatus.value = 'mint'
  }
  catch (error) {
    warningMessage(`${error}`)
    $consola.error(error)
  }
}

// autoteleport stuff
const autoTeleport = ref(false)
const {
  transaction: listTransaction,
  status: listStatus,
} = useTransaction()

const autoTeleportActions = computed<AutoTeleportAction[]>(() => {
  const actions = [
    {
      action: mintAction.value,
      handler: createNft,
      prefix: currentChain.value,
      details: {
        isLoading: isLoading.value,
        isError: isError.value,
        status: status.value,
        blockNumber: blockNumber.value,
      },
    },
  ]

  return actions
})

// currently, on rmrk we need to list price manually
const listNft = async () => {
  try {
    await listTransaction(listAction.value, currentChain.value)

    transactionStatus.value = 'checkListed'
  }
  catch (error) {
    warningMessage(`${error}`)
    $consola.error(error)
  }
}

watchEffect(async () => {
  if (
    blockNumber.value
    && createdItems.value
    && transactionStatus.value === 'list'
  ) {
    await listNft()
  }
})

watchEffect(() => {
  const listStatusFinalized = listStatus.value === 'loader.finalized'
  const mintStatusFinalized = status.value === 'loader.finalized'

  // prepare nft blockNumber for redirect to detail page
  if (
    (transactionStatus.value === 'mint'
      || transactionStatus.value === 'list')
      && mintStatusFinalized
      && blockNumber.value
  ) {
    mintedBlockNumber.value = blockNumber.value
    transactionStatus.value = 'done'
  }

  // if listing price is done, then redirect to detail page
  if (transactionStatus.value === 'checkListed' && listStatusFinalized) {
    transactionStatus.value = 'done'
  }
})

// navigate to gallery detail page after success create nft
const retry = ref(10) // max retry 10 times

const { $apolloClient } = useNuxtApp()
async function getNftId() {
  try {
    const result = await $apolloClient.query({
      query: nftByBlockNumber,
      variables: {
        limit: 1,
        blockNumber: mintedBlockNumber.value,
      },
      context: {
        endpoint: currentChain.value,
      },
    })

    if (!result.data?.nftEntities?.length) {
      $consola.warn('No NFT found for the given block number')
      return null
    }

    return result.data?.nftEntities[0].id
  }
  catch (error) {
    $consola.error('Failed to fetch NFT ID:', error)
    return null
  }
}

watchEffect(async () => {
  if (
    mintedBlockNumber.value
    && retry.value
    && transactionStatus.value === 'done'
  ) {
    infoMessage(
      $i18n.t('mint.nft.redirect', [DETAIL_TIMEOUT / 1000]),
      { duration: DETAIL_TIMEOUT },
    )

    await delay(DETAIL_TIMEOUT)
    const nftId = await getNftId()

    if (nftId) {
      router.push(`/${urlPrefix.value}/gallery/${nftId}`)
    }
    else {
      retry.value -= 1
    }
  }
})
</script>

<style lang="scss" scoped src="@/assets/styles/pages/create.scss"></style>

<style lang="scss" scoped>
.position-absolute-right {
  position: absolute;
  right: 6rem;
}
</style>
