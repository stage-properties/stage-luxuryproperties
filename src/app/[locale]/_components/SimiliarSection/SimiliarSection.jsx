import 'server-only'

import React from 'react'
import { fetchSimiliarPropertyData } from './service'
import Carousel from '../NoData/Carousel';
import OffplanPropertyCard from '../PropertyCard/OffplanPropertyCard';
import { getTranslations } from 'next-intl/server';

const SimiliarSection =async ({propertyId,type,communitySlug, locale}) => {

  const t = await getTranslations({locale, namespace: 'common'});

  let similiarPropertyData;
  if(type && propertyId){
    similiarPropertyData = await fetchSimiliarPropertyData(propertyId,type,communitySlug, locale)
  }
  if(!similiarPropertyData?.data?.length){
    return 
  }

  return (
    <div className='similiarPropertyComponent'>
            <h2 className="mainHeading similarPropertyComponentHeading">{t("similiar projects")}</h2>
            <div className="carouselSection">
                {similiarPropertyData?.data?.length && <Carousel data={similiarPropertyData} Card={OffplanPropertyCard} />}
            </div>
    </div>
  )
}

export default SimiliarSection