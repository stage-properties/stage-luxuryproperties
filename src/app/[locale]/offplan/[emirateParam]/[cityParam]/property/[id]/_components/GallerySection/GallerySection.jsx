'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CloseIcon from '../../../../../../../../../../assets/Icons/closeIcon.svg'

import { useWindowWidth } from "@react-hook/window-size";
import AgentStickyContainer from "../AgentStickyContainer/AgentStickyContainer";
import { usePathname } from 'next/navigation'
import GalleryCarousel from "./GalleryCarousel";
const GallerySection = ({ offplanGallery,offplanData,formRef }) => {
  const pathname = usePathname()
  const [galleryModal,setGalleryModal] = useState(false)
  const windowSize = useWindowWidth();

  const redirectURL = pathname;
  const contactText = `Hi There, I am interested in this listing: ${process.env.NEXT_PUBLIC_WEBSITE_URL}${redirectURL} from your website. I would like to get more information. Thank you.`;

  const galleryClickHandler =(index) => {
    if(windowSize>640){
      if(index === 3) setGalleryModal(true)
    }else{
      if(index === 2) setGalleryModal(true)
  }
  
  }


  


  return (
    <div className={galleryModal ? "gallerySection zIndex" : "gallerySection"}>
      {
        galleryModal&&
      <div className="galleryCarousel">
        <div className="overlay" onClick={()=>setGalleryModal(false)}></div>
        <div style={{zIndex: 99999}} className="closeIcon" onClick={()=>setGalleryModal(false)}>
            <CloseIcon/>
        </div>
        <div className="content">
          <GalleryCarousel offplanGallery={offplanGallery}/>
        </div>
      </div>
      }
      <div className="wrapper">
        <ul className="images">
          {offplanGallery?.slice(0, 4)?.map((item,index) => (
            <li className="item" key={item?.id} onClick={()=>galleryClickHandler(index)}>
              <div className="imageContainer">
                <Image
                  src={item?.attributes?.url}
                  fill
                  alt="GalleryImage"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GallerySection;
