import Image from 'next/image'
import React from 'react'

const GradientLine = ({width}) => {
  return (
    <div id='gradientLine' style={{width: width ? width:'100%'}}>
        <Image
            src="/gradientLine.png"
            fill
            sizes=''
            alt='GradientLine'
        />

    </div>
  )
}

export default GradientLine