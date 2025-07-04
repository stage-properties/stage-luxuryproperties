import React from 'react'
import CloseIcon from "../../../../../assets/Icons/closeIcon.svg"
import GalleryCarousel from './GalleryCarousel'

const GalleryModal = ({galleryData,setGalleryModal, startIndex, alternativeText}) => {
  return (
    <div className="galleryCarousel">
    <div className="overlay" onClick={()=>setGalleryModal(false)}></div>
    <div className="closeIcon" onClick={()=>setGalleryModal(false)}>
        <CloseIcon/>
    </div>
    <div className="content">
      <GalleryCarousel galleryData={galleryData} startIndex={startIndex} alternativeText={alternativeText} />
    </div>
  </div>
  )
}

export default GalleryModal