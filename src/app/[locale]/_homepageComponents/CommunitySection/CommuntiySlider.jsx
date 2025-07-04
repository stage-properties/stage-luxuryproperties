"use client";

import CarouselLeftArrow from "@/app/[locale]/_components/categoryCarousel/CarouselLeftArrow";
import CarouselRightArrow from "@/app/[locale]/_components/categoryCarousel/CarouselRightArrow";
import React from "react";
import Slider from 'react-slick'
import CommunityCard from "@/app/[locale]/_components/CommunityCard/CommunityCard";

const CommuntiySlider = ({ featuredCityData }) => {
  const settings = {
    className: "center",
    centerMode: true,
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    slidesToScroll: 1,
    lazyLoad: false,
    nextArrow: <CarouselRightArrow />,
    prevArrow: <CarouselLeftArrow />,
    responsive: [
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode:false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode:false
        }
      },
    ]
  };
  return (
    <Slider className="communityListingContainer" {...settings}>
      {featuredCityData?.map((item) => (
        <div className="communityListItem" key={item?.id}>
          <CommunityCard featuredCityData={item} />
        </div>
      ))}
    </Slider>
  );
};

export default CommuntiySlider;
