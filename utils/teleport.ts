// Copyright 2017-2021 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Prefix } from '@kodadot1/static'
import * as paraspell from '@paraspell/sdk-pjs'
import { ApiFactory } from '@kodadot1/sub-api'
import { getChainEndpointByPrefix } from '@/utils/chain'
import type { TeleportParams } from '@/composables/useTeleport'

export enum Chain {
  KUSAMA = 'Kusama',
  ASSETHUBKUSAMA = 'AssetHubKusama',
  ASSETHUBPOLKADOT = 'AssetHubPolkadot',
  POLKADOT = 'Polkadot',
  BASE = 'Base',
}

export type TeleportChain = {
  prefix: Prefix
  chain: Chain
  name: string
}

export type TeleportTransition = {
  source: TeleportChain | null
  destination: TeleportChain
  amount: number
  amountFormatted: string
  amountUsd: string
  token: string
  txFees: number
}

export const allowedTransitions = {
  [Chain.KUSAMA]: [Chain.ASSETHUBKUSAMA],
  [Chain.ASSETHUBKUSAMA]: [Chain.KUSAMA],
  [Chain.POLKADOT]: [Chain.ASSETHUBPOLKADOT],
  [Chain.ASSETHUBPOLKADOT]: [Chain.POLKADOT],
}

export const chainToPrefixMap: Record<Chain, Prefix> = {
  [Chain.KUSAMA]: 'ksm',
  [Chain.ASSETHUBKUSAMA]: 'ahk',
  [Chain.ASSETHUBPOLKADOT]: 'ahp',
  [Chain.POLKADOT]: 'dot',
  [Chain.BASE]: 'base',
}

export const prefixToChainMap: Partial<Record<Prefix, Chain>> = {
  ksm: Chain.KUSAMA,
  ahk: Chain.ASSETHUBKUSAMA,
  ahp: Chain.ASSETHUBPOLKADOT,
  dot: Chain.POLKADOT,
  base: Chain.BASE,
}

const getApi = (chain: Chain) => {
  const endpoint = getChainEndpointByPrefix(chainToPrefixMap[chain]) as string
  return ApiFactory.useApiInstance(endpoint)
}

const getParaspellQuery = async ({
  amount,
  from,
  to,
  fromAddress,
  toAddress,
  currency,
}: {
  amount: number
  from: Chain
  to: Chain
  fromAddress: string
  toAddress: string
  currency: string
}) => {
  const api = await getApi(from)

  return paraspell
    .Builder(api)
    .from(Chain[from.toUpperCase()])
    .to(Chain[to.toUpperCase()])
    .currency({ symbol: currency, amount: amount })
    .senderAddress(fromAddress)
    .address(toAddress)
}

export const getTransaction = async ({
  amount,
  from,
  to,
  address,
  currency,
}: {
  amount: number
  from: Chain
  to: Chain
  address: string
  currency: string
}) => {
  const query = await getParaspellQuery({
    amount,
    from,
    to,
    fromAddress: address,
    toAddress: address,
    currency,
  })

  return query.build()
}

export const getTransactionFee = async ({
  amount,
  from,
  to,
  toAddress,
  fromAddress,
  currency,
}: TeleportParams) => {
  const query = await getParaspellQuery({
    amount,
    from,
    to,
    toAddress,
    fromAddress,
    currency,
  })

  const xcmFee = await query.getXcmFee()

  const totalFee = Number(xcmFee.origin?.fee || 0) + Number(xcmFee.destination.fee || 0)

  return totalFee
}

export type Currency = 'KSM' | 'DOT' | 'ETH'

export const getChainCurrency = (chain: Chain): Currency => {
  switch (chain) {
    case Chain.KUSAMA:
    case Chain.ASSETHUBKUSAMA:
      return 'KSM'
    case Chain.POLKADOT:
    case Chain.ASSETHUBPOLKADOT:
      return 'DOT'
  }
}

export const chainToPrecisionMap: Record<Chain, number> = {
  [Chain.KUSAMA]: 4,
  [Chain.ASSETHUBKUSAMA]: 6,
  [Chain.ASSETHUBPOLKADOT]: 5,
  [Chain.BASE]: 5,
  [Chain.POLKADOT]: 4,
}
