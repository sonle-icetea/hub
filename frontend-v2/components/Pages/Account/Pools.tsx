import LoadingOverlay from '@/components/Base/LoadingOverlay'
import Pagination from '@/components/Base/Pagination'
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow } from '@/components/Base/Table'
import { useMyWeb3 } from '@/components/web3/context'
import { debounce, fetcher } from '@/utils'
import { API_BASE_URL, TOKEN_TYPE } from '@/utils/constants'
import { formatPoolStatus, formatPoolType } from '@/utils/pool'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Contract, utils } from 'ethers'
import styles from './Pools.module.scss'
import { getCurrency } from '@/components/web3/utils'
import { useRouter } from 'next/router'
import { ObjectType } from '@/utils/types'
import BigNumber from 'bignumber.js'
import ABIPool from '@/components/web3/abis/PreSalePool.json'
import SearchInput from '@/components/Base/SearchInput'
import Dropdown from '@/components/Base/Dropdown'

const Pools = () => {
  const { account, library } = useMyWeb3()
  const router = useRouter()
  const [loadingPools, setLoadingPools] = useState(false)
  const [pools, setPools] = useState({ total: 0, data: [] })
  const poolTypes = useMemo(() => [
    { value: 1000, label: 'All types' },
    { value: 0, label: 'Public' },
    { value: 1, label: 'Private' },
    { value: 2, label: 'Seed' }
  ], [])
  const [filter, setFilter] = useState<ObjectType>({ page: 1, limit: 10, search: '', type: 1000, typeSelected: poolTypes[0], status: '' })


  useEffect(() => {
    if (!account || !library) return
    const getPools = async () => {
      setLoadingPools(true)
      const res = await fetcher(`${API_BASE_URL}/pools/user/${account}/joined-pools?page=${filter.page || 1}&limit=${filter.limit}&title=${filter.search || ''}&type=${filter.type ?? ''}&status=${filter.status || ''}`)
      const getPoolsAllowcation = async (pools: ObjectType[], account: string) => {
        const data = await Promise.all(pools.map((pool) => new Promise(async (resolve) => {
          try {
            const contract = new Contract(pool.campaign_hash, ABIPool, library)
            if (contract) {
              const userPurchased = await contract.userPurchased(account)
              const userClaimed = await contract.userClaimed(account)
              const numToken = parseFloat(utils.formatEther(userPurchased.toString())).toFixed(4)
              const allowcation = new BigNumber(numToken).multipliedBy(pool.token_conversion_rate).toFixed(0)
              pool.allowcation = allowcation
              pool.user_purchased = new BigNumber(userPurchased.toString()).div(new BigNumber(10).pow(pool.decimals)).toFixed()
              pool.user_claimed = new BigNumber(userClaimed.toString()).div(new BigNumber(10).pow(pool.decimals)).toFixed()
            }
          } catch (error) {
            pool.allowcation = 0
          }
          resolve(pool)
        })))
        return data
      }

      const pools = await getPoolsAllowcation(res.data.data || [], account)
      setPools({
        total: +res.data.lastPage || 0,
        data: pools
      })
      // console.log('res', res)
    }
    getPools().catch(console.error).finally(() => setLoadingPools(false))
  }, [account, filter, library])

  useEffect(() => {
    if (!account || !library) {
      setPools({ total: 0, data: [] })
    }
  }, [account, library])

  const allocationAmount = useCallback((pool: any) => {
    if (!pool) return null

    const currency = getCurrency({
      accept_currency: pool.accept_currency,
      network_available: pool.network_available
    })

    let amount = ''
    if (pool.token_type === TOKEN_TYPE.ERC721) {
      const isClaim = pool.process === 'only-claim'
      if (isClaim) {
        amount = pool.user_claimed || 0
      } else {
        amount = pool.user_purchased || 0
      }
      return `${amount} ${pool?.symbol?.toUpperCase() || ''}`
    }
    if (pool.token_type === TOKEN_TYPE.ERC20) {
      return `${pool.allowcation || 0} ${currency?.symbol || ''}`
    }
    return `${pool.allowcation || '-/-'} ${currency?.symbol || ''}`
  }, [])

  const onChangePage = (page: number) => {
    setFilter(f => ({ ...f, page }))
  }

  const onSearchPool = debounce((e: any) => {
    setFilter(f => ({ ...f, search: e.target.value }))
  }, 1000)

  const onFilterPoolType = (item: ObjectType) => {
    setFilter(f => ({ ...f, type: item.value, typeSelected: item }))
  }

  const redirectPool = (pool: any) => {
    switch (pool.token_type) {
      case TOKEN_TYPE.ERC20: {
        window.open(`https://hub.gamefi.org/#/buy-token/${pool.id}`)
        return
      }

      default: {
        router.push(`/ino/${pool.id}`)
      }
    }
  }

  return (
    <div className='py-10 px-9'>
      <div className='flex items-center justify-between'>
        <h3 className='uppercase font-bold text-2xl mb-7'>IGO Pools</h3>
      </div>
      <div className='flex justify-between flex-wrap gap-3 mb-7'>
        <div className='flex gap-3 flex-wrap'>
          <Dropdown
            items={poolTypes}
            propLabel='label'
            propValue='value'
            onChange={onFilterPoolType}
            selected={filter.typeSelected}
            classes={{
              wrapperDropdown: 'w-40'
            }}
          />
        </div>
        <div>
          <SearchInput
            onChange={onSearchPool}
            defaultValue={filter.search}
            placeholder='Search'
            style={{ maxWidth: '320px', width: '100%', height: '38px' }} />
        </div>
      </div>
      <div>
        <Table >
          <LoadingOverlay loading={loadingPools} />
          <TableHead>
            <TableRow>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Pool name</span>
              </TableCellHead>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Type</span>
              </TableCellHead>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Status</span>
              </TableCellHead>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Allocation</span>
              </TableCellHead>
              <TableCellHead className={styles.activityTableCellHead}>
                <span className="text-13px font-bold text-white/50">Action</span>
              </TableCellHead>
            </TableRow>
          </TableHead>
          <TableBody className={styles.activityTableBody}>
            {
              pools.data.map((item, id) => <TableRow key={id}>
                <TableCell className={styles.activityTableCell}>
                  <div className='flex gap-2'>
                    <img src={item.banner} alt="" width={40} height={40} className='object-contain' />
                    <span>{item.title}</span>
                  </div>
                </TableCell>
                <TableCell className={styles.activityTableCell}>
                  {formatPoolType(item.is_private)}
                </TableCell>
                <TableCell className={styles.activityTableCell}>
                  {formatPoolStatus(item.campaign_status)}
                </TableCell>
                <TableCell className={styles.activityTableCell}>
                  {allocationAmount(item)}
                </TableCell>
                <TableCell className={styles.activityTableCell}>
                  <button
                    onClick={() => redirectPool(item)}
                    className={`${styles.btnclippart} block rounded-sm uppercase text-13px font-bold bg-gamefiGreen-700 w-36 text-center p-2 text-black font-mechanic`} >
                    Pool Detail</button>
                </TableCell>
              </TableRow>)
            }
          </TableBody>
        </Table>
        {
          !!pools.total && pools.total > 1 && <Pagination
            className='mt-4 mb-8'
            currentPage={filter.page}
            totalPage={pools.total}
            onChange={onChangePage}
          />
        }
      </div>
    </div>
  )
}

export default Pools
