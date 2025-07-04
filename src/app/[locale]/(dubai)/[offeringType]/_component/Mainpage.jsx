import SecondaryCommonPage from '@/app/[locale]/_components/secondaryCommonPage/SecondaryCommonPage'
import React from 'react'
import {getTranslations} from 'next-intl/server';
import { fetchCommunity } from '../service';

const Mainpage = async ({params, searchParams, heading, subheading}) => {

  const {locale} = params
  const t = await getTranslations({locale, namespace: 'common'});

  const isRTL = locale === 'ar'

  const {"param-1": param1, "param-2": propertyType} = params
  const commercialOrResidential = param1?.toLowerCase()

  const communitySlug = params['param-3']?.split('-')?.slice(1)?.join('-');
  const community_res = await fetchCommunity(communitySlug, locale)
  const emirate = community_res?.attributes?.emirate?.data?.attributes?.emirate_name
  const community = community_res?.attributes?.community_name

  const contructTitle = () => {
    if(params['param-2'] === 'properties-for-sale' || params['param-2'] === 'properties-for-rent'){
      if(heading && (!params['param-3'] || params['param-3'].includes('page-'))) {
        return heading
      }
      else {
        if(param1 === 'residential') {
          if(params['param-2'] === 'properties-for-sale') {
            return `${t('residential-properties-for-sale')} ${community ? ` ${t('in')} ${community}, ${emirate}` : t('in_dubai')}`
          }
          else if(params['param-2'] === 'properties-for-rent') {
            return `${t('residential-properties-for-rent')} ${community ? ` ${t('in')} ${community}, ${emirate}` : t('in_dubai')}`
          }
        } else {
          if(params['param-2'] === 'properties-for-sale') {
            return `${t('commercial-properties-for-sale')} ${community ? ` ${t('in')} ${community}, ${emirate}` : t('in_dubai')}`
          } 
          else if(params['param-2'] === 'properties-for-rent') {
            return `${t('commercial-properties-for-rent')} ${community ? ` ${t('in')} ${community}, ${emirate}` : t('in_dubai')}`
          }
        }
      }
    } else {
      return `${t(propertyType.toLowerCase())} ${community ? ` ${t('in')} ${community}, ${emirate}` : ''}`
    }
  }

  const constructDescription = () => {
    if(params['param-2'] === 'properties-for-sale' || params['param-2'] === 'properties-for-rent'){
      if(subheading && (!params['param-3'] || params['param-3'].includes('page-'))) return subheading
      else return `${t('Explore')} ${t(propertyType)} ${community ? ` ${t('in')} ${community}, ${emirate}` : ''} ${t('with your trusted real estate partner')}`
    } else return `${t('Explore')} ${t(propertyType)} ${community ? ` ${t('in')} ${community}, ${emirate}` : ''} ${t('with your trusted real estate partner')}`
  }
  
  const _heading = contructTitle()
  const _subheading = constructDescription()

  return (
    <div className="secondaryMainPage">
    <div className="wrapper">
        <h1 className="mainHeading gradientText heading" style={{marginBottom: subheading ? '.5rem' : '1rem'}}>{_heading}</h1>
        {_subheading && (<h2 className={`subheading ${isRTL ? 'ar' : ''}`}>{_subheading}</h2>)}
        
        <SecondaryCommonPage params={params} searchParams={searchParams} locale={locale} />

    </div>
</div>
  )
}

export default Mainpage