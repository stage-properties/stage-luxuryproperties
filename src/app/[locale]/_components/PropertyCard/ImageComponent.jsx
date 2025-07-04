"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const ImageComponent = ({ data }) => {
  
  const locale = useLocale()
  const t = useTranslations('secondary')

  const isRTL = locale === 'ar'
  
  const property_title = data?.attributes?.property_title
  const alternativeText = data?.attributes?.featured_image?.data?.attributes?.alternativeText
  const [isImageLoad, setIsImageLoad] = useState(false);
  
  const onLoadHandler = () => {
    setIsImageLoad(true);
  };
  return (
    <div className="imageContainer">
      <div className="stickers">
        <div className={`sticker gradientBorder ${isRTL ? 'ar' : ''}`}>
          <span className="text">
            {data?.attributes?.is_offplan ? t("off-plan") : t("ready")}
          </span>
        </div>
        <div className="sticker propertyType">
          <span className="text">
            {t(data?.attributes?.property_type?.data?.attributes?.type?.toLowerCase())}
          </span>
        </div>
      </div>
      {!isImageLoad && (
        <div className="loadingImage">
          <div className="image">
            <Image priority src="https://d37zlj91i7b9eq.cloudfront.net/stage-properties/stage/offplan/1707214018820.gif" fill={true} alt="Property_Image" />
          </div>
        </div>
      )}

      <Image
        src={
          data?.attributes?.featured_image?.data?.attributes?.url
            ? data?.attributes?.featured_image?.data?.attributes?.url
            : "/sample_card_image.jpeg"
        }
        // src="https://fnst.axflare.com/assets/public/img/loader.gif"
        fill={true}
        alt={alternativeText || property_title}
        onLoad={onLoadHandler}
        // objectFit='cover'
      />
    </div>
  );
};

export default ImageComponent;
