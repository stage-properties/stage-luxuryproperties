'use client'

import Slider from "react-slick";
import { useRef, useState } from 'react';

import LeftArrow from "../../../../../assets/Icons/leftArrow.svg";
import RightArrow from '../../../../../assets/Icons/rightArrow.svg';
import { useTranslations, useLocale } from 'next-intl';

const Carousel = ({data, Card}) => {

    const t = useTranslations('common');
    
    const locale = useLocale()
    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : 'ltr'

    let sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const next = () => {
      sliderRef.slickNext();
    };

    const previous = () => {
      sliderRef.slickPrev();
    };

    const filteredData = data?.data

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(filteredData.length, 3),
        slidesToScroll: Math.min(filteredData.length, 3),
        variableWidth: false,
        initialSlide: 0,
        arrows: false,
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: Math.min(filteredData.length, 2),
                    slidesToScroll: Math.min(filteredData.length, 2),
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: Math.min(filteredData.length, 2),
                    slidesToScroll: Math.min(filteredData.length, 2),
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Math.min(filteredData.length, 1),
                    slidesToScroll: Math.min(filteredData.length, 1),
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: Math.min(filteredData.length, 1),
                    slidesToScroll: Math.min(filteredData.length, 1),
                },
            },
        ],
        afterChange: (index) => setCurrentSlide(index)
    };

    const lengthToClass = (number) => {
        return number === 2 ? 'twoItems' : number === 1 ? 'oneItem' : ''
    }

    return (
        <>
            <Slider className={`slider ${lengthToClass(filteredData.length)}`} ref={slider => {sliderRef = slider}} {...settings}>
                {filteredData.map((item, index) => (
                    <div className="sliderItem" key={index}>
                        <Card data={item} configuration={data.configuration} />
                    </div>
                ))}
            </Slider>
            <div dir={isRTL ? 'rtl' : "ltr"} className="sliderArrows" style={{display: filteredData.length <= 1 ? 'none' : 'flex'}}>
                <LeftArrow 
                    className='arrow prev' 
                    onClick={previous} 
                    style={{ opacity: currentSlide === 0 ? 0.5 : 1 }} 
                />
                <RightArrow 
                    className='arrow next' 
                    onClick={next} 
                    style={{ opacity: currentSlide === filteredData.length - settings.slidesToShow ? 0.5 : 1 }} 
                />
            </div>
        </>
    );
};

export default Carousel;