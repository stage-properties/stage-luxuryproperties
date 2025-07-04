
import React from 'react'
import Image from "next/image";
import {useTranslations} from 'next-intl';

const OffplanListingSpotlight = () => {
    
    const t = useTranslations('offplan');
   
    return (
        <div className='offplanListingSpotlight'>
            <div className="imageContainer">
                <Image src="https://d37zlj91i7b9eq.cloudfront.net/stage-properties/stage/offplan/1706952979807.webp"
                    quality={100}
                    fill
                    sizes="100vw"
                    alt='Dubai skyscrapers'
                />
                    <div className="gradient"></div>
                    <h1 className="heroTitle">{t('live_the_future_today_explore_offplan_properties')}</h1>
            </div>
        </div>
    )
}

export default OffplanListingSpotlight