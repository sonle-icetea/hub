module.exports = {
  // WEB3_API_URL: 'https://rinkeby-rpc.sotatek.com',
  WEB3_API_URL: 'https://goerli.infura.io/v3/f1464dc327c64a93a31220b50334bf78',
  // WEB3_API_URL: 'https://goerli.infura.io/v3/3a18fd787c2342c4915364de4955bcf5',
  WEB3_BSC_API_URL: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  WEB3_POLYGON_API_URL: 'https://rpc-mumbai.maticvigil.com/',
  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 9876,
  contracts: {
    CampaignFactory: {
      CONTRACT_DATA: require('./contracts/Normal/CapaignFactory.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/CapaignFactory.json'),
      // CONTRACT_ADDRESS: '0x578b8067C088cdfE26762193Dc2b7a96a8403923',
      // CONTRACT_ADDRESS: '0xAadC3018cE3182254D3AB20e74ec0190ee91a899', // Dev
      // CONTRACT_ADDRESS: '0x7AA0cAb740CE4F014ef5DA0B5387989e6B48D18D',
      // CONTRACT_ADDRESS: '0x7Fd927D0Be34BF3d4B9cC81254C63D77752A1e6B',
      CONTRACT_ADDRESS: '0x41195Ef5642a6f4B4a0C277608e14dB027CB483F',
      FIRST_CRAWL_BLOCK: 4550016, // First Block: 4554016
      BLOCK_NUM_IN_ONE_GO: 5000,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    },
    Campaign: {
      CONTRACT_DATA: require('./contracts/Normal/Campaign.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/Campaign.json'),
      CONTRACT_ADDRESS: '0xc498d7c54514B00F69e636be7826406dE4e31Fe0',
      FIRST_CRAWL_BLOCK: 4550016,
      BLOCK_NUM_IN_ONE_GO: 500,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    },
    StakingContest: {
      CONTRACT_DATA: require('./contracts/Normal/StakingContest.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/Campaign.json'),
      CONTRACT_ADDRESS: '',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    StakingPool: {
      CONTRACT_DATA: require('./contracts/Normal/StakingPool.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/Campaign.json'),
      BONUS: require('./contracts/Ranking/Bonus'),
      CONTRACT_ADDRESS: '',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    EthLink: {
      CONTRACT_DATA: require('./contracts/Normal/EthLink.json'),
      CONTRACT_ADDRESS: '0xdf7986c3C00A08967285382A3f1476Cbe7e91ba0',
      FIRST_CRAWL_BLOCK: 4550016,
      BLOCK_NUM_IN_ONE_GO: 500,
      BREAK_TIME_AFTER_ONE_GO: 15000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    },
    Legend: {
      CONTRACT_ADDRESS: '0x9a524692087707fdb0b64f1409FcC1907Ef083b8',
      CONTRACT_DATA: require('./contracts/Erc721.json'),
      DATA: require('./contracts/Ranking/Legends.json')
    }
  }
};
