import React, { memo } from "react"
// import Svg from "../Svg"

const ToastWarning = ({ title = 'Warning!' }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        {/* <Svg name="warning-square" path="icons" /> */}
        <div>
          <p className="text-white text-xs font-medium my-0">{title}</p>
          <p className="text-white opacity-50 text-ssm font-base my-0">Are you sure you want to remove this?</p>
        </div>
      </div>
    </>
  )
}

export default memo(ToastWarning)