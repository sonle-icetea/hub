import { alertWarning } from './../store/actions/alert';
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import { TRANSACTION_ERROR_MESSAGE } from '../constants/alert';
import { MAX_INT } from '../services/web3';
import { alertSuccess, alertFailure } from '../store/actions/alert';
import { getContract } from '../utils/contract';
import { TokenType } from '../hooks/useTokenDetails';

import ERC20_ABI from '../abi/Erc20.json';
import { fixGasLimitWithProvider } from "../utils";

const useTokenAllowance = (
  token: TokenType | undefined,
  owner: string | null | undefined,
  spender: string | null | undefined,
  sotaABI: false
) => {
  const [tokenApproveLoading, setTokenApproveLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { library, account } = useWeb3React();

  const approveToken = useCallback(async () => {
    setTransactionHash("");

    try {
      if (token && spender && owner
        && ethers.utils.isAddress(owner)
        && ethers.utils.isAddress(spender)
        && ethers.utils.isAddress(token.address)
      ) {
        setTokenApproveLoading(true);

        const contract = getContract(token.address, ERC20_ABI, library, account as string);

        if (contract) {
          // let overrides = fixGasLimitWithProvider(library, 'approve');
          // const transaction = await contract.approve(spender, MAX_INT, overrides);
          const transaction = await contract.approve(spender, MAX_INT);
          console.log('Approve Token', transaction);
          dispatch(alertWarning("Approval is processing!"));
          setTransactionHash(transaction.hash);

          const result = await transaction.wait(1);
          if(+result?.status === 1) {
            dispatch(alertSuccess("Token Approve Successful!"));
            setTokenApproveLoading(false);
          } else {
            dispatch(alertFailure("Token Approve Failed"));
            setTokenApproveLoading(false);
          }
        }
      }
    } catch (err: any) {
      console.log('[ERROR] - useTokenAllowance:', err);
      dispatch(alertFailure(err.message || TRANSACTION_ERROR_MESSAGE));
      setTokenApproveLoading(false);
      throw new Error(err.message);
    }
  }, [owner, spender, token]);

  return {
    tokenApproveLoading,
    approveToken,
    setTokenApproveLoading,
    transactionHash
  }
}

export default useTokenAllowance;
