export const ENVS = {
  development: 'development',
  production: 'production'
}
const ENV_DEV = ENVS.development
const ENV_PROD = ENVS.production

export const CUR_ENV = process.env.VUE_APP_PLATON_ENV

const NET_NAMES = {
  [ENV_DEV]: 'TestNet',
  [ENV_PROD]: 'MainNet'
}
export const NET_NAME = NET_NAMES[CUR_ENV]

const CHAIN_IDS = {
  [ENV_DEV]: 2206132,
  [ENV_PROD]: 210425
}
export const CHAIN_ID = CHAIN_IDS[CUR_ENV]

const STAKEMANAGER_ADDRS = {
  [ENV_DEV]: '0x2B94BE0B0f275bcf38d25D51AF08C1b7A5Eb81d2',
  [ENV_PROD]: '0xBcad5dE91De1845Fe95812C206ED01d21fF7393F'
}

export const STAKEMANAGER_ADDR = STAKEMANAGER_ADDRS[CUR_ENV]

const HSKTOKEN_ADDRS = {
  [ENV_DEV]: '0xCD0a4a63Bb6CB1c41376466BB214D30306F16727',
  [ENV_PROD]: '0xCD0a4a63Bb6CB1c41376466BB214D30306F16727'
}

export const HSKTOKEN_ADDR = HSKTOKEN_ADDRS[CUR_ENV]

const RPC_URLS = {
  [ENV_DEV]: 'https://devnetopenapi2.platon.network/rpc',
  [ENV_PROD]: 'https://samurai.platon.network'
}
export const RPC_URL = RPC_URLS[CUR_ENV]

const BASE_BSC_SCAN_URLS = {
  [ENV_DEV]: 'https://devnetscan.platon.network',
  [ENV_PROD]: 'https://scan.platon.network'
}
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[CUR_ENV]
