import { CarouselList } from '@/components/Base/ListSwiper'
import React, { useMemo } from 'react'
import { useFetch } from '@/utils'
import Link from 'next/link'
import ImageLoader from '@/components/Base/ImageLoader'
import { WrapperItem } from '../WrapperContent'

const HotCollections = () => {
  const url = '/marketplace/top-collections?limit=10&page=1'
  const { response, loading } = useFetch(url)
  const hotCollections = useMemo<any[]>(() => {
    return response?.data || []
  }, [response])

  return (
    <div className="md:px-4 lg:px-16 md:container mx-auto mt-20">
      {!loading && hotCollections?.length
        ? <>
          <div className="md:text-lg 2xl:text-3xl uppercase font-bold">
            Hot Collections
          </div>
          <div className="w-full relative bg-gamefiDark-600" style={{ height: '1px' }}>
            <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block" style={{ height: '4px', width: '60px', marginTop: '0', marginLeft: '0' }}></div>
          </div>
          <div className="mt-5">
            <CarouselList>
              {hotCollections.map(collection => (
                <WrapperItem key={collection.id} className="ml-2 mr-2 first:ml-0 last:mr-0">
                  <Link href={`/marketplace/collection/${collection.slug}`} passHref>
                    <div className={'w-full md:px-0 flex flex-col overflow-hidden rounded-sm cursor-pointer hover:underline'} style={{ height: '240px' }}>
                      <div className={'w-full relative'} style={{ height: '150px' }}>
                        <div className="absolute left-0 right-0 mx-auto w-14 -bottom-6 rounded-full border-2 border-gamefiDark-900 bg-gamefiDark-900" style={{ zIndex: '1' }}>
                          <img src={collection.logo} alt="" className="w-14 rounded-full object-cover"></img>
                        </div>
                        <ImageLoader src={collection.banner} alt='' className='object-cover' style={{ width: '100%', height: '150px' }} />
                      </div>
                      <div className="relative bg-gamefiDark-630/30 w-full clipped-b-r-sm" style={{ height: '90px' }}>
                        <div className={'h-full flex items-center align-middle justify-center font-semibold py-4'}>{collection.name}</div>
                      </div>
                    </div>
                  </Link>
                </WrapperItem>
              ))}
            </CarouselList>
          </div>
        </>
        : null}
      {loading && (
        <div className="loader-wrapper">
          <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      )}
    </div>
  )
}

export default HotCollections
