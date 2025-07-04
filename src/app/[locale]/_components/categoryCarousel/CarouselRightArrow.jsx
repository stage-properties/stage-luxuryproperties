'use client'

import React from 'react'
import RightArrow from "../../../../../assets/Icons/rightArrow.svg";
import { useLocale } from 'next-intl';

const CarouselRightArrow = (props) => {
  const locale = useLocale()
    const { onClick } = props;
    return (
      <div
        className={`arrow-right ${locale === 'ar' ? 'ar' : ''} ${props?.className}`}
        onClick={onClick}
      >
        <RightArrow/>
      </div>
    );
}

export default CarouselRightArrow