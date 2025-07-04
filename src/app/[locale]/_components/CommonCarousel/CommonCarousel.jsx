'use client'

import PropertyCard from "../PropertyCard/PropertyCard";
import OffplanPropertyCard from "../PropertyCard/OffplanPropertyCard";
import Slider from 'react-slick'
import CarouselRightArrow from "../categoryCarousel/CarouselRightArrow";
import CarouselLeftArrow from "../categoryCarousel/CarouselLeftArrow";

const CommonCarousel = ({ properties, type, configuration }) => {
  const settings = {
    className: "center",
    centerMode: true,
    dots: false,
    lazyLoad: false,
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CarouselRightArrow />,
    prevArrow: <CarouselLeftArrow />,
    responsive: [
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
          infinite: true,
        },
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div id="commonCarousel">
      <Slider className="gallery" {...settings}>
        {properties?.map((item) => (
          <div className="propertyItem" key={item?.id}>
            {type === "OFFPLAN" ? (
              <OffplanPropertyCard data={item} bg="primaryBg" />
            ) : (
              <PropertyCard data={item} configuration={configuration} bg="primaryBg" />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CommonCarousel;
