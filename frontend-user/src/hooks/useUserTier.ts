export default {};
// import { useEffect, useMemo, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useTypedSelector } from '../hooks/useTypedSelector';
// import MANTRA_ABI from '../abi/mantraUnstake.json';
// import { getContractInstance, SmartContractMethod } from '../services/web3';
// import _ from 'lodash';
// import { BigNumber } from 'bignumber.js';
// import useTokenDetails from './useTokenDetails';
// import {getEPkfBonusBalanceValue} from "../utils/campaign";
// import { ChainDefault } from '../constants/network';

// const SPKF_ADDRESS = process.env.REACT_APP_MANTRA_LP || 'undefined';

// export type UserTier = {
//   currentTier: number;
//   totalStaked: string;
//   totalUnstaked: string;
//   total: string
// }

// const useUserTier = (address: string, networkAvailable: string): UserTier => {
//   const [ currentUserTier, setCurrentUserTier ] = useState<number>(0);
//   const { data: userInfo, loading: userInfoLoading } = useSelector((state: any) => state.userInfo);
//   const { appChainID } = useSelector((state: any) => state.appNetwork).data;
//   const connector  = useTypedSelector(state => state.connector).data;
//   const [ loading, setLoading] = useState<boolean>(true);
//   const { data: tiers, loading: tiersLoading } = useSelector((state: any) => state.tiers);
//   const { tokenDetails, loading: tokenDetailsLoading } = useTokenDetails(SPKF_ADDRESS, ChainDefault.shortName || '');
//   const [ totalUnstaked, setTotalUnstaked ] = useState<string>('0');
//   const [ total, setTotal ] = useState<string>('0');


//   const calculateUserTier = (totalStaked: BigNumber) => {
//     let currentTier = 0;
//     for(let i = 0; i < tiers.length; i++) {
//       const tier = new BigNumber(tiers[i])
//       if(tier.lte(totalStaked)) {
//         currentTier = i + 1
//       }
//     }
//     setCurrentUserTier(currentTier);
//   }

//   useEffect(() => {
//     (!userInfoLoading && !tiersLoading && userInfo.totalStaked && tokenDetails) ? setLoading(false) : setLoading(true);
//   }, [userInfoLoading, userInfo, tokenDetailsLoading, tokenDetails]);

//   useEffect(() => {
//     const getTotalUnstaked = async () => {
//       if(SPKF_ADDRESS && address) {
//         try {
//           const contract = getContractInstance(
//             MANTRA_ABI,
//             SPKF_ADDRESS,
//             connector,
//             appChainID,
//             SmartContractMethod.Read,
//             networkAvailable === 'eth'
//           );
//           const totalUnstakedResult = await contract?.methods.getUnstake(address).call();
//           const totalUnstaked = 0;// (new BigNumber(totalUnstakedResult.amount)).div(new BigNumber(10**(tokenDetails?.decimals || 0)))
//           const totalStaked = new BigNumber(userInfo.totalStaked);
//           let balance = new BigNumber(0); // await contract?.methods.balanceOf(address).call();
//           balance = (new BigNumber(balance).div(Math.pow(10, 18)))

//           const ePkf = await getEPkfBonusBalanceValue(address);

//           const total = totalStaked.plus(totalUnstaked).plus(balance).plus(ePkf);
//           setTotalUnstaked(totalUnstaked.toString());
//           setTotal(total.toString());
//           calculateUserTier(total);
//         }catch(e) {
//           console.log('error', e)
//         }
//       }
//     }

//     !loading && getTotalUnstaked();
//   }, [loading, userInfo]);

//   useEffect(() => {
//     setTotalUnstaked('0')
//     setTotal('0')
//     setCurrentUserTier(0)
//   }, [address, appChainID])

//   return  {
//     currentTier: currentUserTier,
//     totalStaked: userInfo.totalStaked,
//     totalUnstaked,
//     total
//   }
// }

// export default useUserTier;
