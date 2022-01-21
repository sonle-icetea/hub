import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const IS_TESTNET = !!process.env.NEXT_PUBLIC_TESTNET
export const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.NEXT_PUBLIC_RPC_URL_1,
  5: process.env.NEXT_PUBLIC_RPC_URL_5,
  56: process.env.NEXT_PUBLIC_RPC_URL_56,
  97: process.env.NEXT_PUBLIC_RPC_URL_97,
  137: process.env.NEXT_PUBLIC_RPC_URL_137,
  80001: process.env.NEXT_PUBLIC_RPC_URL_80001
}
// ETH Mainnet, ETH Goerli, BSC Mainnet, BSC Testnet, Polygon Mainnet, Polygon Mumbai
export const injected = new InjectedConnector({ supportedChainIds: [1, 5, 56, 97, 137, 80001] })

export const networkConnector = (chainId?: number) => {
  if (!chainId) {
    chainId = 56
  }

  if (IS_TESTNET) {
    switch (chainId) {
    case 1: {
      chainId = 5
      break
    }
    case 56: {
      chainId = 97
      break
    }
    case 137: {
      chainId = 80001
      break
    }
    }
  }

  if (!RPC_URLS?.[chainId]) {
    return
  }

  return new NetworkConnector({
    urls: RPC_URLS,
    defaultChainId: chainId
  })
}

export const network = networkConnector()

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  qrcode: true
})

export const POLLING_INTERVAL = 12000