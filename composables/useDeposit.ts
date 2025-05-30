import type { ComputedRef } from 'vue'

import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS, type Prefix } from '@kodadot1/static'
import { balanceOf } from '@kodadot1/sub-api'
import format from '@/utils/format/balance'
import { chainPropListOf } from '@/utils/config/chain.config'

export default function (prefix: ComputedRef<Prefix>) {
  const { apiInstanceByPrefix } = useApi()
  const { accountId } = useAuth()
  const { isAssetHub } = useIsChain(prefix)

  const balance = ref()

  const collectionDeposit = ref(0)
  const itemDeposit = ref(0)
  const metadataDeposit = ref(0)
  const existentialDeposit = ref(0)
  const attributeDeposit = ref(0)

  const totalCollectionDeposit = ref('0')
  const totalItemDeposit = ref('0')

  const chainSymbol = ref('')

  const chain = computed(() =>
    chainPropListOf(chainSymbol.value.toLowerCase() as Prefix),
  )

  const isEnabled = computed(() => prefix.value && isSub(prefix.value))

  watchEffect(async () => {
    if (isEnabled.value) {
      const api = await apiInstanceByPrefix(prefix.value)
      const chain = CHAINS[prefix.value]

      // set deposit amount
      existentialDeposit.value
        = api.consts.balances.existentialDeposit.toNumber()

      if (isAssetHub.value) {
        collectionDeposit.value = api.consts.nfts.collectionDeposit.toNumber()
        itemDeposit.value = api.consts.nfts.itemDeposit.toNumber()
        metadataDeposit.value = api.consts.nfts.metadataDepositBase.toNumber()
        attributeDeposit.value = api.consts.nfts.attributeDepositBase.toNumber()
      }

      totalCollectionDeposit.value = format(
        metadataDeposit.value
        + collectionDeposit.value
        + existentialDeposit.value,
        chain.tokenDecimals,
        false,
      )
      totalItemDeposit.value = format(
        metadataDeposit.value + itemDeposit.value + existentialDeposit.value,
        chain.tokenDecimals,
        false,
      )
    }
  })

  watchEffect(async () => {
    if (isEnabled.value) {
      const api = await apiInstanceByPrefix(prefix.value)

      // get chain symbol and decimals
      const chainInfo = await api.registry.getChainProperties()
      chainSymbol.value = chainInfo?.tokenSymbol.toHuman()?.[0]

      // set balance
      if (accountId.value) {
        const chain = CHAINS[prefix.value]
        const publicKey = decodeAddress(accountId.value)
        const prefixAddress = encodeAddress(publicKey, chain.ss58Format)

        balance.value = await balanceOf(api, prefixAddress)

        balance.value = format(balance.value, chain.tokenDecimals, false)
      }
    }
  })

  return {
    balance,
    collectionDeposit,
    itemDeposit,
    attributeDeposit,
    metadataDeposit,
    existentialDeposit,
    totalCollectionDeposit,
    totalItemDeposit,
    chainSymbol,
    chain,
  }
}
