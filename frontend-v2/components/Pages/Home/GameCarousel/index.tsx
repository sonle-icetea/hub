import React from 'react'
import Image from 'next/image'
import { Carousel } from 'react-responsive-carousel'
import { useMediaQuery } from 'react-responsive'
import Link from 'next/link'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

type Props = {
  items?: any[];
  likes?: any[];
}

const GameCarousel = ({ items, likes }: Props) => {
  const isMobile = useMediaQuery({ maxWidth: '1000px' })
  const getLikeById = (id: any) => {
    return likes && likes.find(item => item.game_id === id)
  }

  return (
    !isMobile
      ? <Carousel
        showStatus={false}
        showIndicators={false}
        autoPlay={true}
        stopOnHover={true}
        showThumbs={true}
        thumbWidth={170}
        swipeable={true}
        infiniteLoop={items?.length > 1}
        interval={3000}
        renderThumbs={() => {
          return items && items.length > 1 && items.map((item) => {
            return <img key={`thumb-${item.id}`} src={item.screen_shots_1} alt="img" />
          })
        }}
        renderArrowPrev={(onClickHandler, hasPrev, label) => {
          return (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{ position: 'absolute', zIndex: '2', top: 'calc(50% - 170px)', cursor: 'pointer', left: '0', opacity: !hasPrev && '50%' }}
            >
              <Image src={require('@/assets/images/icons/arrow-left.png')} alt="left" width={32} height={300}/>
            </button>
          )
        }
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{ position: 'absolute', zIndex: '2', top: 'calc(50% - 170px)', cursor: 'pointer', right: '0', opacity: !hasNext && '50%' }}
            >
              <Image src={require('@/assets/images/icons/arrow-right.png')} alt="right" width={32} height={300}/>
            </button>
          )
        }
      >
        {items.map(item => (
          <div key={`game-${item.id}`} className="px-14 mx-auto grid grid-cols-12 gap-4">
            <div className="col-span-7 xl:col-span-8 relative">
              <div className="absolute z-10 top-0 left-0 uppercase font-medium tracking-widest md:text-xs xl:text-sm text-left bg-gamefiDark-900 w-1/2 md:pb-1 lg:pb-2 clipped-b-r-full inline-block">
                <span className="text-gamefiGreen-500">Featured</span> games
              </div>
              <video className="clipped-t-r-lg" style={{ aspectRatio: '16/9', objectFit: 'fill' }} muted controls controlsList="nodownload" poster={item.screen_shots_1}>
                <source src={item.intro_video} type="video/mp4"></source>
              Your browser does not support the video tag.
              </video>
            </div>
            <div className="col-span-5 xl:col-span-4 2xl:pt-14 w-full px-4">
              <div className="lg:text-lg xl:text-xl 2xl:text-3xl font-bold uppercase text-left">{item.game_name}</div>
              <div className="flex align-middle items-center w-full mt-3 xl:mt-5">
                <div className="flex align-middle items-center text-sm">
                  <Image src={require('@/assets/images/icons/heart.svg')} alt="heart"/>
                  <p className="ml-2 tracking-widest text-gray-200">{getLikeById(item.id)?.total_like || 0}</p>
                </div>
                <div className="flex align-middle items-center ml-4 text-left">
                  <Image src={require('@/assets/images/icons/game-console.svg')} alt="game-console"/>
                  <p
                    className="ml-2 tracking-widest uppercase text-gray-200 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis text-left"
                    style={{ maxWidth: '180px' }}
                  >{item.developer}</p>
                </div>
              </div>
              <div className="mt-3 xl:mt-5">
                <p className="font-casual text-left leading-5 md:text-xs lg:text-base text-gray-300 max-h-24 2xl:max-h-32 overflow-y-scroll">{item.short_description}</p>
              </div>
              <div className="mt-3 xl:mt-5">
                <Link href={`/hub/${item?.slug}`} passHref>
                  <div className="bg-gamefiGreen-500 text-gamefiDark-900 py-2 px-6 rounded-xs clipped-t-r hover:opacity-90 w-36 cursor-pointer">
                    <a className="flex align-middle items-center">
                      <div className="mr-2 uppercase font-bold text-xs">View more</div>
                      <Image src={require('@/assets/images/icons/arrow-right-dark.svg')} alt="right" />
                    </a>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
      : <Carousel
        key="mobile"
        showStatus={false}
        showIndicators={false}
        showArrows={false}
        // autoPlay={true}
        // stopOnHover={true}
        showThumbs={true}
        thumbWidth={170}
        swipeable={true}
        // dynamicHeight={true}
        infiniteLoop={true}
        interval={5000}

        renderThumbs={() => {
          return items && items.length > 1 && items.map((item) => {
            return <img key={`thumb-mobile-${item.id}`} src={item.screen_shots_1} alt="img" />
          })
        }}
      >
        {items.map(item => (
          <div key={`mobile-game-${item.id}`}>
            <div className="w-full">
              <div className="absolute z-10 top-0 left-0 uppercase font-medium tracking-widest md:text-xs xl:text-sm text-center md:text-left bg-gamefiDark-900 w-1/2 md:pb-1 lg:pb-2 clipped-b-r-full inline-block"><span className="text-gamefiGreen-500">Featured</span> games</div>
              <video key={`video-${item.id}`} className='clipped-t-r-lg' style={{ aspectRatio: '16/9', objectFit: 'fill' }} muted controls controlsList="nodownload" poster={item.screen_shots_1}>
                <source src={item.intro_video} type="video/mp4"></source>
              </video>
            </div>
            <div className="w-full my-4 px-8">
              <div className="lg:text-lg xl:text-xl 2xl:text-3xl font-bold uppercase text-left">{item.game_name}</div>
              <div className="flex align-middle items-center w-full mt-3 xl:mt-5">
                <div className="flex align-middle items-center text-sm">
                  <Image src={require('@/assets/images/icons/heart.svg')} alt="heart"/>
                  <p className="ml-2 tracking-widest text-gray-200">{getLikeById(item.id)?.total_like || 0}</p>
                </div>
                <div className="flex align-middle items-center ml-4">
                  <Image src={require('@/assets/images/icons/game-console.svg')} alt="game-console"/>
                  <p
                    className="ml-2 tracking-widest uppercase text-gray-200 whitespace-nowrap overflow-hidden overflow-ellipsis"
                  >{item.developer}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="font-casual text-left leading-5 md:text-xs lg:text-base text-gray-300 max-h-24 overflow-y-scroll">{item.short_description}</p>
              </div>
              <div className="mt-3">
                <Link href={`/hub/${item?.slug}`} passHref>
                  <button className="bg-gamefiGreen-500 text-gamefiDark-900 py-2 px-6 flex align-middle items-center rounded-xs clipped-t-r hover:opacity-90">
                    <div className="mr-2 uppercase font-bold text-xs">View more</div>
                    <Image src={require('@/assets/images/icons/arrow-right-dark.svg')} alt="right" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
  )
}

export default GameCarousel
