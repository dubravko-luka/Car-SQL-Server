import React, { memo } from "react"

const ToastError = ({ title = 'Error!' }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="pl-3">
          <p className="text-white text-xs font-medium my-0">{title}</p>
          <p className="text-white opacity-50 text-ssm font-base my-0">Error state</p>
        </div>
      </div>
    </>
  )
}

export default memo(ToastError)