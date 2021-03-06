import React, { useState, useRef, useEffect } from 'react'
import get from 'lodash.get'
import Flicking from '@egjs/react-flicking'
import { AutoPlay, Sync } from '@egjs/flicking-plugins'
import '@egjs/flicking-plugins/dist/pagination.css'
import { fetcher, gtagEvent } from '@/utils'
import arrowRight from '@/assets/images/icons/arrow-right.png'
import arrowLeft from '@/assets/images/icons/arrow-left.png'
import isEmpty from 'lodash.isempty'
import useHubProfile from '@/hooks/useHubProfile'
import ItemCarousel from './ItemCarousel'
import { WrapperSection } from './StyleElement'
import Loading from '../Loading'
import HubTitle from '../HubTitle'
import Link from 'next/link'

export default function TopRatingHub ({ listFavorite, setListFavorite, getListFavoriteByUser, clearFavorite }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [chunkData, setChunkData] = useState([])
  const [plugins, setPlugins] = useState([])

  const refSlider = useRef(null)
  const refSlider1 = useRef(null)
  const { accountHub } = useHubProfile()

  useEffect(() => {
    setPlugins([new Sync({
      type: 'index',
      synchronizedFlickingOptions: [
        {
          flicking: refSlider.current,
          isSlidable: true
        },
        {
          flicking: refSlider1.current,
          isClickable: true,
          activeClass: 'thumbnail-bullet-active'
        }
      ]
    }),
    new AutoPlay({ duration: 300000, direction: 'NEXT', stopOnHover: true })
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prev = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.prev().catch(() => { })
  }
  const next = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.next().catch(() => { })
  }

  useEffect(() => {
    if (!isEmpty(data) && !isEmpty(accountHub)) {
      getListFavoriteByUser(data, setLoading, accountHub?.id, 'rating')
    }
    // } else setListFavorite({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHub?.id, data])

  const getData = (time: string) => {
    setLoading(true)
    fetcher('/api/hub/home', {
      method: 'POST', body: JSON.stringify({ query: 'GET_RATING_AGGREGATORS', variables: { filtersValue: `interactivePoint${time}:desc` } })
    }).then(({ data }) => {
      setLoading(false)
      const formatData = data?.aggregators?.data?.map(v => {
        const d = v.attributes
        return { ...d, id: v.id, verticalThumbnail: get(d, 'verticalThumbnail.data.attributes', {}), tokenomic: get(d, 'project.data.attributes.tokenomic', {}) }
      }) || []
      const chunk = []
      const chunkSize = 5
      for (let i = 0; i < formatData.length; i += chunkSize) {
        chunk.push(formatData.slice(i, i + chunkSize))
      }
      setData(formatData)
      setChunkData(chunk)
    }).catch((err) => {
      setLoading(false)
      console.debug('err', err)
    })
  }

  return (
    <div className="xl:mb-14">
      <div className="relative">
        <div className="xl:hidden">
          < HubTitle title="Top rating" showFilterTime getData={getData} source="rating" />
          <WrapperSection><div className="flex w-full overflow-x-auto hide-scrollbar">
            {
              data?.map((item, i) => (
                <ItemCarousel listFavorite={listFavorite} setListFavorite={setListFavorite} clearFavorite={clearFavorite} item={item} index={`TopRatingHub-${i}`} key={`TopRatingHub-${i}`} defaultFavorite={!!listFavorite[item.id]} disabled={loading} />
              ))
            }
          </div>
          </WrapperSection>
        </div>

        <div className="hidden xl:block">
          <div className="flex flex-row">
            <div className="flex-1 mr-2">
              < HubTitle title="Top rating" showFilterTime getData={getData} source="rating" hideViewAll />
            </div>
            <div className="max-w-[162px] flex items-end justify-end mb-7 flex-col">
              <Link href="/hub/list?sort=rate:desc" passHref>
                <a
                  className="font-casual text-gamefiGreen-700 hover:text-gamefiGreen-200 py-2 pl-2 leading-5 font-semibold text-sm"
                  onClick={() => {
                    gtagEvent('hub_all_rating')
                  }}
                >
                  View All
                </a>
              </Link>
              <Flicking ref={refSlider1} bound={true} bounce={30}>
                {
                  chunkData.map((v, i) => (
                    <div className="h-[1px] border w-[46px] bg-white mr-2" key={`ChunkTrendingHub-${i}`}></div>
                  ))
                }
              </Flicking>
            </div>
          </div>
          <div className="flex mt-8 gap-4 -mx-[50px]">
            <div className="hidden sm:block">
              <img src={arrowLeft.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={prev} />
            </div>
            <Flicking circular={true} className="flex-1" plugins={plugins} align="center" ref={refSlider} interruptable={true}>
              {
                chunkData.map((v, i) => (
                  <div className="w-full mb-8 flex" key={`ChunkTrendingHub-${i}`}>
                    {v.map((item, i) => (
                      <ItemCarousel listFavorite={listFavorite} setListFavorite={setListFavorite} clearFavorite={clearFavorite} defaultFavorite={!!listFavorite[item.id]} disabled={loading} item={item} index={`TopRatingHub-${i}`} key={`TopRatingHub-${i}`} />
                    ))}
                  </div>
                ))
              }
            </Flicking>
            <div className="hidden sm:block">
              <img src={arrowRight.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={next} />
            </div>
          </div>
        </div>
        {loading && <Loading isPart />}
      </div>
    </div>
  )
}
