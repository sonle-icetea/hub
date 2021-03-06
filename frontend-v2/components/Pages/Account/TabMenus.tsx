import clsx from 'clsx'
import React from 'react'
import styles from './TabMenus.module.scss'

type Props = {
  value?: number;
  onChange?: (val: number) => any;
  menus: string[];
  tabDisabled?: boolean;
}

const TabMenus = ({ value = 0, onChange, menus, tabDisabled }: Props) => {
  const handleChange = (val: number) => {
    if (val === value) return
    onChange && onChange(val)
  }
  return <div className='flex'>
    {
      menus.map((m, id) => (<div
        onClick={() => handleChange(id)}
        className={clsx('w-44 p-3 flex items-center justify-center', styles.tabMenu, {
          [styles.active]: id === value,
          'cursor-not-allowed': tabDisabled,
          'cursor-pointer': !tabDisabled
        })}
        key={m}>
        <span className='uppercase text-sm font-bold'>{m}</span>
      </div>))
    }
  </div>
}

export default TabMenus
