import React, { memo } from "react"

const CloseButton = () => {
  return (
    <>
      <div className="absolute top-50 translate-y-50 right-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="20" fill="#fff" />
          <path d="M6 14L14 6M6 6L14 14" stroke="#000" />
        </svg>

      </div>
    </>
  )
}

export default memo(CloseButton)