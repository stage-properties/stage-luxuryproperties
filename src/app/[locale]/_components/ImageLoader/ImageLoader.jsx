"use client";
import React, { useState } from "react";
import Image from "next/image";

const ImageLoader = ({ imageSRC, alternativeText, onClick }) => {
  const [isImageLoad, setIsImageLoad] = useState(false);

  const onLoadHandler = () => {
    setIsImageLoad(true);
  };
  return (
    <div id="loadingImage" className="imageContainer" onClick={onClick}>
      {!isImageLoad && (
        <div className="loadingImage gradientBorder">
          <div className="image">
            <Image
              src="https://d37zlj91i7b9eq.cloudfront.net/stage-properties/stage/offplan/1707214018820.gif"
              fill={true}
              alt="Property_Image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      )}

      <Image
        src={imageSRC ? imageSRC : "/sample_card_image.jpeg"}
        fill={true}
        alt={alternativeText}
        onLoad={onLoadHandler}
        quality={100}

      />
    </div>
  );
};

export default ImageLoader;
