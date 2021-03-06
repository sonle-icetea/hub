import { useState, useEffect, useCallback } from 'react'
import { Address } from 'utils/types'
import useApiSignature from './useApiSignature'
import toast from 'react-hot-toast'

export const useOrderBox = (poolId: string | number, account: Address) => {
  const { apiSignMessage } = useApiSignature(`/pool/${poolId}/nft-order`)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    setSuccess(false)
  }, [account])
  const orderBox = useCallback(async (amount: number) => {
    try {
      setLoading(true)
      await apiSignMessage({
        campaign_id: poolId,
        amount,
        account
      })
      toast.success('Order successfully!')
      setSuccess(true)
      setLoading(false)
      return true
    } catch (error) {
      console.debug('error', error)
      toast.error(error.message)
      setLoading(false)
    }
  }, [poolId, account, apiSignMessage])

  return { orderBox, loading, success }
}
