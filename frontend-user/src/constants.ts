export const TRANSACTION_ERROR = 'Transaction failed. Please check blockchain to know more error.';
export const API_URL_PREFIX = 'user';
export const ADMIN_URL_PREFIX = 'dashboard';
export const IMAGE_URL_PREFIX = 'image';
export const MAX_BUY_CAMPAIGN = 1000;
export const WHITELIST_LINK = 'https://forms.gle/HiQkhaRM8mujeryq8';
export const INSTRUCTION_WHITELIST_LINK = 'https://medium.com/polkafoundry/nftify-whitelist-on-red-kite-launchpad-on-june-4-2021-26cd4b8ebc8d';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const NFT_PLUS_AMOUNT_PRODUCTION = process.env.NFT_PLUS_AMOUNT_PRODUCTION || '0';
export const POOL_STATUS = {
  TBA: 0,
  UPCOMING: 1,
  JOINING: 2,
  IN_PROGRESS: 3,
  FILLED: 4,
  CLOSED: 5,
  CLAIMABLE: 6
};
export const POOL_STATUS_TEXT = {
  [POOL_STATUS.TBA]: 'TBA',
  [POOL_STATUS.UPCOMING]: 'Upcoming',
  [POOL_STATUS.FILLED]: 'Filled',
  [POOL_STATUS.IN_PROGRESS]: 'Swap',
  [POOL_STATUS.CLAIMABLE]: 'Claimable',
  [POOL_STATUS.CLOSED]: 'Ended',
};

export const NETWORK = {
  ETHEREUM: 'eth',
  BSC: 'bsc',
  POLYGON: 'polygon'
};

export const ACCEPT_CURRENCY = {
  ETH: 'eth',
  USDT: 'usdt',
  USDC: 'usdc',
};

export const BUY_TYPE = {
  WHITELIST_LOTTERY: 'whitelist',
  FCFS: 'fcfs',
};

export const POOL_TYPE = {
  SWAP: 'swap',
  CLAIMABLE: 'claimable',
};

export const PUBLIC_WINNER_STATUS = {
  PUBLIC: 1,
  PRIVATE: 0,
};
export const POOL_IS_PRIVATE = {
  PUBLIC: 0,
  PRIVATE: 1,
  SEED: 2,
  COMMUNITY: 3,
};

export const PICK_WINNER_RULE = {
  RULE_NORMAL: 'rule-normal',
  RULE_WITH_WEIGHT_RATE: 'rule-with-weight-rate',
  RULE_LUCKY_DOVE: 'rule-lucky-dove', // extend from RULE_WITH_WEIGHT_RATE
};

export const USER_STATUS = {
  UNVERIFIED: 0,
  ACTIVE: 1,
  BLOCKED: 2,
  DELETED: 3
};

export const TOKEN_STAKE_SYMBOLS = {
  PKF: 'PKF',
  LP_PKF: 'LP-PKF',
  EPKF: 'Red Kite Point (KSM)',
  SPKF: 'sPKF',
};

export const TOKEN_STAKE_NAMES = {
  PKF: 'PKF',
  LP_PKF: 'PKF-ETH LP',
  EPKF: 'ePKF',
  SPKF: 'sPKF',
};

export const CONVERSION_RATE = [
  {
    name: TOKEN_STAKE_NAMES.LP_PKF,
    rate: 150,
    symbol: TOKEN_STAKE_SYMBOLS.LP_PKF,
    address: process.env.REACT_APP_UNI_LP,
    key: 'UPKF',
    keyMainnet: 'UNI-V2'
  },
  // {
  //   name: 'Staked sPKF',
  //   rate: 1,
  //   symbol: 'sPKF',
  //   address: process.env.REACT_APP_MANTRA_LP,
  //   key: 'sPKF',
  //   keyMainnet: 'sPKF'
  // },
  {
    name: 'Red Kite Point (KSM)',
    rate: 1,
    symbol: TOKEN_STAKE_SYMBOLS.EPKF,
    address: process.env.REACT_APP_MANTRA_LP,
    key: 'ePKF',
    keyMainnet: 'ePKF'
  },
  // {
  //   name: 'NFT',
  //   rate: 100
  // },
]

const tiers = ['Start',  'Rookie', 'Elite', 'Pro', 'Legend']

export const TIERS = [
  {
    name: tiers[0],
    icon: '/images/tiers/starster.png',
    // icon: '/images/icons/rocket.svg',
    bg: '/images/icons/red-kite-bg.png',
    bgColor: '#B8B8FF',
  },
  {
    name: tiers[1],
    bg: '/images/icons/hawk-bg.png',
    bgColor: '#8181D8',
    icon: '/images/tiers/rookie.png'
  },
  {
    name: tiers[2],
    bg: '/images/icons/falcon-bg.png',
    bgColor: '#6F44E9',
    icon: '/images/tiers/elite.png'
  },
  {
    name: tiers[3],
    bg: '/images/icons/eagle-bg.png',
    bgColor: '#4646FF',
    icon: '/images/tiers/pro.png'
  },
  {
    name: tiers[4],
    bg: '/images/icons/phoenix-bg.png',
    bgColor: '',
    icon: '/images/tiers/master.png'
  }
];

export const TIER_LEVELS = {
  NONE: 0,
  [tiers[1].toUpperCase()]: 1,
  [tiers[2].toUpperCase()]: 2,
  [tiers[3].toUpperCase()]: 3,
  [tiers[4].toUpperCase()]: 4,
};

export const TIER_NAMES = {
  0: '--',
  1: tiers[1],
  2: tiers[2],
  3: tiers[3],
  4: tiers[4],
};

export const KYC_STATUS = {
  INCOMPLETE: 0, // Blockpass verifications pending
  APPROVED: 1, // profile has been approved by Merchant
  RESUBMIT: 2, // Merchant has rejected one or more attributes
  WAITING: 3, // Merchant's review pending
  INREVIEW: 4, // in review by Merchant
};

export const GAS_LIMIT_CONFIGS = {
  APPROVE: '80000',  // 46483
  DEPOSIT: '250000',  // 195057
  CLAIM: '120000', // 81901
  APPROVE_SOTA_TOKEN: '200000',
  STAKE_SOTA_TIERS: '120000', // 79021
  UNSTAKE_SOTA_TIERS: '100000', // 72527
};

export const NETWORK_AVAILABLE = {
  ETH: 'eth',
  BSC: 'bsc',
  POLYGON: 'polygon'
};

export const ETHERSCAN_BASE_URL: any = {
  '1': 'https://etherscan.io',
  '4': 'https://rinkeby.etherscan.io',
  '5': 'https://goerli.etherscan.io',
  '56': 'https://bscscan.com',
  '97': 'https://testnet.bscscan.com',
  '137': 'https://polygonscan.com',
  '80001': 'https://mumbai.polygonscan.com/',
};

export const NULL_AMOUNT = 'N/A';
export const POOL_STATUS_JOINED = {  // Pool Status for User Joined Pool (Version 3)
  NONE: 'NONE',
  APPLIED_WHITELIST: 'APPLIED_WHITELIST',
  WIN_WHITELIST: 'WIN_WHITELIST',
  NOT_WIN_WHITELIST: 'NOT_WIN_WHITELIST',
  CANCELED_WHITELIST: 'CANCELED_WHITELIST',
  SWAPPING: 'SWAPPING',
  CLAIMABLE: 'CLAIMABLE',
  COMPLETED: 'COMPLETED',
};

export enum TOKEN_TYPE {
  ERC721 = 'erc721',
  ERC20 = 'erc20',
  Box = 'box',
}

export const RECAPTCHA_SITE_KEY  = process.env.REACT_APP_RECAPTCHA_SITE_KEY as string;
export const ALLOW_RECAPCHA = !!RECAPTCHA_SITE_KEY;
// export const LINK_SWAP_TOKEN = 'https://pancakeswap.finance/swap?outputCurrency=0x89af13a10b32f1b2f8d1588f93027f69b6f4e27e&inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56';
// export const LINK_SWAP_TOKEN = '';
export const LINK_SWAP_TOKEN = process.env.REACT_APP_PANCAKE_GAFI_SWAP_URL;
export const KUCOIN_GAFI_SWAP_URL = process.env.REACT_APP_KUCOIN_GAFI_SWAP_URL;
export const GATE_GAFI_SWAP_URL = process.env.REACT_APP_GATE_GAFI_SWAP_URL;