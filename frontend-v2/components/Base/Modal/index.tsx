import React, { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'

type Props = {
  children?: ReactNode,
  show?: boolean,
  toggle?: any,
  className?: any
}

const Modal = ({ children, show, toggle, className }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClose = () => {
      toggle(false)
    }

    function handleClick(event: any) {
      if (wrapperRef?.current && !wrapperRef?.current?.contains(event.target)) {
        handleClose()
      }
    }

    if (!show) {
      document.removeEventListener('click', handleClick, { capture: true })
      return
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
    }
  }, [wrapperRef, show, toggle])

  return (
    show && 
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay, show/hide based on modal state.

            Entering: "ease-out duration-300"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100"
              To: "opacity-0" */}
          <div className="fixed inset-0 bg-gamefiDark-900 bg-opacity-75 transition-opacity"></div>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            {/* Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
              From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 translate-y-0 sm:scale-100"
              To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" */}

          <div ref={wrapperRef} className="dark:bg-gamefiDark-400 inline-block align-bottom rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className={className}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal