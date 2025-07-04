"use client";

import React from "react";
import Slider from "react-slick";
import ImageLoader from '@/app/[locale]/_components/ImageLoader/ImageLoader';

const GalleryResponsiveSlider = ({galleryData, alternativeText, onClick, setStartIndexHandler}) => {

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:true,
    afterChange: (current) =>  setStartIndexHandler(current), // Attach the afterChange handler
  };

  return (
    <div className="gallerySliderResponsive">
      <Slider className="gallery" {...settings}>
        {galleryData?.map((item) => (
          <div className="item" key={item?.id}>
            <ImageLoader
            onClick={onClick}
            imageSRC={item?.attributes?.url}
            alternativeText={item?.attributes?.alternativeText || alternativeText}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default GalleryResponsiveSlider