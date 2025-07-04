"use client";

import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import CarouselRightArrow from "../categoryCarousel/CarouselRightArrow";
import CarouselLeftArrow from "../categoryCarousel/CarouselLeftArrow";
import OffplanPropertyCard from "../PropertyCard/OffplanPropertyCard";
import { useWindowWidth } from "@react-hook/window-size";
import { useEffect } from "react";

const CarouselComponent = ({ similiarPropertyData }) => {
  const windowSize = useWindowWidth();
  const settings = {
    centerMode: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    initialSlide: 0,
    variableWidth: false,
    slidesToScroll: 2,
    nextArrow: <CarouselRightArrow />,
    prevArrow: <CarouselLeftArrow />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [size,setSize] = useState()

  useEffect(()=>()=>{
    setSize(windowSize)
  },[windowSize])

  return (
    <div
      id="carouselComponent"
      className={
        similiarPropertyData?.length <=2 ? "leftAlign" : "nrml"
      }
    >
      {similiarPropertyData?.length >0?(
        <Slider className="gallery" {...settings}>
          {similiarPropertyData?.map((item) => (
            <div className="item" key={item?.offplan_id}>
              <OffplanPropertyCard data={item} />
            </div>
          ))}
        </Slider>
      ):null}

      {/* <div className="listItems">
        {similiarPropertyData?.map((item) => (
          <div className="item" key={item?.offplan_id}>
            <OffplanPropertyCard data={item} />
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default CarouselComponent;
