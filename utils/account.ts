import keyring from '@polkadot/ui-keyring'
import {
  addressEq,
  addressToEvm,
  decodeAddress,
  encodeAddress,
  isEthereumAddress,
} from '@polkadot/util-crypto'
import { u8aToHex } from '@polkadot/util'

import type { Prefix } from '@polkadot/util-crypto/address/types'
import { ss58Of } from './config/chain.config'
import { getAddress } from '@/utils/extension'
import type { KeyringAccount } from '@/utils/types/types'
import { useChainStore } from '@/stores/chain'

export const isAccountLocked = (account: KeyringAccount | string): boolean => {
  const address = typeof account === 'string' ? account : account.address
  // DEV: Account return true when address is not available
  if (keyring.isAvailable(address)) {
    return false
  }

  const pair = keyring.getPair(address)
  return pair.isLocked
}

const passwordRequired = async (account: KeyringAccount | string) => {
  const address = typeof account === 'string' ? account : account.address
  const extensionAccount = await getAddress(address)
  if (!extensionAccount) {
    return false
  }

  return isAccountLocked(address)
}

const accountToAddress = (account: KeyringAccount | string) =>
  typeof account === 'string' ? account : account.address

export const toDefaultAddress = (account: KeyringAccount | string) => {
  const address = accountToAddress(account)
  if (/^5/.test(address)) {
    return address
  }

  const chainStore = useChainStore()
  const ss58Format = chainStore.getChainProperties58Format

  return encodeAddress(decodeAddress(address, <any>ss58Format))
}

export const formatAddress = (address: string, ss58Format: number) =>
  encodeAddress(address, ss58Format)

export const pubKeyToAddress = (publicKey: string) => {
  const chainStore = useChainStore()
  const ss58Format = chainStore.getChainProperties58Format
  return encodeAddress(publicKey, <any>ss58Format)
}

export const formatAccount = (
  account: KeyringAccount | string,
  format?: Prefix,
) => {
  const address = accountToAddress(account)
  const chainStore = useChainStore()
  const ss58Format = format ? format : chainStore.getChainProperties58Format
  return encodeAddress(decodeAddress(address), <any>ss58Format)
}

const isSameAddressSubstrate = (address1: string, address2: string): boolean => {
  return addressEq(address1, address2)
}

const isSameAddressEvm = (address1: string, address2: string): boolean => {
  return address1.toLowerCase() === address2.toLowerCase()
}

export const isSameAccount = (
  account1: KeyringAccount | string,
  account2: KeyringAccount | string,
): boolean => {
  const address1 = accountToAddress(account1)
  const address2 = accountToAddress(account2)

  return isEthereumAddress(address1)
    ? isSameAddressEvm(address1, address2)
    : isSameAddressSubstrate(address1, address2)
}

export const accountsAreSame = (
  account1?: KeyringAccount | string,
  account2?: KeyringAccount | string,
): boolean => {
  return Boolean(account1 && account2 && isSameAccount(account1, account2))
}

export const accountToEvm = (account: KeyringAccount | string): string => {
  const address = accountToAddress(account)
  return addressToEvm(address)?.toString()
}

export const getss58AddressByPrefix = (address: string, prefix: string) => {
  if (isEthereumAddress(address)) {
    return address
  }
  const ss58Format = ss58Of(prefix)
  const decodedAddress = decodeAddress(address)
  return encodeAddress(decodedAddress, ss58Format)
}

export function accountToPublicKey(account: string): `0x${string}` {
  const decoded = decodeAddress(account)
  return u8aToHex(decoded)
}

export const isValidSubstrateAddress = (address: string): boolean => {
  try {
    encodeAddress(decodeAddress(address))
    return true
  }
  catch (error) {
    return false
  }
}

export default passwordRequired
