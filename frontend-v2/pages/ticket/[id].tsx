import React from 'react'
import Layout from '@/components/Layout'
import useGetPoolDetail from '@/hooks/useGetPoolDetail'
import AuctionDetail from '@/components/Pages/Ticket/AuctionDetail'
import MysteryBoxDetail from '@/components/Pages/Ticket/MysteryBoxDetail'
import { isAuctionBox, isMysteryBox } from '@/components/Pages/Ticket/utils'
import LoadingOverlay from '@/components/Base/LoadingOverlay'
import NotFound from '@/components/Pages/Notfound'

const TicketDetail = (props: any) => {
  const { loading, poolInfo } = useGetPoolDetail({ id: props?.id })
  const renderContent = () => {
    if (isAuctionBox(poolInfo.process)) {
      return <AuctionDetail poolInfo={poolInfo} />
    }
    if (isMysteryBox(poolInfo.token_type)) {
      return <MysteryBoxDetail poolInfo={poolInfo} />
    }
    return <NotFound backLink='/igo' />
  }
  return <Layout title="GameFi.org - Ticket Sale" description="">
    {
      loading
        ? <>
          <LoadingOverlay loading></LoadingOverlay>
          <div className='h-52 w-full'></div>
        </>
        : (
          !poolInfo
            ? <NotFound backLink='/igo' />
            : renderContent()
        )
    }
  </Layout>
}

export default TicketDetail

export function getServerSideProps ({ params }) {
  if (!params?.id) {
    return { props: { id: '' } }
  }

  return { props: { id: params.id } }
}
