/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

type Props = {
  item?: any,
  color?: string,
  className?: string,
  countdownStatus?: string
}
const PoolBanner = ({ item, color = 'green', className, countdownStatus } : Props) => {
  const [distance, setDistance] = useState(0)
  const [days, setDays] = useState('00')
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')

  useEffect(() => {
    if (countdownStatus) {
      return
    }
    const interval = setInterval(() => {
      setDistance(new Date(item.start_time * 1000).getTime() - new Date().getTime())
      setDays(distance > 0 ? ('0' + Math.floor(distance / (1000 * 60 * 60 * 24)).toString()).slice(-2) : '00')
      setHours(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString()).slice(-2) : '00')
      setMinutes(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()).slice(-2) : '00')
      setSeconds(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60)) / 1000).toString()).slice(-2) : '00')
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [item.start_time, distance, countdownStatus])

  const poolStatus = (status: any) => {
    switch (status) {
    case 1:
      return 'private'
    case 2:
      return 'community'
    case 0:
    default:
      return 'public'
    }
  }

  return (
    <>
      <div className={`w-full px-3 lg:px-0 ${className}`}>
        <div className="flex flex-col clipped-b-l rounded-tr overflow-hidden">
          <div className="w-full h-full relative overflow-hidden">
            <div className="absolute h-7 w-36 flex align-middle items-center justify-center top-0 left-0 uppercase font-medium tracking-widest md:text-xs xl:text-sm text-left bg-gamefiDark-900 clipped-b-r-full">
              <Image src={require('assets/images/icons/lock.svg')} alt="lock"></Image>
              <span className="ml-2 font-bold">{poolStatus(item.is_private)}</span>
            </div>
            <img src={item.banner} alt="banner" className="w-full" style={{ height: '220px' }}></img>
            <div className={`relative w-full h-24 flex align-middle items-center justify-center uppercase font-bold md:text-lg xl:text-2xl ${color === 'yellow' && 'bg-gamefiYellow'} ${(!color || color === 'green') && 'bg-gamefiGreen-700'}`}>
              {/* <div
                className={`absolute -top-7 right-0 ${color ? `bg-${color}` : 'bg-gamefiGreen'} text-gamefiDark-900 h-12 w-2/3 flex pt-2 justify-center text-center text-sm font-semibold clipped-t-l-full uppercase`}
              >
                BUY NFT GET BONUS IGO TICKET
              </div> */}
              <div className={'px-8 overflow-hidden overflow-ellipsis text-gamefiDark-900'}>{item.title}</div>
            </div>
          </div>
        </div>
        {countdownStatus
          ? <div className={`w-full relative ${color === 'yellow' && 'text-gamefiYellow'} ${(!color || color === 'green') && 'text-gamefiGreen-700'}`}>
            <div className="w-full h-full flex flex-col align-middle items-center justify-center absolute">
              <div className="uppercase font-bold text-xl">{countdownStatus}</div>
            </div>
            <Image src={require(`assets/images/countdown-box-${color || 'green'}.png`)} alt="countdown" className="w-full h-auto"></Image>
          </div>
          : <div className={`w-full relative ${color === 'yellow' && 'text-gamefiYellow'} ${(!color || color === 'green') && 'text-gamefiGreen-700'}`}>
            {item.start_time
              ? (
                <div className="w-full h-full flex flex-col align-middle items-center justify-center absolute mt-1">
                  <div className="uppercase font-semibold text-sm 2xl:text-base">Countdown to IGO date</div>
                  <div className="uppercase font-bold mt-2 flex tracking-widest">
                    <div className="flex flex-col text-center w-10">
                      <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{days}</div>
                      <div className="text-xs 2xl:text-sm uppercase">days</div>
                    </div>
                    <span className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6 mx-1">:</span>
                    <div className="flex flex-col text-center w-10">
                      <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{hours}</div>
                      <div className="text-xs 2xl:text-sm uppercase">hrs</div>
                    </div>

                    <span className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6 mx-1">:</span>
                    <div className="flex flex-col text-center w-10">
                      <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{minutes}</div>
                      <div className="text-xs 2xl:text-sm uppercase">min</div>
                    </div>

                    <span className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6 mx-1">:</span>
                    <div className="flex flex-col text-center w-10">
                      <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{seconds}</div>
                      <div className="text-xs 2xl:text-sm uppercase">sec</div>
                    </div>
                  </div>
                </div>
              )
              : (
                <div className="w-full h-full flex flex-col align-middle items-center justify-center absolute">
                  <div className="uppercase font-bold text-2xl 2xl:text-3xl">Coming Soon</div>
                </div>
              )}
            <Image src={require(`assets/images/countdown-box-${color || 'green'}.png`)} alt="countdown" className="w-full h-auto"></Image>
          </div>}
      </div>
    </>
  )
}

export default PoolBanner