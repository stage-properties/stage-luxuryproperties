import React from "react";
import Image from "next/image";
import PointerLine from "../../../../../assets/Icons/pointerLine.svg";
import GradientLine from "@/app/[locale]/_components/GradientLine/GradientLine";
const OurOffice = () => {
  return (
    <div className="ourOffice">
      <div className="wrapper">
        <div className="gallery">
          <div className="leftContainer">
            <div className="item">
              <Image src="/002.webp" fill alt="Office gallery Image" />
            </div>
            <div className="item">
              <Image src="/003.webp" fill alt="Office gallery Image" />
            </div>
            <div className="item">
              <Image src="/004.webp" fill alt="Office gallery Image" />
            </div>
          </div>
          <div className="centerContainer">
            <span className="pointerIcon">
              <PointerLine />
            </span>
            <div className="centerImage">
              <Image src="/office_gallery1.webp" fill alt="Office gallery Image" />
            </div>
          </div>
          <div className="rightContainer">
            <div className="item">
              <Image src="/005.webp" fill alt="Office gallery Image" />
            </div>
            <div className="item">
              <Image src="/006.webp" fill alt="Office gallery Image" />
            </div>
            <div className="item">
              <Image src="https://d37zlj91i7b9eq.cloudfront.net/stage-properties/office_1_8b91d8ff8e.webp" fill alt="Office gallery Image" />
            </div>
          </div>
        </div>
        <GradientLine width={"50%"}/>
      </div>
    </div>
  );
};

export default OurOffice;
