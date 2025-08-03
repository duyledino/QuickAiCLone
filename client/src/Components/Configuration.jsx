import React from 'react'

const Configuration = ({children,className}) => {
  return (
    <div className={`${className}`}>{children}</div>
  )
}

export default Configuration