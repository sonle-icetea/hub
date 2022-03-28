import { ObjectType } from '@/utils/types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CountDownTimeV1 from '@/components/Base/CountDownTime'
import Link from 'next/link'
import styles from './TopCollections.module.scss'
import { GamefiIcon, RelatingIcon } from '@/components/Base/Icon'

type Props = {
  item: ObjectType;
  isDislayJoin?: boolean
}

export const InfoCollection = ({ item, isDislayJoin }: Props) => {
  const isSoldOut = useMemo(() => {
    return !!(+item.sold_out)
  }, [item.sold_out])
  const [countdown, setCountdown] = useState<{ date1: number; date2: number; title: string } & ObjectType>({ date1: 0, date2: 0, title: '' });
  const handleCountdown = useCallback(() => {
    const now = Date.now();
    const startIn = +item.sale_from && +item.sale_from * 1000;
    const finishIn = +item.sale_to && +item.sale_to * 1000;
    if (startIn > now) {
      setCountdown({ date1: startIn, date2: now, title: 'Sale Starts In' })
    } else if (finishIn > now) {
      setCountdown({ date1: finishIn, date2: now, title: 'Sale Ends In' })
    } else {
      setCountdown({ date1: 0, date2: 0, title: 'Finished', isFinished: true })
    }
  }, [item])
  useEffect(() => {
    handleCountdown()
  }, [handleCountdown])

  return <div className={`${styles.infor} absolute top-1/2 left-1/2 w-full h-full z-10`}>
    <div className="flex  justify-center items-center gap-4 mb-2 relative">
      <GamefiIcon />
      <RelatingIcon />
      <div className='text-left z-10'>
        <img src={item.logo} width="60" height="53" className='object-contain' alt="" />
      </div>
    </div>
    <div className="text-2xl sm:text-4xl font-bold text-center mb-4">
      {item.title || item.name}
    </div>
    <div className="text-base font-bold text-center mb-4 sm:mb-7">
      {item.sale_description || item.description}
    </div>
    {!countdown.isFinished && countdown.date1 > 0 && <CountDownTimeV1 className={styles.countdown} time={countdown} title={countdown.title} />}
    {
      isDislayJoin && <div className='text-center mt-4'>
        <Link href={`/market/collection/${item.slug}`} passHref>
          <a className='w-fit clipped-b-l-t-r bg-gamefiGreen-700 text-lg uppercase text-black font-semibold py-2 px-6 rounded-sm'>Join Now</a>
        </Link>
      </div>
    }
  </div>
}

const Item = ({ item }: Props) => {
  return (
    <div>
      <img src={item.banner} className='absolute w-full h-full object-cover' alt="" />
      <InfoCollection item={item} isDislayJoin />
    </div>
  )
}

export default Item