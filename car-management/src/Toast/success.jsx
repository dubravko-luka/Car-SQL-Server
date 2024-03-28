import React, { memo } from "react"

const ToastSuccess = ({ title = 'Congratulation!' }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="pl-3">
          <p className="text-white text-xs font-medium my-0">{title}</p>
          <p className="text-white opacity-50 text-ssm font-base my-0">Success</p>
        </div>
      </div>
    </>
  )
}

export default memo(ToastSuccess)