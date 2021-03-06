import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import axios from '../../../services/axios';
import { alertFailure, alertSuccess } from '../../../store/actions/alert';
import useWalletSignature from '../../../hooks/useWalletSignature';

type PoolDepositActionParams = {
  poolId?: number;
  connectedAccount?: string;
  poolDetails?: any;
  solanaSignature?: any
}

const usePoolJoinAction = ({ poolId, poolDetails }: PoolDepositActionParams) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React();
  const [joinPoolSuccess, setJoinPoolSuccess] = useState<boolean>(false);
  const [poolJoinLoading, setPoolJoinLoading] = useState<boolean>(false);
  const [solanaSignature, setSolanaSignature] = useState({publicKey: '', signature: ''})
  const { signature, signMessage, setSignature, error } = useWalletSignature();

  const joinPool = useCallback(async (solSign:any) => {
    if (account && poolId && library) {
      try {
        setPoolJoinLoading(true);

        setSolanaSignature(solSign)
        await signMessage();
      } catch (err: any) {
        setPoolJoinLoading(false);
        console.log('Error when signing: ', err.message);
      }
    }
  }, [poolId, account, library, signMessage]);

  useEffect(() => {
    if (error && poolJoinLoading) {
      setPoolJoinLoading(false);
    }
  }, [error]);

  useEffect(() => {
    const poolJoinRequestWithSignature = async () => {
      if (signature && poolJoinLoading) {
        const config = {
          headers: {
            msgSignature: process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE
          }
        }

        const response = await axios.post(`/user/join-campaign`, {
          signature,
          wallet_address: account,
          campaign_id: poolId,
          solana_signature: solanaSignature?.signature,
          solana_address: solanaSignature?.publicKey
        }, config as any) as any;

        if (response.data) {
          if (response.data.status === 200) {
            setJoinPoolSuccess(true);
          }

          if (response.data.status !== 200) {
            dispatch(alertFailure(response.data.message));
          }
        }

        setSignature("");
        setPoolJoinLoading(false);
      }
    }

    poolJoinRequestWithSignature();
  }, [signature, poolJoinLoading]);

  return {
    joinPool,
    poolJoinLoading,
    joinPoolSuccess
  }
}

export default usePoolJoinAction;
