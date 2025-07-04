'use client'

import React from 'react'
import LeftArrow from "../../../../../assets/Icons/leftArrow.svg";

const CarouselLeftArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className={`arrow-left ${props?.className}`}
        onClick={onClick}
      >
        <LeftArrow/>
      </div>
    );
}

export default CarouselLeftArrow