import CountDownTimeV1 from '@/components/Base/CountDownTime'
// import { useMyWeb3 } from '@/components/web3/context'
import { formatNumber } from '@/utils'
import { ObjectType } from '@/utils/types'
import clsx from 'clsx'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './Collection.module.scss'
import { PropagateLoader } from 'react-spinners'
import gamefiBoxImg from '@/assets/images/gamefi-box.png'
import Pagination from '@/components/Base/Pagination'

type Props = {
  poolInfo: ObjectType;
  collections: ObjectType[];
  loading?: boolean;
  onClaimAllNFT: () => any;
  onClaimNFT: (tokenId: number) => any;
} & ObjectType

const Collection = ({ poolInfo, collections, loading, onClaimAllNFT, onClaimNFT, isValidChain, ownedBox, handleChangePage, filter }: Props) => {
  const POOL_IDS_IS_CLAIMED_ONE_BY_ONE: any[] = useMemo(() => {
    try {
      return JSON.parse(process.env.NEXT_PUBLIC_POOL_IDS_IS_CLAIMED_ONE_BY_ONE || '')
    } catch (error) {
      return []
    }
  }, [])
  // const { account } = useMyWeb3()
  const [isClaimed, setClaim] = useState(false)
  // const [currentPage, setCurrentPage] = useState(1)
  // const perPage = 8
  // const totalCollection = useMemo(() => {
  //   return collections?.length || 0
  // }, [collections])
  // const listCollections = useMemo(() => {
  //   if (!totalCollection) return []
  //   const from = (currentPage - 1) * perPage
  //   const end = (currentPage - 1) * perPage + perPage
  //   return collections.slice(from, end)
  // }, [collections, currentPage, totalCollection, perPage])
  let timeClaim = poolInfo.campaignClaimConfig?.[0]?.start_time
  const claimType = poolInfo.campaignClaimConfig?.[0]?.claim_type
  const claimUrl = poolInfo.campaignClaimConfig?.[0]?.claim_url
  const isClaimedOnGF = !claimType || +claimType === 0
  const timeNow = Date.now()
  timeClaim = timeClaim ? +timeClaim * 1000 : 0
  useEffect(() => {
    if (timeClaim && timeClaim < timeNow) {
      setClaim(true)
    }
  }, [timeClaim, timeNow])

  // useEffect(() => {
  //   setCurrentPage(1)
  // }, [account])

  const onFinishCountdown = () => {
    setClaim(true)
  }

  const handleClaimAllNFT = () => {
    if (!isClaimed) return
    onClaimAllNFT()
  }

  const handleClaimNFT = (tokenId: number) => {
    if (!isClaimed) return
    onClaimNFT(tokenId)
  }

  const onChangePage = useCallback((page: number) => {
    const toTop = document.getElementById('collections')
    toTop && toTop.scrollIntoView({ behavior: 'smooth' })
    handleChangePage(page)
  }, [handleChangePage])

  return (
    <div className='relative'>
      {loading && <div className='flex items-center w-full h-5 justify-center absolute -top-5'><PropagateLoader color='#fff'></PropagateLoader></div>}
      {/* {
        !loading && +ownedBox <= 0 &&
        <div className='flex items-center w-full h-32 justify-center'>
          <h1 className='uppercase text-4xl text-center font-bold'>Empty</h1>
        </div>
      } */}
      {
        +ownedBox > 0 && !!timeClaim &&
        <div className='flex gap-3 justify-between flex-wrap items-center mb-9' id='collections'>
          <div className={clsx(styles.wrapperCountdown, 'items-center')}>
            <div className='text-sm font-bold uppercase w-max'>
              {(timeClaim > timeNow) ? 'Claim starts in' : 'You can claim now'}
            </div>
            {!isClaimed && timeClaim > timeNow && <CountDownTimeV1 background='bg-transparent' time={{ date1: timeClaim, date2: timeNow }} onFinish={onFinishCountdown} />}
          </div>
          <div className='flex gap-2 flex-wrap'>
            {
              !POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id) &&
              <button
                className={clsx(
                  styles.btnClaimAll,
                  'p-px cursor-pointer bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700 rounded-sm'
                )}>
                {
                  isClaimedOnGF
                    ? isClaimed && <div
                      onClick={(isClaimed && isValidChain) ? handleClaimAllNFT : undefined}
                      className={clsx(styles.btnClaimAll,
                        'bg-gamefiDark-900 w-40 text-13px flex justify-center items-center rounded-sm font-bold uppercase',
                        {
                          'cursor-not-allowed': !isClaimed || !isValidChain
                        }
                      )}
                    >
                      Claim all on GameFi.org
                    </div>
                    : (claimUrl && <div
                      className={clsx(styles.btnClaimAll, 'bg-gamefiDark-900 w-40 text-13px flex justify-center items-center rounded-sm font-bold uppercase')}
                      onClick={() => window.open(claimUrl)}
                    >
                      Claim all on External
                    </div>)
                }
              </button>
            }
            {
              (timeClaim < timeNow) && claimUrl && <button
                className={clsx(styles.btnViewNft, 'text-black uppercase bg-gamefiGreen-700 font-bold text-13px h-9 w-40 rounded-sm')}
                onClick={() => window.open(claimUrl)}
              >
                View your nft
              </button>
            }
          </div>
        </div>
      }
      {
        !!collections.length &&
        <div className='flex flex-wrap gap-5 lg:justify-start justify-center'>
          {
            collections.map((b, id) => <div key={id} className={clsx(styles.collection, {
              [styles.clippedpath]: !isClaimed || !POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id)
            })}>
              <div className={clsx('cursor-pointer')}>
                <div className={clsx(styles.collectionImage, 'w-full')}>
                  <img src={b.image || gamefiBoxImg.src} className='w-full h-full object-contain' alt=""
                    onError={(e: any) => {
                      e.target.src = gamefiBoxImg.src
                    }}
                  />
                </div>
                <div className={clsx(styles.collectionDetail, 'w-full flex items-center')}>
                  <div className='w-2/5 font-casual text-13px text-center font-semibold'>
                    #{formatNumber(b.collectionId, 3) || '-/-'}
                  </div>
                  <div
                    onClick={(isClaimed && isValidChain) ? () => handleClaimNFT(b.collectionId) : undefined}
                    className={clsx(styles.btnClaim,
                      'w-3/5 text-black font-bold text-13px text-center h-full flex items-center justify-center',
                      {
                        'bg-gamefiGreen-700': isClaimed && POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id),
                        'bg-gamefiDark-900': !isClaimed || !POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id),
                        'cursor-not-allowed': !isValidChain
                      }
                    )}>
                    {isClaimed ? 'Claim' : ''}
                  </div>
                </div>
              </div>
            </div>)
          }
        </div>
      }
      {
        filter.totalPage > 1 &&
        <Pagination
          className='mt-8'
          totalPage={filter.totalPage}
          currentPage={filter.page}
          onChange={loading ? undefined : onChangePage}
          // totalPage={Math.ceil(+ownedBox / perPage)}
          // currentPage={currentPage}
          // onChange={loading ? undefined : setCurrentPage}
        />
      }
      {/* {
        loading && !collections.length
          ? <div className='flex items-center w-full h-32 justify-center'><PropagateLoader color='#fff'></PropagateLoader></div>
          : account && ownedBox > 0
            ? <>
              {loading && <div className='flex items-center w-full h-5 justify-center'><PropagateLoader color='#fff'></PropagateLoader></div>}
              <div className='flex gap-3 justify-between flex-wrap items-center mb-9' id='collections'>
                <div className={clsx(styles.wrapperCountdown, 'items-center')}>
                  <div className='text-sm font-bold uppercase w-max'>
                    {(timeClaim > timeNow) ? 'Claim starts in' : 'You can claim now'}
                  </div>
                  {!isClaimed && timeClaim > timeNow && <CountDownTimeV1 background='bg-transparent' time={{ date1: timeClaim, date2: timeNow }} onFinish={onFinishCountdown} />}
                </div>
                <div className='flex gap-2 flex-wrap'>
                  {
                    !POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id) &&
                    <button
                      className={clsx(
                        styles.btnClaimAll,
                        'p-px cursor-pointer bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700 rounded-sm'
                      )}>
                      {
                        isClaimedOnGF
                          ? isClaimed && <div
                            onClick={(isClaimed && isValidChain) ? handleClaimAllNFT : undefined}
                            className={clsx(styles.btnClaimAll,
                              'bg-gamefiDark-900 w-40 text-13px flex justify-center items-center rounded-sm font-bold uppercase',
                              {
                                'cursor-not-allowed': !isClaimed || !isValidChain
                              }
                            )}
                          >
                            Claim all on GameFi.org
                          </div>
                          : (claimUrl && <div
                            className={clsx(styles.btnClaimAll, 'bg-gamefiDark-900 w-40 text-13px flex justify-center items-center rounded-sm font-bold uppercase')}
                            onClick={() => window.open(claimUrl)}
                          >
                            Claim all on External
                          </div>)
                      }
                    </button>
                  }
                  {
                    (timeClaim < timeNow) && claimUrl && <button
                      className={clsx(styles.btnViewNft, 'text-black uppercase bg-gamefiGreen-700 font-bold text-13px h-9 w-40 rounded-sm')}
                      onClick={() => window.open(claimUrl)}
                    >
                      View your nft
                    </button>
                  }
                </div>
              </div>
              <div>
                <div className='flex flex-wrap gap-5 lg:justify-start justify-center'>
                  {
                    collections.map((b, id) => <div key={id} className={clsx(styles.collection, {
                      [styles.clippedpath]: !isClaimed || !POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id)
                    })}>
                      <div className={clsx('cursor-pointer')}>
                        <div className={clsx(styles.collectionImage, 'w-full')}>
                          <img src={b.image || gamefiBoxImg.src} className='w-full h-full object-contain' alt=""
                            onError={(e: any) => {
                              e.target.src = gamefiBoxImg.src
                            }}
                          />
                        </div>
                        <div className={clsx(styles.collectionDetail, 'w-full flex items-center')}>
                          <div className='w-2/5 font-casual text-13px text-center font-semibold'>
                            #{formatNumber(b.collectionId, 3) || '-/-'}
                          </div>
                          <div
                            onClick={(isClaimed && isValidChain) ? () => handleClaimNFT(b.collectionId) : undefined}
                            className={clsx(styles.btnClaim,
                              'w-3/5 text-black font-bold text-13px text-center h-full flex items-center justify-center',
                              {
                                'bg-gamefiGreen-700': isClaimed && POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id),
                                'bg-gamefiDark-900': !isClaimed || !POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id),
                                'cursor-not-allowed': !isValidChain
                              }
                            )}>
                            {isClaimed ? 'Claim' : ''}
                          </div>
                        </div>
                      </div>
                    </div>)
                  }
                </div>
                {
                  filter.totalPage > 1 && <Pagination
                    className='mt-8'
                    totalPage={filter.totalPage}
                    currentPage={filter.page}
                    onChange={loading ? undefined : onChangePage}
                  // totalPage={Math.ceil(+ownedBox / perPage)}
                  // currentPage={currentPage}
                  // onChange={loading ? undefined : setCurrentPage}
                  />
                }
              </div>
            </>
            : <div className='flex items-center w-full h-32 justify-center'>
              <h1 className='uppercase text-4xl text-center font-bold'>No Box Found</h1>
            </div>
      } */}
    </div>
  )
}

export default Collection
