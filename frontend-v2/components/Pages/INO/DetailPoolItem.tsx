import React from 'react'
import Image from 'next/image'
import { printNumber } from '@/utils'
type Props = {
  label: string;
  value: string;
  icon?: string;
}

const DetailPoolItem = ({ label, value, icon }: Props) => {
  return <div className="grid gap-2">
    <span className="uppercase text-xs text-white/50 font-bold">{label}</span>
    <div className="flex items-center gap-1">
      {icon && <Image src={icon} className='w-4 h-4 rounded' width={24} height={24} alt='icon'/>}
      <span className="uppercase font-semibold text-white text-base">{printNumber(value)}</span>
    </div>
  </div>
}

export default DetailPoolItem
