"use client";
import React, { useState } from "react";
import Image from "next/image";
import GalleryModal from "@/app/[locale]/_components/GalleryCarousel/GalleryModal";
import { useWindowSize } from "@uidotdev/usehooks";
import GalleryResponsiveSlider from "./GalleryResponsiveSlider";
import CollageImageComponent from "./CollageImageComponent";
import { useTranslations } from "next-intl";

const GallerySectionSecondary = ({ galleryImages, alternativeText }) => {

  const t = useTranslations('common')
  const [galleryModal, setGalleryModal] = useState(false);
  const [isImageLoad, setIsImageLoad] = useState(false);
  const [startIndex, setStartIndex] = useState(0)

  let windowWidth = useWindowSize();
  const onLoadHandler = () => {
    setIsImageLoad(true);
  };
  const galleryModalHandler = (value) => {
    setGalleryModal(value);
  };
  const setStartIndexHandler = (value) => {
    setStartIndex(value)
  }

  return (
    <div className="gallerySectionSecondary">
      {galleryModal && (
        <GalleryModal
          galleryData={galleryImages}
          setGalleryModal={setGalleryModal}
          startIndex={startIndex}
          alternativeText={alternativeText}
        />
      )}
      {windowWidth?.width < 481 ? (
        <GalleryResponsiveSlider 
          galleryData={galleryImages} 
          alternativeText={alternativeText} 
          setStartIndexHandler={setStartIndexHandler}
          onClick={() => galleryModalHandler(true)} 
        />
      ) : (
        <>
          <div className="left">
            {galleryImages?.slice(0, 1)?.map((item) => (
              <div className="imageContainer" key={item?.id}>
                <Image
                  src={item?.attributes?.url}
                  fill
                  alt={item?.attributes?.alternativeText || alternativeText}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onLoad={onLoadHandler}
                  quality={100}
                  onClick={() => {
                    setStartIndexHandler(0)
                    galleryModalHandler(true)
                  }}
                  style={{cursor: 'pointer'}}
                />
                {!isImageLoad && (
                  <div className="loadingImage gradientBorder">
                    <div className="image">
                      <Image
                        src="https://d37zlj91i7b9eq.cloudfront.net/stage-properties/stage/offplan/1707214018820.gif"
                        fill={true}
                        alt="Property_Image"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="right">
            {galleryImages?.slice(1, 5)?.map((item, index) => (
              <CollageImageComponent
              key={item?.id}
                data={item}
                index={index}
                galleryModalHandler={galleryModalHandler}
                setStartIndexHandler={setStartIndexHandler}
                alternativeText={item?.attributes?.alternativeText || alternativeText}
                isFourthImage={index === 3} // Pass a prop to identify the 4th image
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GallerySectionSecondary;
