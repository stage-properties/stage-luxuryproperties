import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const CollageImageComponent = ({ data, galleryModalHandler, index, setStartIndexHandler, alternativeText, isFourthImage, translatedText }) => {
  const t = useTranslations('common')

  const [isImageLoad, setIsImageLoad] = useState(false);

  const onLoadHandler = () => {
    setIsImageLoad(true);
  };
  return (
    <div
      className="imageContainer"
      onClick={() => {
        setStartIndexHandler(index + 1)
        galleryModalHandler(true)
      }}
      style={{cursor: 'pointer'}}
      data-view-more-images={isFourthImage ? t('view_more_images') : ''}
    >
      <Image
        src={data?.attributes?.url}
        fill
        alt={alternativeText}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={onLoadHandler}
        quality={100}
      />
       {
       !isImageLoad && (
        <div className="loadingImage gradientBorder">
          <div className="image">
            <Image src="https://d37zlj91i7b9eq.cloudfront.net/stage-properties/stage/offplan/1707214018820.gif" fill={true} alt="Property_Image" />
          </div>
        </div>
      )
      }
      <div className="buttonContainer">
        <button className="showMore" onClick={() => galleryModalHandler(true)}>
          <span className="text gradientText">{t('Show All')}</span>
        </button>
      </div>
    </div>
  );
};

export default CollageImageComponent;
