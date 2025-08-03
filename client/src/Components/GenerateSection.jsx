import React from 'react'

const GenerateSection = ({children,className}) => {
  return (
    <div className={`${className}`}>{children}</div>
  )
}

export default GenerateSection