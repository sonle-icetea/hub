import { useFetch } from '@/utils'
import React, { useMemo, useState } from 'react'
import Dropdown from '@/components/Base/Dropdown'
import SearchInput from '@/components/Base/SearchInput'
import Card from './Card'
import Pagination from '../Pagination'

const PER_PAGE = 10

const CompletedPools = () => {
  const [page, setPage] = useState(1)
  const { response, loading } = useFetch(`/pools/complete-sale-pools?token_type=erc20&limit=${PER_PAGE}&page=${page}`)

  const pools = useMemo(() => {
    return response?.data?.data || []
  }, [response])

  const lastPage = useMemo(() => {
    return Math.ceil((Number(response?.data?.total) || 0) / PER_PAGE) || 1
  }, [])

  const data = useMemo(() => {
    return {
      page: page,
      lastPage: lastPage,
      items: pools.filter((item, i) => (i >= (page - 1) * PER_PAGE && i < page * PER_PAGE))
    }
  }, [lastPage, page, pools])

  return <div className="relative bg-black w-full pb-20">
    <div className="absolute left-0 top-0 h-14 w-1/3">
      <div className="inline-block uppercase bg-gamefiDark-900 w-full h-full clipped-b-r-full p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
      </div>
    </div>
    <div className="px-4 2xl:px-0 max-w-[1180px] mx-auto mt-20 relative">
      <div className="w-full flex items-center justify-between">
        <div className="h-14 flex items-center font-bold text-lg lg:text-2xl uppercase clipped-b-r-full bg-gamefiDark pr-4">Completed Projects</div>
        <div className="h-14 flex gap-2 items-center">
          <Dropdown></Dropdown>
          <Dropdown></Dropdown>
          <SearchInput></SearchInput>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 mt-12">
        {pools?.length > 0 && pools.map(pool => <div key={pool.id}>
          <Card item={pool}></Card>
        </div>)}
      </div>
      <div className="mt-6 flex justify-end">
        <Pagination page={data.page} pageLast={data.lastPage} setPage={setPage} />
      </div>
    </div>
  </div>
}

export default CompletedPools