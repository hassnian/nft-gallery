import type BN from 'bn.js'
import { formatBalance } from '@polkadot/util'
import type { Prefix } from '@kodadot1/static'

export const trimAll = (text?: string) => (text || '').replace(/\s/g, '')

function format(
  balance: number | string | BN | bigint,
  decimals = 12,
  withUnit?: boolean | string,
  withSi?: boolean,
) {
  try {
    const fixedBalance
      = typeof balance === 'number' ? balance.toFixed() : balance

    return formatBalance(fixedBalance, {
      decimals,
      withUnit,
      forceUnit: '-',
      withSi,
    })
  }
  catch (e: any) {
    return ''
  }
}

export function formatNumber(amount?: string | number): string {
  if (!amount) {
    return '0'
  }
  const number
    = typeof amount === 'number' ? amount : Number(withoutDigitSeparator(amount))

  let formattedNumber
  if (number >= 1000000) {
    formattedNumber = (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  else if (number >= 1000) {
    formattedNumber = (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  else if (number === 0) {
    formattedNumber = '0'
  }
  else if (number < 0.001) {
    formattedNumber = number.toFixed(4)
  }
  else if (number < 0.01) {
    formattedNumber = number.toFixed(3)
  }
  else if (number < 0.1) {
    formattedNumber = number.toFixed(2)
  }
  else {
    formattedNumber = number.toFixed(1).replace(/\.0$/, '')
  }
  return formattedNumber
}

export function calculateBalance(value: number, decimals = 12): number {
  return Math.trunc(value * Math.pow(10, decimals))
}
export function calculateBalanceUsdValue(
  value: number,
  decimals = 12,
  fractionDigits = 4,
): number {
  return parseFloat((value / Math.pow(10, decimals)).toFixed(fractionDigits))
}

export function checkInvalidBalanceFilter(value) {
  if (value === Infinity) {
    return '0'
  }
  return value
}

export function withoutDigitSeparator(value: string) {
  return value.replace(/,/g, '')
}

export function roundTo(value: number | string, limit = 2) {
  const number = Number(value.toString().replace(/,/g, ''))
  const hasDecimals = number % 1 !== 0
  const fractionDigits = hasDecimals ? limit : 0
  return number.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
  })
}

export const formatBalanceEmptyOnZero = (
  amount: string,
  decimals?: number,
  symbol?: string,
) => {
  return amount === '0'
    ? ''
    : trimAll(format(amount, decimals || 12, symbol || 'KSM'))
}

const roundAmount = (
  value: string,
  limit?: number,
  disableFilter?: boolean,
) => {
  const number = Number(value.replace(/,/g, ''))

  return disableFilter
    ? parseFloat(number.toString()).toLocaleString()
    : roundTo(value, limit)
}

export const formatAmountWithRound = (
  value: string | number | bigint,
  tokenDecimals: number,
  roundBy?: number | Prefix,
) => {
  let round: number | undefined
  let roundByPrefix = false

  if (typeof roundBy === 'string') {
    const prefix = roundBy as Prefix
    if (prefix && isEvm(prefix)) {
      roundByPrefix = true
      round = chainToPrecisionMap[prefixToChainMap[prefix]!]
    }
  }
  else {
    round = roundBy
  }

  return roundAmount(
    format(checkInvalidBalanceFilter(value), tokenDecimals, ''),
    round === 0 ? round : round || 4,
    roundByPrefix ? false : round === undefined,
  )
}

export default format
