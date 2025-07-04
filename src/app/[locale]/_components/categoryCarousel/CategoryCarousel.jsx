'use client'
import { getFeaturedOffplanProperty } from '@/app/[locale]/redux/FeaturedOffplanPropertySlice/featuredOffplanPropertySlice'

import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import CarouselRightArrow from './CarouselRightArrow';
import CarouselLeftArrow from './CarouselLeftArrow';
import OffplanPropertyCard from '../PropertyCard/OffplanPropertyCard';
import { useDispatch, useSelector} from "react-redux";

const CategoryCarousel = ({featuredData}) => {
  const featuredOffplanPropertyRedux = useSelector((state) => state?.featuredOffplanProperty?.value)
  const [featuredOffplans,setFeaturedOffplans] = useState([])
  const settings = {
      className:"center",
      centerMode:true,
      dots: false,
      lazyLoad: false,
      infinite: true,
      speed: 200,
      slidesToShow: 3,
      slidesToScroll: 1,
      nextArrow:<CarouselRightArrow/>,
      prevArrow:<CarouselLeftArrow/>,
      responsive: [
        {
          breakpoint: 1050,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            centerMode:false,
            infinite: true,
          }
        },
        {
          breakpoint: 980,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            centerMode:false,
            infinite: true,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode:false,
            infinite: true,
          }
        },
      ]
    };
  
  const dispatch = useDispatch()

  useEffect(()=>{
   setFeaturedOffplans(featuredData?.data)
   return () => {
    dispatch(
      getFeaturedOffplanProperty({
        featuredOffplanProperty:[]
      })
      )
   }
  },[featuredData])

  useEffect(()=>{
    if(featuredOffplanPropertyRedux?.length){
      setFeaturedOffplans([...featuredOffplans, ...featuredOffplanPropertyRedux]);
    }
  },[featuredOffplanPropertyRedux])

  return (
    <div id='categoryCarousel'>
      <Slider className="gallery" {...settings}>
        {
          featuredOffplans?.map((item) => (
            <div className="propertyItem" key={item?.id}>
            <OffplanPropertyCard data ={item} bg="primaryBg" configuration={featuredData?.configuration} />
          </div>
          ))
        }
      </Slider>
    </div>
  )
}

export default CategoryCarousel