import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import useUserClaimSignature from '../hooks/useUserClaimSignature';
import useWalletSignature from '../../../hooks/useWalletSignature';
import PreSale_ABI from '../../../abi/PreSalePool.json';
import { getContract } from '../../../utils/contract';
import { alertSuccess, alertFailure, alertWarning } from '../../../store/actions/alert';
import BigNumber from 'bignumber.js';
import { handleErrMsg } from '../utils';

const useTokenClaim = (poolAddress: string | undefined, poolId: number | undefined) => {
  const { library, account } = useWeb3React();
  const dispatch = useDispatch();

  const [claimTokenSuccess, setClaimTokenSuccess] = useState<boolean>(false);
  const [claimTransactionHash, setClaimTransactionHash] = useState("");
  const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);
  const [claimError, setClaimError] = useState<string>("");

  const { error, signMessage, signature: authSignature, setSignature } = useWalletSignature();
  const { signature, amount, error: claimSignError, setSignature: setUserClaimSignature, loadingClaim } = useUserClaimSignature(account, poolId, authSignature);

  useEffect(() => {
    poolAddress &&
      signature &&
      amount &&
      !claimError &&
      !loadingClaim &&
      claimTokenWithSignature(signature, amount);
  }, [signature, poolAddress, amount, claimError, loadingClaim]);

  useEffect(() => {
    if (error || claimSignError) {
      const errorMessage = error || claimSignError;
      setClaimError(errorMessage as string);
      setClaimTokenLoading(false);
      setSignature("");
      setUserClaimSignature("");
    }
  }, [error, claimSignError]);

  const claimTokenWithSignature = useCallback(
    async (signature: string, amount: string) => {

      console.log('poolAddress, signature, amount, account:', poolAddress, signature, amount, account);
      if (poolAddress && signature && amount && account) {

        if (amount && (new BigNumber(amount)).lte(0)) {
          const msg = 'Please wait until the next milestone to claim the tokens.';
          dispatch(alertFailure(msg));
          setClaimTokenLoading(false);
          setClaimError(msg);
          setSignature("");
          setUserClaimSignature("");
          return;
        }

        try {
          const contract = getContract(poolAddress, PreSale_ABI, library, account as string);
          if (contract) {
            // let overrides = fixGasLimitWithProvider(library, 'claim');
            // const transaction = await contract.claimTokens(account, amount, signature, overrides);
            const transaction = await contract.claimTokens(account, amount, signature);

            setSignature("");
            setUserClaimSignature("");
            setClaimTransactionHash(transaction.hash);
            dispatch(alertWarning("Request is processing!"));
            const result = await transaction.wait(1);
            setClaimTokenLoading(false);
            if (+result?.status === 1) {
              setClaimTokenSuccess(true);
              dispatch(alertSuccess("Token Claim Successful"));
            } else {
              dispatch(alertFailure("Token Claim Failed"));
              setClaimTokenSuccess(false);
            }
          }
        } catch (err: any) {
          const message = handleErrMsg(err) || err.message;
          dispatch(alertFailure(message));
          setClaimTokenLoading(false);
          setClaimError(message);
          setSignature("");
          setUserClaimSignature("");
        }
      }
    }, [poolAddress, library, account, amount, signature]);

  const claimToken = useCallback(async () => {
    if (poolAddress) {
      try {
        setClaimTransactionHash("");
        setClaimError("");
        setClaimTokenLoading(true);
        setClaimTokenSuccess(false);

        await signMessage();
      } catch (err: any) {
        dispatch(alertFailure(err.message));
        setClaimTokenLoading(false);
        setClaimError(err.message);
        setSignature("");
      }
    }
  }, [poolAddress, library, account]);

  return {
    claimToken,
    transactionHash: claimTransactionHash,
    loading: claimTokenLoading,
    setClaimTokenLoading,
    setClaimTransactionHash,
    claimTokenSuccess,
    error: claimError
  }
}

export default useTokenClaim;
