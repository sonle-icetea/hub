import React, { useCallback, useEffect, useState, useMemo } from 'react'
import PoolDetail from '@/components/Base/PoolDetail'
import clsx from 'clsx'
import styles from './MysteryBoxDetail.module.scss'
import { ButtonBase } from '@/components/Base/Buttons'
import CountDownTimeV1, { CountDownTimeType } from '@/components/Base/CountDownTime'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import PresaleBoxAbi from '@/components/web3/abis/PreSaleBox.json'
import { Contract, BigNumber, constants } from 'ethers'
import { ObjectType } from '@/utils/types'
import TokenItem from './TokenItem'
import BoxTypeItem from './BoxTypeItem'
import DetailPoolItem from './DetailPoolItem'
import RuleIntroduce from './RuleIntroduce'
import SerieContent from './SerieContent'
import { useMyWeb3 } from '@/components/web3/context'
import { useLibraryDefaultFlexible, useTokenAllowance, useTokenApproval } from '@/components/web3/utils'
import { fetcher } from '@/utils'
import { API_BASE_URL, TIERS } from '@/utils/constants'
import { useCheckJoinPool, useJoinPool } from '@/hooks/useJoinPool'
import Alert from '@/components/Base/Alert'
import InfoBoxOrderItem from './InfoBoxOrderItem'
import BannerImagePool from './BannerImagePool'
import AscDescAmount from './AscDescAmount'
import TimeLine from './TimeLine'
import { getTimelineOfPool } from '@/utils/pool'
import { useAppContext } from '@/context'
import PlaceOrderModal from './PlaceOrderModal'
import toast from 'react-hot-toast'
import BuyBoxModal from './BuyBoxModal'
import stylesBoxType from './BoxTypeItem.module.scss'
import BoxInformation from './BoxInformation'
import WrapperPoolDetail from './WrapperPoolDetail'

const MysteryBoxDetail = ({ poolInfo }: any) => {
  const eventId = 0
  const tiersState = useAppContext()?.tiers
  const userTier = tiersState?.state?.data?.tier || 0
  const { account } = useMyWeb3()
  const [boxTypes, setBoxTypes] = useState<any[]>([])
  const [boxSelected, setBoxSelected] = useState<ObjectType>({})
  const [currencySelected, setCurrencySelected] = useState<ObjectType>({})
  const [myBoxOrdered, setMyBoxOrdered] = useState(0)
  const [currentTab, setCurrentTab] = useState(0)
  const [amountBoxBuy, setAmountBoxBuy] = useState(0)
  const [countdown, setCountdown] = useState<CountDownTimeType & { title: string, [k: string]: any }>({ date1: 0, date2: 0, title: '' })
  const [timelinePool, setTimelinePool] = useState<ObjectType>({})
  const [timelines, setTimelines] = useState<ObjectType<{
    title: string;
    desc: string;
    current?: boolean;
  }>>({})
  const [openPlaceOrderModal, setOpenPlaceOrderModal] = useState(false)
  const [openBuyBoxModal, setOpenBuyBoxModal] = useState(false)

  useEffect(() => {
    if (!account) return
    tiersState.actions.getUserTier(account)
  }, [account])
  const { provider: libraryDefaultTemporary } = useLibraryDefaultFlexible(poolInfo?.network_available)
  const [contractPresale, setContractPresale] = useState<any>(null)
  const [myBoxThisPool, setMyBoxThisPool] = useState(0)
  const maxBoxCanBuy = useMemo(() => {
    const currentTier = poolInfo.tiers.find(t => t.level === userTier)
    return currentTier?.ticket_allow || 0
  }, [poolInfo, userTier])

  useEffect(() => {
    if (!contractPresale || !account) {
      setMyBoxThisPool(0)
      return
    }
    const getMyBoxThisPool = async () => {
      try {
        const myBox = await contractPresale.userBought(eventId, account)
        setMyBoxThisPool(myBox.toNumber())
      } catch (error) {
        console.debug('er', error)
      }
    }
    getMyBoxThisPool()
  }, [contractPresale, account])

  const onSetCountdown = useCallback(() => {
    if (poolInfo) {
      const isAccIsBuyPreOrder = userTier >= poolInfo.pre_order_min_tier
      const timeLine = getTimelineOfPool(poolInfo)
      setTimelinePool(timeLine)
      const timeLinesInfo: { [k: string]: any } = {
        1: {
          title: 'UPCOMING',
          desc: 'Stay tuned and prepare to APPLY WHITELIST.'
        },
        2: {
          title: 'WHITELIST',
          desc: 'Click the [APPLY WHITELIST] button to register for Phase 1.'
        }
      }
      if (timeLine.freeBuyTime) {
        timeLinesInfo[3] = {
          title: 'BUY PHASE 1',
          desc: 'Whitelist registrants will be given favorable dealings to buy Mystery Boxes in phase 1, on a FCFS basis.'
        }
        timeLinesInfo[4] = {
          title: 'BUY PHASE 2',
          desc: 'The whitelist of phase 2 will be started right after phase 1 ends. Remaining boxes left in phase 1 will be transferred to phase 2.'
        }
        timeLinesInfo[5] = {
          title: 'END',
          desc: 'Thank you for watching.'
        }
      } else {
        timeLinesInfo[3] = {
          title: 'BUY PHASE 1',
          desc: 'Whitelist registrants will be given favorable dealings to buy Mystery Boxes in phase 1, on a FCFS basis.'
        }
        timeLinesInfo[4] = {
          title: 'END',
          desc: 'Thank you for watching.'
        }
      }
      const startBuyTime = isAccIsBuyPreOrder && timeLine.startPreOrderTime ? timeLine.startPreOrderTime : timeLine.startBuyTime
      const soldOut = false
      if (soldOut) {
        setCountdown({ date1: 0, date2: 0, title: 'This pool is over. See you in the next pool.', isFinished: true })
        timeLine.freeBuyTime ? (timeLinesInfo[5].current = true) : (timeLinesInfo[4].current = true)
      } else if (timeLine.startJoinPooltime > Date.now()) {
        setCountdown({ date1: timeLine.startJoinPooltime, date2: Date.now(), title: 'Whitelist Opens In', isUpcoming: true })
        timeLinesInfo[1].current = true
      } else if (timeLine.endJoinPoolTime > Date.now()) {
        if (isAccIsBuyPreOrder && startBuyTime < Date.now()) {
          timeLinesInfo[3].current = true
          setCountdown({ date1: timeLine?.freeBuyTime || timeLine?.finishTime, date2: Date.now(), title: 'Phase 1 Ends In', isSale: true, isPhase1: true })
        } else {
          setCountdown({ date1: timeLine.endJoinPoolTime, date2: Date.now(), title: 'Whitelist Closes In', isWhitelist: true })
          timeLinesInfo[2].current = true
        }
      } else if (startBuyTime > Date.now()) {
        timeLinesInfo[2].current = true
        if (timeLine.freeBuyTime) {
          setCountdown({ date1: startBuyTime, date2: Date.now(), title: 'Sale Phase 1 Starts In', isUpcomingSale: true, isMultiPhase: true })
        } else {
          setCountdown({ date1: startBuyTime, date2: Date.now(), title: 'Sale Starts In', isUpcomingSale: true })
        }
      } else if (timeLine.freeBuyTime && timeLine.freeBuyTime > Date.now()) {
        timeLinesInfo[3].current = true
        setCountdown({ date1: timeLine.freeBuyTime, date2: Date.now(), title: 'Phase 1 Ends In', isSale: true, isPhase1: true })
      } else if (timeLine.finishTime > Date.now()) {
        if (timeLine.freeBuyTime) {
          timeLinesInfo[4].current = true
          setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Phase 2 Ends In', isSale: true, isPhase2: true })
        } else {
          timeLinesInfo[3].current = true
          setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Sale Ends In', isSale: true, isPhase1: true })
        }
      } else {
        setCountdown({ date1: 0, date2: 0, title: 'Finished', isFinished: true })
        timeLine.freeBuyTime ? (timeLinesInfo[5].current = true) : (timeLinesInfo[4].current = true)
      }
      setTimelines(timeLinesInfo)
    }
  }, [poolInfo, userTier])

  useEffect(() => {
    onSetCountdown()
  }, [onSetCountdown])

  const listTokens = useMemo(() => {
    if (!boxSelected.currency_ids) {
      return []
    }
    const currencyIds = boxSelected.currency_ids.split(',').map(id => +id)
    const listCurrencies = (poolInfo.acceptedTokensConfig || [])
      .filter((c, id) => currencyIds.includes(id))
      .map(token => {
        if (token.address && !BigNumber.from(token.address).isZero()) {
          token.neededApprove = true
        }
        return token
      })
    const token = listCurrencies[0] || {}
    setCurrencySelected(token)
    return listCurrencies
  }, [poolInfo, boxSelected])

  useEffect(() => {
    const boxes = poolInfo.boxTypesConfig || []
    if (poolInfo.campaign_hash && libraryDefaultTemporary) {
      const contractPresale = new Contract(poolInfo.campaign_hash, PresaleBoxAbi, libraryDefaultTemporary)
      setContractPresale(contractPresale)
      Promise
        .all(boxes.map((b, subBoxId) => new Promise(async (resolve, reject) => {
          try {
            const response = await contractPresale.subBoxes(eventId, subBoxId)
            const result = {
              maxSupply: response.maxSupply ? response.maxSupply.toNumber() : 0,
              totalSold: response.totalSold ? response.totalSold.toNumber() : 0
            }
            resolve({ ...b, subBoxId, ...result })
          } catch (error) {
            reject(error)
          }
        })))
        .then((boxes) => {
          setBoxTypes(boxes)
          setBoxSelected(boxes[0])
        })
        .catch(err => {
          console.debug('err', err)
        })
    } else {
      setBoxTypes(boxes)
      setBoxSelected(boxes[0])
    }
  }, [poolInfo, libraryDefaultTemporary])

  useEffect(() => {

  }, [listTokens, boxSelected])

  const onSelectCurrency = (t: ObjectType) => {
    if (t.address === currencySelected.address) return
    setCurrencySelected(t)
  }

  const onSelectBoxType = (b: ObjectType) => {
    if (b.id === boxSelected.id) return
    setBoxSelected(b)
  }

  const onChangeTab = (val: any) => {
    setCurrentTab(val)
  }

  const getBoxOrderd = useCallback(async () => {
    if (!account) {
      setMyBoxOrdered(0)
      return
    }
    try {
      const res = await fetcher(`/pool/${poolInfo?.id}/nft-order?wallet_address=${account}`)
      const amount = res.data?.amount
      setMyBoxOrdered(amount)
    } catch (error) {
      console.debug('error', error)
    }
  }, [account, poolInfo])

  useEffect(() => {
    getBoxOrderd()
  }, [getBoxOrderd])
  const { isJoinPool, loading: loadingCheckJPool } = useCheckJoinPool(poolInfo?.id, account)
  const { joinPool, loading: loadingJPool, success: isJoinSuccess } = useJoinPool(poolInfo?.id, account)

  const onChangeNumBuyBox = (num: number) => {
    setAmountBoxBuy(num)
  }

  const [isApprovedToken, setTokenApproved] = useState<boolean | null>(null)
  const { approve, loading: loadingApproveToken } = useTokenApproval(currencySelected as any, poolInfo.campaign_hash)
  const { allowance, load: getAllowance, loading: loadingAllowance } = useTokenAllowance(currencySelected as any, account, poolInfo.campaign_hash, poolInfo.network_available)
  useEffect(() => {
    if (currencySelected && account) {
      getAllowance()
    }
  }, [getAllowance, currencySelected, account])
  useEffect(() => {
    if (!allowance) {
      setTokenApproved(null)
    } else {
      setTokenApproved(!BigNumber.from(allowance).isZero())
    }
  }, [allowance])
  const handleApproveToken = async () => {
    await approve(constants.MaxUint256)
    toast.success('Approve token succesfully')
    setTokenApproved(true)
  }

  const onJoinCompetition = (link: string) => {
    window.open(link)
  }

  const isAppliedWhitelist = isJoinPool || isJoinSuccess
  const isShowBtnApprove = currencySelected.neededApprove && !isApprovedToken && ((countdown.isPhase1 && isAppliedWhitelist) || countdown.isPhase2) && (!currencySelected.neededApprove || (currencySelected.neededApprove && !isApprovedToken))
  const isShowBtnBuy = isAppliedWhitelist && (!currencySelected.neededApprove || (currencySelected.neededApprove && isApprovedToken))
  const isAllowedJoinCompetive = (countdown.isWhitelist || countdown.isUpcoming) && +poolInfo.is_private === 3 && poolInfo.socialRequirement?.gleam_link && !isAppliedWhitelist
  return (<WrapperPoolDetail>
    {/* <DialogTxSubmitted
                transaction={auctionTxHash}
                open={openModalTx}
                onClose={() => setOpenModalTx(false)}
                networkName={allowNetwork.shortName}
            />
            */}
    <PlaceOrderModal open={openPlaceOrderModal} onClose={() => setOpenPlaceOrderModal(false)} poolId={poolInfo.id} getBoxOrderd={getBoxOrderd} />
    <BuyBoxModal
      open={openBuyBoxModal}
      onClose={() => setOpenBuyBoxModal(false)}
      amountBoxBuy={amountBoxBuy}
      boxTypeBuy={boxSelected}
      currencyInfo={currencySelected}
      poolInfo={poolInfo}
      eventId={eventId}
    />
    <div className={clsx('rounded mb-5', styles.headPool)}>
      {
        isAppliedWhitelist && (countdown.isUpcomingSale || countdown.isWhitelist) && <Alert className='mb-10'>
          Congratulations! You have successfully applied whitelist and can buy Mystery boxes from <b>Phase 1</b>
        </Alert>
      }
      <div className={'grid grid-cols-2'}>
        <div className={clsx('flex', styles.headInfoBoxOrder)}>
          <InfoBoxOrderItem label='Registered Users' value={poolInfo.totalOrder || 0} />
          <InfoBoxOrderItem label='Ordered Boxes' value={poolInfo.totalRegistered || 0} />
          <InfoBoxOrderItem label='Your Ordered' value={myBoxOrdered} />
        </div>
        <div className={clsx('bg-black flex justify-center items-center gap-2', styles.headCountdown)} >
          <div className={clsx('font-bold text-sm uppercase', styles.titleCountdown)}>
            {countdown.title}
          </div>
          <div className={clsx(styles.countdown)} >
            {countdown.date2 !== 0 && !countdown.isFinished && <CountDownTimeV1 time={{ date1: countdown.date1, date2: countdown.date2 }} className="bg-transparent" background='bg-transparent' onFinish={onSetCountdown} />}
          </div>
        </div>
      </div>

    </div>
    <PoolDetail
      bodyBannerContent={<BannerImagePool src={boxSelected.banner} />}
      bodyDetailContent={<>
        <h2 className="font-semibold text-4xl mb-2 uppercase">{poolInfo.title || poolInfo.name}</h2>
        <div className="creator flex items-center gap-1">
          <img src={poolInfo.token_images} className="icon rounded-full w-5 -h-5" alt="" />
          <span className="text-white/70 uppercase text-sm">{poolInfo.symbol}</span>
        </div>
        <div className="divider bg-white/20 w-full mt-3 mb-8" style={{ height: '1px' }}></div>
        <div className='mb-4'>
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <img src={currencySelected?.icon} className="icon rounded-full w-5 -h-5" alt="" />
              <span className="uppercase font-bold text-white text-2xl">{Number(currencySelected?.price) || ''} {currencySelected?.name}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6 mb-8">
          <DetailPoolItem label='TOTAL SALE' value={`${poolInfo.total_sold_coin} Boxes`} />
          <DetailPoolItem label='SUPPORTED'
            icon={require(`assets/images/icons/${poolInfo.network_available}.svg`)}
            value={poolInfo.network_available} />
          <DetailPoolItem label='Min Rank'
            value={poolInfo.min_tier > 0 ? TIERS[poolInfo.min_tier].name : 'No Required'} />
        </div>
        <div className='mb-8'>
          <div> <h4 className='font-bold text-base mb-1 uppercase'>Currency</h4> </div>
          <div className='flex gap-1'>
            {listTokens.map((t) => <TokenItem key={t.address} item={t} onClick={onSelectCurrency} selected={currencySelected?.address === t.address} />)}
          </div>
        </div>
        <div className='mb-8'>
          <div> <h4 className='font-bold text-base mb-1 uppercase'>Type</h4></div>
          <div className={clsx('gap-2', stylesBoxType.boxTypes)}>
            {boxTypes.map((b) => <BoxTypeItem key={b.id} item={b} onClick={onSelectBoxType} selected={boxSelected.id === b.id} />)}
          </div>
        </div>
        {
          countdown.isSale &&
          <div className='mb-8'>
            <AscDescAmount value={amountBoxBuy} maxBuy={maxBoxCanBuy} bought={myBoxThisPool} onChangeValue={onChangeNumBuyBox} poolInfo={poolInfo} currencyInfo={currencySelected} />
          </div>
        }
        <div>
          {isAllowedJoinCompetive && <ButtonBase color="red"
            onClick={() => onJoinCompetition(poolInfo.socialRequirement.gleam_link)}
            className={clsx('w-full mt-4 uppercase')}>
            Join Competition
          </ButtonBase>
          }
          {
            !isAppliedWhitelist && countdown.isWhitelist && <ButtonBase
              color={'green'}
              isLoading={loadingJPool || loadingCheckJPool}
              disabled={loadingCheckJPool || loadingJPool}
              onClick={joinPool}
              className={clsx('w-full mt-4 uppercase')}>
              Apply Whitelist
            </ButtonBase>
          }
          {
            isAppliedWhitelist && countdown.isWhitelist &&
            <ButtonBase
              color={'green'}
              onClick={() => setOpenPlaceOrderModal(true)}
              className={clsx('w-full mt-4 uppercase')}>
              Place Order
            </ButtonBase>
          }
          {
            isShowBtnApprove &&
            <ButtonBase
              color={'green'}
              isLoading={loadingApproveToken || loadingAllowance}
              disabled={loadingApproveToken || loadingAllowance}
              onClick={handleApproveToken}
              className={clsx('w-full mt-4 uppercase')}>
              {loadingAllowance ? 'Checking Approval' : 'Approve'}
            </ButtonBase>
          }
          {
            isShowBtnBuy &&
            <ButtonBase
              color={'green'}
              onClick={() => setOpenBuyBoxModal(true)}
              className={clsx('w-full mt-4 uppercase')}>
              Buy Box
            </ButtonBase>
          }
        </div>
      </>}
      footerContent={<>
        <Tabs
          titles={[
            'Rule Introduction',
            boxSelected?.description ? 'Box Infomation' : undefined,
            'Series Content',
            'TimeLine'
          ]}
          currentValue={currentTab}
          onChange={onChangeTab}
        />
        <div className="mt-6 mb-10">
          <TabPanel value={currentTab} index={0}>
            <RuleIntroduce poolInfo={poolInfo} />
          </TabPanel>
          {
            boxSelected?.description && <TabPanel value={currentTab} index={1}>
              <BoxInformation boxes={boxTypes} />
            </TabPanel>
          }
          <TabPanel value={currentTab} index={2}>
            <SerieContent poolInfo={poolInfo} />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <TimeLine timelines={timelines} />
          </TabPanel>
        </div>
      </>}
    />
  </WrapperPoolDetail>
  )
}

export default MysteryBoxDetail
