import React from 'react';
import useStyles from "./style";
import {formatRoundDown, formatRoundUp, numberWithCommas} from "../../../utils/formatNumber";
import BigNumber from 'bignumber.js';
import {useWeb3React} from "@web3-react/core";
import useFetch from "../../../hooks/useFetch";
import {useParams} from "react-router-dom";

function ClaimInfo(props: any) {
  const styles = useStyles();
  const {
    poolDetails,
    tokenDetails,
    userClaimInfo,
    releaseTime,
    currentClaim,
    currentClaimIndex,
    nextClaim,
    nextClaimIndex,
    maximumTokenClaimUtilNow,
    currencyName,
    policy,
    currentUserTier
  } = props;

  const {
    userPurchased = 0,
    userClaimed = 0,
    // userPurchasedReturn = 0,
  } = (userClaimInfo || {});

  // const { account: connectedAccount } = useWeb3React();
  // const { id } = useParams() as any;
  // const { data: currentUserTier } = useFetch<any>(
  //   id && connectedAccount ?
  //     `pool/${id}/user/${connectedAccount}/current-tier`
  //     : undefined,
  // );
  const userBuyLimit = (+currentUserTier?.max_buy || 0) + ( +currentUserTier?.max_bonus || 0);

  return (
    <>
      <div className={styles.poolDetailClaimInfo}>
        <div className={styles.poolDetailClaimInfoBlock}>
          <span>Total bought tokens</span>
          <span className="text-blue">{
          (poolDetails?.id === 99 || poolDetails?.id === '99' || poolDetails?.id === 100 || poolDetails?.id === '100')
          ? numberWithCommas(`${formatRoundUp(new BigNumber(userPurchased).dividedBy(10 ** 10) || 0)}`, 2)
          : numberWithCommas(`${userPurchased || 0}`, 2)} {tokenDetails?.symbol}</span>
        </div>

        <div className={styles.poolDetailClaimInfoBlock}>
          <span>Have bought</span>
          <span>{
            (poolDetails?.id === 99 || poolDetails?.id === '99' || poolDetails?.id === 100 || poolDetails?.id === '100')
            ? numberWithCommas(`${
              formatRoundUp(
                new BigNumber(userPurchased).dividedBy(10 ** 10).multipliedBy(poolDetails?.ethRate || 0)
              )
            }`, 2)
            : numberWithCommas(`${
              formatRoundUp(
                new BigNumber(userPurchased).multipliedBy(poolDetails?.ethRate || 0)
              )
            }`, 2)}/
            {numberWithCommas(`${formatRoundDown(userBuyLimit)}`, 2)} {currencyName}
          </span>
        </div>

        {poolDetails?.claimPolicy && <div className={styles.poolDetailClaimInfoBlock}>
          <span>Claim policy</span>
          <span style={{wordBreak: 'break-all'}}>{poolDetails?.claimPolicy}</span>
        </div>}

        <div className={styles.poolDetailClaimInfoBlock}>
          <span>Claimed on GameFi</span>
          <span className="text-blue">{
          (poolDetails?.id === 99 || poolDetails?.id === '99' || poolDetails?.id === 100 || poolDetails?.id === '100')
          ? numberWithCommas(`${formatRoundUp(new BigNumber(userClaimed).dividedBy(10 ** 10) || 0)}`, 2)
          : numberWithCommas(`${userClaimed || 0}`, 2)}/{
          (poolDetails?.id === 99 || poolDetails?.id === '99' || poolDetails?.id === 100 || poolDetails?.id === '100')
          ? numberWithCommas(`${formatRoundUp(new BigNumber(userPurchased).dividedBy(10 ** 10) || 0)}`, 2)
          : numberWithCommas(`${formatRoundUp(new BigNumber(userPurchased) || 0)}`, 2)} {tokenDetails?.symbol}</span>
        </div>
      </div>

    </>
  );
}

export default ClaimInfo;
