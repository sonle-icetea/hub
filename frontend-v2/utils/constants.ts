export enum TOKEN_TYPE {
    ERC721 = 'erc721',
    ERC20 = 'erc20',
    Box = 'box',
}

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
export const PANCAKE_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_PANCAKE_GAFI_SWAP_URL
export const KUCOIN_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_KUCOIN_GAFI_SWAP_URL
export const GATE_GAFI_SWAP_URL = process.env.NEXT_PUBLIC_GATE_GAFI_SWAP_URL
export const API_BASE_URL = 'https://test-user.gamefi.org/api/v1' || process.env.NEXT_PUBLIC_BASE_URL

export const CLAIM_TYPE = {
  0: 'On GameFi.org',
  1: 'Airdrop',
  2: 'External Website',
  3: 'TBA'
}
