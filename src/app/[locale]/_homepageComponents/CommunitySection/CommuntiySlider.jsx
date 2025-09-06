"use client";

import React from "react";
import Slider from "react-slick";
import CommunityCard from "@/app/[locale]/_components/CommunityCard/CommunityCard";

const CommuntiySlider = ({ featuredCityData }) => {
  const settings = {
    className: "center",
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 4.5,
    slidesToScroll: 1,
    arrows: false,
    initialSlide: 0.5,
    lazyLoad: false,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
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
