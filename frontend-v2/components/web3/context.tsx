import { createContext, useContext, useReducer, useMemo } from 'react'
import { networks, Network } from './index'

const Context = createContext<Context>(undefined)

export function MyWeb3Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    provider: null,
    chainID: null,
    account: null,
    error: null,
    balance: null,
    triedEager: false,

    currencyNative: '',
    network: null,
    dispatch: () => {}
  })
  const network = useMemo(() => {
    if (!state?.chainID) {
      return
    }

    return networks.find(nw => nw.id === state.chainID)
  }, [state])
  const currencyNative = useMemo(() => {
    if (!network) {
      return ''
    }

    return network.currency
  }, [network])

  return (
    <Context.Provider
      value={{
        ...state,
        currencyNative,
        network,
        dispatch
      }}
    >
      {children}
    </Context.Provider>
  )
}

type Context = {
  provider: any
  chainID: any
  account: string
  error: Error
  balance: any
  triedEager: boolean

  currencyNative: string
  network: Network
  dispatch: (a: Action) => void
}

export type Action = {
  type: string
  payload: Partial<Context>
}

export function useMyWeb3(): Context {
  const context = useContext(Context)

  if (!context)
    throw new Error('useMyWeb3 must be used inside a `MyWeb3Provider`')

  return context
}

function reducer(state: Context, { type, payload }: Action): Context {
  switch (type) {
    case 'INIT': {
      const { provider, chainID, account, error } = payload
      return { ...state, provider, chainID, account, error }
    }

    case 'SET_CHAINID': {
      const { chainID } = payload
      return {
        ...state,
        chainID
      }
    }

    case 'SET_ERROR': {
      const { error } = payload
      return {
        ...state,
        error
      }
    }

    case 'UPDATE_BALANCE': {
      const { balance } = payload
      return {
        ...state,
        balance
      }
    }

    case 'SET_TRIED_EAGER': {
      const { triedEager } = payload
      return {
        ...state,
        triedEager
      }
    }

    default: {
      return state
    }
  }
}
