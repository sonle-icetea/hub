import { useMemo } from 'react'
import { Item } from './types'
import stylesList from './List.module.scss'
import styles from './ListCard.module.scss'
import { TOKEN_TYPE } from './List'
import { useFetch } from '@/utils'
import CardSlim from './CardSlim'

type Props = {
  now: Date;
}

const List = ({ now }: Props) => {
  const url = `/pools/mysterious-box?token_type=${TOKEN_TYPE}&process=only-auction&is_display=1&limit=6`

  const { response, loading } = useFetch(url)
  const items = useMemo<Item[]>(() => {
    return response?.data?.data || []
  }, [response])

  return (
    items && items.length > 0
      ? <div className={`${styles.section} ${styles.black}`}>
        <div className={stylesList.container}>
          <div className={styles.header}>
            <div className={`${styles.heading} font-bold text-2xl sm:text-3xl md:text-4xl`}>AUCTIONS</div>

            <svg viewBox="0 0 118 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M59 18L51.2058 4.5L66.7942 4.5L59 18Z" fill="currentColor"/>
              <path d="M0 5H40L42 7H0V5Z" fill="currentColor"/>
              <path d="M118 5H78L76 7H118V5Z" fill="currentColor"/>
            </svg>
          </div>
          { loading && (
            <div className={stylesList.loaderWrapper}>
              <svg className={stylesList.loader} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          Loading...
            </div>
          ) }
          <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10'}>
            { !loading && items.map(item => {
              return (
                <CardSlim key={item.id} item={item} now={now} />
              )
            }) }
          </div>
        </div>
      </div>
      : <></>
  )
}

export default List
