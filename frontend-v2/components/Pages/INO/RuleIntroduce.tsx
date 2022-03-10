import { ObjectType } from '@/utils/types'
// import { MediumIcon, TelegramIcon, TwitterIcon } from '@/components/Base/Icon'
import React from 'react'

type Props = {
  poolInfo: ObjectType;
}
const RuleIntroduce = ({ poolInfo }: Props) => {
  const getRules = (rule = '') => {
    if (typeof rule !== 'string') return []
    return rule.split('\n').filter((r) => r.trim())
  }
  return <div>
    <div style={{ maxWidth: '780px' }}>
      <div className="desc mb-6">
        <ul className={'grid gap-2 font-casual text-sm'}>
          {getRules(poolInfo.rule).map((rule, idx) => (
            <li key={idx} className='flex'>
              <div className='flex'><span className='font-bold'>{idx + 1}</span>&nbsp;-&nbsp;</div>
              <div>
                {rule}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={'grid gap-4'}>
        <div className="item-group flex gap-x-4 items-center font-casual text-sm">
          <label className="text-white w-20 font-bold">Website</label>
          <div className="flex">
            <a href={poolInfo.website} target={'_blank'} className="flex gap-1 bg-white/10 rounded px-2 py-1 text-white" rel="noreferrer">
              {poolInfo.website}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8424 3.67302L10.3071 0.155337C10.1543 0.00325498 9.92514 -0.041861 9.72652 0.0409337C9.52755 0.123537 9.39803 0.317727 9.39803 0.533053V2.12986C7.64542 2.24568 6.77025 2.97233 6.61213 3.11711C4.41287 4.94753 4.65609 7.44348 4.73 7.94006C4.73106 7.94717 4.73213 7.95444 4.73336 7.96155L4.80442 8.37017C4.84262 8.58976 5.013 8.76227 5.23188 8.80295C5.26455 8.809 5.29725 8.812 5.3296 8.812C5.51455 8.812 5.68919 8.7157 5.78653 8.55315L5.99953 8.19818C7.16391 6.26169 8.60278 5.9499 9.398 5.94722V7.60391C9.398 7.81975 9.52823 8.01413 9.72792 8.09655C9.9276 8.17879 10.157 8.13261 10.309 7.97982L13.8444 4.42665C14.0519 4.21807 14.051 3.88052 13.8424 3.67302ZM10.4642 6.3125V5.45422C10.4642 5.19252 10.2745 4.96957 10.0161 4.92801C9.40106 4.82905 7.46526 4.70984 5.79348 6.6609C5.90132 5.86462 6.25806 4.79441 7.30412 3.92829C7.31692 3.91763 7.32135 3.91407 7.33308 3.90234C7.3409 3.89507 8.13576 3.18016 9.8777 3.18016H9.931C10.2254 3.18016 10.464 2.94156 10.464 2.64719V1.81522L12.7128 4.05251L10.4642 6.3125Z" fill="#6CDB00" />
                <path d="M11.9032 10.3399C11.6089 10.3399 11.3703 10.5785 11.3703 10.8729V12.383H1.06597V4.56594H4.26385C4.55822 4.56594 4.79682 4.32735 4.79682 4.03297C4.79682 3.7386 4.55822 3.5 4.26385 3.5H0.53297C0.238595 3.49997 0 3.73857 0 4.03294V12.916C0 13.2103 0.238595 13.4489 0.53297 13.4489H11.9032C12.1976 13.4489 12.4362 13.2103 12.4362 12.916V10.8729C12.4362 10.5785 12.1976 10.3399 11.9032 10.3399Z" fill="#6CDB00" />
              </svg>
            </a>
          </div>
        </div>
        <div className="item-group flex gap-x-4 items-center font-casual text-sm">
          <label className="text-white w-20 font-bold">Social</label>
          <div className="flex gap-x-4">
            {poolInfo?.socialNetworkSetting?.telegram_link && <a href={poolInfo?.socialNetworkSetting?.telegram_link} className="p-2" target="_blank" rel="noopenner noreferrer">
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.9683 0.684219C15.9557 0.625173 15.9276 0.570567 15.8868 0.526075C15.846 0.481584 15.794 0.44883 15.7363 0.431219C15.526 0.389298 15.3084 0.404843 15.1063 0.476219C15.1063 0.476219 1.08725 5.51422 0.286252 6.07222C0.114252 6.19322 0.056252 6.26222 0.027252 6.34422C-0.110748 6.74422 0.320252 6.91722 0.320252 6.91722L3.93325 8.09422C3.99426 8.10522 4.05701 8.10145 4.11625 8.08322C4.93825 7.56422 12.3863 2.86122 12.8163 2.70322C12.8843 2.68322 12.9343 2.70322 12.9163 2.75222C12.7443 3.35222 6.31025 9.07122 6.27525 9.10622C6.25818 9.12048 6.2448 9.13866 6.23627 9.15921C6.22774 9.17975 6.2243 9.20206 6.22625 9.22422L5.88925 12.7522C5.88925 12.7522 5.74725 13.8522 6.84525 12.7522C7.62425 11.9732 8.37225 11.3272 8.74525 11.0142C9.98725 11.8722 11.3243 12.8202 11.9013 13.3142C11.9979 13.4083 12.1125 13.4819 12.2383 13.5305C12.3641 13.5792 12.4985 13.6018 12.6333 13.5972C12.7992 13.5767 12.955 13.5062 13.0801 13.3952C13.2051 13.2841 13.2934 13.1376 13.3333 12.9752C13.3333 12.9752 15.8943 2.70022 15.9793 1.31722C15.9873 1.18222 16.0003 1.10022 16.0003 1.00022C16.0039 0.893924 15.9931 0.787623 15.9683 0.684219Z" fill="white" />
              </svg>
            </a>}

            {poolInfo?.socialNetworkSetting?.twitter_link && <a href={poolInfo?.socialNetworkSetting?.twitter_link} className="p-2" target="_blank" rel="noopenner noreferrer">
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C15.4 2.3 14.8 2.4 14.1 2.5C14.8 2.1 15.3 1.5 15.5 0.7C14.9 1.1 14.2 1.3 13.4 1.5C12.8 0.9 11.9 0.5 11 0.5C9.3 0.5 7.8 2 7.8 3.8C7.8 4.1 7.8 4.3 7.9 4.5C5.2 4.4 2.7 3.1 1.1 1.1C0.8 1.6 0.7 2.1 0.7 2.8C0.7 3.9 1.3 4.9 2.2 5.5C1.7 5.5 1.2 5.3 0.7 5.1C0.7 6.7 1.8 8 3.3 8.3C3 8.4 2.7 8.4 2.4 8.4C2.2 8.4 2 8.4 1.8 8.3C2.2 9.6 3.4 10.6 4.9 10.6C3.8 11.5 2.4 12 0.8 12C0.5 12 0.3 12 0 12C1.5 12.9 3.2 13.5 5 13.5C11 13.5 14.3 8.5 14.3 4.2C14.3 4.1 14.3 3.9 14.3 3.8C15 3.3 15.6 2.7 16 2Z" fill="white" />
              </svg>
            </a>}

            {poolInfo?.socialNetworkSetting?.medium_link && <a href={poolInfo?.socialNetworkSetting?.medium_link} className="p-2" target="_blank" rel="noopenner noreferrer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" fill="white" />
              </svg>
            </a>}
          </div>
        </div>
        {
          poolInfo.aggregatorLink && <a href={poolInfo.aggregatorLink} className="flex gap-1 items-center text-gamefiGreen-700 font-semibold bg-white/10 rounded px-3 py-2 w-fit text-sm font-casual">
            Full Research
            <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1_1201_9307" fill="white">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.1147 0.200811C0.859705 -0.0669364 0.446277 -0.0669373 0.191283 0.200811C-0.0637118 0.468558 -0.0637113 0.902662 0.191283 1.17041L3.42281 4.56355L0.191246 7.95672C-0.0637486 8.22447 -0.0637486 8.65857 0.191246 8.92632C0.446241 9.19407 0.859668 9.19407 1.11466 8.92632L4.78775 5.06953C4.79473 5.06281 4.8016 5.0559 4.80837 5.0488C4.94373 4.90666 5.00724 4.71764 4.99888 4.53152C4.99168 4.36674 4.92816 4.20416 4.80833 4.07833C4.80187 4.07156 4.79532 4.06495 4.78867 4.05852L1.1147 0.200811ZM5.1147 0.200811C4.85971 -0.0669364 4.44628 -0.0669373 4.19128 0.200811C3.93629 0.468558 3.93629 0.902662 4.19128 1.17041L7.42281 4.56355L4.19125 7.95672C3.93625 8.22447 3.93625 8.65857 4.19125 8.92632C4.44624 9.19407 4.85967 9.19407 5.11466 8.92632L8.78775 5.06953C8.79473 5.06281 8.8016 5.0559 8.80837 5.0488C8.94373 4.90666 9.00724 4.71764 8.99888 4.53152C8.99168 4.36674 8.92816 4.20416 8.80833 4.07833C8.80187 4.07156 8.79532 4.06495 8.78867 4.05852L5.1147 0.200811Z" />
              </mask>
              <path fillRule="evenodd" clipRule="evenodd" d="M1.1147 0.200811C0.859705 -0.0669364 0.446277 -0.0669373 0.191283 0.200811C-0.0637118 0.468558 -0.0637113 0.902662 0.191283 1.17041L3.42281 4.56355L0.191246 7.95672C-0.0637486 8.22447 -0.0637486 8.65857 0.191246 8.92632C0.446241 9.19407 0.859668 9.19407 1.11466 8.92632L4.78775 5.06953C4.79473 5.06281 4.8016 5.0559 4.80837 5.0488C4.94373 4.90666 5.00724 4.71764 4.99888 4.53152C4.99168 4.36674 4.92816 4.20416 4.80833 4.07833C4.80187 4.07156 4.79532 4.06495 4.78867 4.05852L1.1147 0.200811ZM5.1147 0.200811C4.85971 -0.0669364 4.44628 -0.0669373 4.19128 0.200811C3.93629 0.468558 3.93629 0.902662 4.19128 1.17041L7.42281 4.56355L4.19125 7.95672C3.93625 8.22447 3.93625 8.65857 4.19125 8.92632C4.44624 9.19407 4.85967 9.19407 5.11466 8.92632L8.78775 5.06953C8.79473 5.06281 8.8016 5.0559 8.80837 5.0488C8.94373 4.90666 9.00724 4.71764 8.99888 4.53152C8.99168 4.36674 8.92816 4.20416 8.80833 4.07833C8.80187 4.07156 8.79532 4.06495 8.78867 4.05852L5.1147 0.200811Z" fill="#6CDB00" />
              <path d="M0.191283 0.200811L1.09646 1.06288L1.09646 1.06287L0.191283 0.200811ZM1.1147 0.200811L2.01988 -0.661254L2.01988 -0.661254L1.1147 0.200811ZM0.191283 1.17041L-0.713894 2.03247L0.191283 1.17041ZM3.42281 4.56355L4.32799 5.42561L5.14899 4.56355L4.32799 3.70148L3.42281 4.56355ZM0.191246 7.95672L1.09642 8.81879L0.191246 7.95672ZM0.191246 8.92632L-0.713933 9.78838L-0.71393 9.78839L0.191246 8.92632ZM1.11466 8.92632L2.01984 9.78838H2.01984L1.11466 8.92632ZM4.78775 5.06953L3.92051 4.16932L3.90113 4.18799L3.88258 4.20747L4.78775 5.06953ZM4.80837 5.0488L3.90319 4.18673L3.90316 4.18676L4.80837 5.0488ZM4.99888 4.53152L3.75007 4.58608L3.75014 4.58758L4.99888 4.53152ZM4.80833 4.07833L3.90314 4.94039L3.90315 4.9404L4.80833 4.07833ZM4.78867 4.05852L3.88349 4.92058L3.90119 4.93916L3.91963 4.957L4.78867 4.05852ZM4.19128 0.200811L5.09646 1.06288L5.09646 1.06287L4.19128 0.200811ZM5.1147 0.200811L6.01988 -0.661254V-0.661254L5.1147 0.200811ZM4.19128 1.17041L3.28611 2.03247L4.19128 1.17041ZM7.42281 4.56355L8.32798 5.42561L9.14899 4.56355L8.32798 3.70148L7.42281 4.56355ZM4.19125 7.95672L3.28607 7.09466L3.28607 7.09466L4.19125 7.95672ZM4.19125 8.92632L3.28607 9.78838L3.28607 9.78839L4.19125 8.92632ZM5.11466 8.92632L4.20949 8.06425L4.20948 8.06426L5.11466 8.92632ZM8.78775 5.06953L7.92051 4.16932L7.90113 4.18799L7.88258 4.20747L8.78775 5.06953ZM8.80837 5.0488L7.90319 4.18674L7.90316 4.18676L8.80837 5.0488ZM8.99888 4.53152L7.75007 4.58608L7.75014 4.58758L8.99888 4.53152ZM8.80833 4.07833L9.71351 3.21627L9.71345 3.21621L8.80833 4.07833ZM8.78867 4.05852L7.88349 4.92058L7.9012 4.93918L7.91966 4.95703L8.78867 4.05852ZM1.09646 1.06287C0.858842 1.31238 0.447138 1.31237 0.209523 1.06287L2.01988 -0.661254C1.27227 -1.44625 0.0337131 -1.44625 -0.713895 -0.661252L1.09646 1.06287ZM1.09646 0.308344C1.30123 0.523354 1.30123 0.847864 1.09646 1.06288L-0.713893 -0.661254C-1.42865 0.0892511 -1.42865 1.28197 -0.713894 2.03247L1.09646 0.308344ZM4.32799 3.70148L1.09646 0.308344L-0.713894 2.03247L2.51763 5.42561L4.32799 3.70148ZM1.09642 8.81879L4.32799 5.42561L2.51763 3.70148L-0.713931 7.09466L1.09642 8.81879ZM1.09642 8.06426C1.30119 8.27927 1.30119 8.60378 1.09642 8.81879L-0.713931 7.09466C-1.42869 7.84516 -1.42869 9.03788 -0.713933 9.78838L1.09642 8.06426ZM0.209486 8.06425C0.447101 7.81476 0.858803 7.81475 1.09642 8.06425L-0.71393 9.78839C0.033678 10.5734 1.27224 10.5734 2.01984 9.78838L0.209486 8.06425ZM3.88258 4.20747L0.209485 8.06425L2.01984 9.78838L5.69293 5.9316L3.88258 4.20747ZM3.90316 4.18676C3.90877 4.18087 3.91456 4.17505 3.92051 4.16932L5.655 5.96975C5.67491 5.95057 5.69443 5.93093 5.71357 5.91084L3.90316 4.18676ZM3.75014 4.58758C3.74429 4.45721 3.78802 4.30766 3.90319 4.18673L5.71354 5.91086C6.09945 5.50566 6.27019 4.97807 6.24762 4.47545L3.75014 4.58758ZM3.90315 4.9404C3.80132 4.83347 3.7552 4.70331 3.75007 4.58608L6.24769 4.47695C6.22817 4.03016 6.05501 3.57485 5.7135 3.21627L3.90315 4.9404ZM3.91963 4.957C3.91398 4.95153 3.90848 4.94599 3.90314 4.94039L5.71351 3.21628C5.69527 3.19712 5.67666 3.17837 5.65771 3.16004L3.91963 4.957ZM0.209523 1.06287L3.88349 4.92058L5.69385 3.19646L2.01988 -0.661254L0.209523 1.06287ZM5.09646 1.06287C4.85884 1.31238 4.44714 1.31237 4.20952 1.06287L6.01988 -0.661254C5.27227 -1.44625 4.03371 -1.44625 3.2861 -0.661252L5.09646 1.06287ZM5.09646 0.308344C5.30123 0.523353 5.30123 0.847864 5.09646 1.06288L3.28611 -0.661255C2.57135 0.0892513 2.57135 1.28197 3.28611 2.03247L5.09646 0.308344ZM8.32798 3.70148L5.09646 0.308344L3.28611 2.03247L6.51763 5.42561L8.32798 3.70148ZM5.09642 8.81879L8.32798 5.42561L6.51763 3.70148L3.28607 7.09466L5.09642 8.81879ZM5.09642 8.06426C5.30119 8.27927 5.30119 8.60378 5.09642 8.81879L3.28607 7.09466C2.57131 7.84516 2.57131 9.03788 3.28607 9.78838L5.09642 8.06426ZM4.20948 8.06426C4.4471 7.81475 4.8588 7.81475 5.09642 8.06425L3.28607 9.78839C4.03368 10.5734 5.27224 10.5734 6.01984 9.78838L4.20948 8.06426ZM7.88258 4.20747L4.20949 8.06425L6.01984 9.78838L9.69293 5.9316L7.88258 4.20747ZM7.90316 4.18676C7.90877 4.18087 7.91456 4.17505 7.92051 4.16932L9.655 5.96975C9.67491 5.95057 9.69443 5.93093 9.71357 5.91084L7.90316 4.18676ZM7.75014 4.58758C7.74429 4.45721 7.78802 4.30766 7.90319 4.18674L9.71354 5.91086C10.0994 5.50566 10.2702 4.97808 10.2476 4.47545L7.75014 4.58758ZM7.90315 4.94039C7.80132 4.83347 7.7552 4.70331 7.75007 4.58608L10.2477 4.47695C10.2282 4.03016 10.055 3.57486 9.71351 3.21627L7.90315 4.94039ZM7.91966 4.95703C7.91397 4.95152 7.90848 4.94599 7.90321 4.94045L9.71345 3.21621C9.69527 3.19712 9.67668 3.17838 9.65768 3.16001L7.91966 4.95703ZM4.20952 1.06287L7.88349 4.92058L9.69385 3.19646L6.01988 -0.661254L4.20952 1.06287Z" fill="#6CDB00" mask="url(#path-1-inside-1_1201_9307)" />
            </svg>
          </a>
        }

      </div>
    </div>

  </div>
}

export default RuleIntroduce
