
import { alertFailure } from '@store/actions/alert';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useWalletSignature from '../../../hooks/useWalletSignature';
import axios, { HeadersSignature } from '@services/axios';
import { useWeb3React } from '@web3-react/core';

type ApiSignatureType = {
  campaignId: string | number;
  captchaToken: string;
  amount: number;
  subBoxId: number;
  eventId: number;
}

const useApiSignature = () => {
  const dispath = useDispatch();
  const { account } = useWeb3React()
  const { signature: walletSignature, signMessage, setSignature: setWalletSignature, error: errorWalletSignature } = useWalletSignature();
  const [signature, setSignature] = useState('');
  const [dataSignToApi, setDataSignToApi] = useState<{[k: string]: any}>()
  const [error, setError] = useState('');

  const apiSignMessage = async ({
    campaignId,
    captchaToken,
    amount, 
    subBoxId,
    eventId
  }: ApiSignatureType) => {
    try {
      error && setError('');
      setDataSignToApi({
        campaign_id: campaignId,
        captcha_token: captchaToken,
        sub_box_id: subBoxId,
        event_id: eventId,
        amount: amount,
      })
      await signMessage();
    } catch (error) {
      dispath(alertFailure("Something went wrong when sign message"));
      setError("Something went wrong when sign message")
    }
  }

  const getSignatureFromApi = async (walletSignature: string) => {
    try {
      const response = await axios.post('/user/deposit-box', {
        wallet_address: account,
        signature: walletSignature,
        ...dataSignToApi,        
      }, HeadersSignature);
      const result = response.data;
      if(result?.status === 200 && result.data) {
        setSignature(result.data.signature);
        setDataSignToApi({});
      } else {
        dispath(alertFailure("Something went wrong when sign message"));
        setError("Something went wrong when sign message")
      }
      setWalletSignature('')
    } catch (error) {
      setWalletSignature('')
      dispath(alertFailure("Something went wrong when sign message"));
      setError("Something went wrong when sign message")
    }
  }

  useEffect(() => {
    if (walletSignature) {
      getSignatureFromApi(walletSignature)
    }
  }, [walletSignature])

  return {
    signature,
    setSignature,
    apiSignMessage,
    error: errorWalletSignature || error,
  }
}

export default useApiSignature;
