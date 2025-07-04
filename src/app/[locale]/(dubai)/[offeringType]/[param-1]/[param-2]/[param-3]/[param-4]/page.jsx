import Mainpage from '@/app/[locale]/(dubai)/[offeringType]/_component/Mainpage';
import React from 'react'
import dynamic from 'next/dynamic';
import { fetchRentResidentialMeta, fetchRentCommercialMeta, fetchBuyResidentialMeta, fetchBuyCommercialMeta } from '../../../../service';
import Tags from '@/app/[locale]/_components/Tags/Tags';
import CTAContainer from '@/app/[locale]/_components/CTA/CtaContainer/CtaContainer';
import FaqSection from '@/app/[locale]/_components/Faq/FaqSection';
import { notFound } from 'next/navigation';
import { useServerPathname } from '@/app/[locale]/_utils/useServerPathname';
import { headers } from "next/headers";
import { getTranslations } from 'next-intl/server';

// http://localhost:3000/buy/residential/properties-for-sale/in-damac-hills/page-2

const Breadcrumb = dynamic(() =>
  import('@/app/[locale]/_components/Breadcrumb/Breadcrumb')
)

// Map the parameters to the corresponding fetch function
const metaFetchers = {
  rent: {
    residential: fetchRentResidentialMeta,
    commercial: fetchRentCommercialMeta,
  },
  buy: {
    residential: fetchBuyResidentialMeta,
    commercial: fetchBuyCommercialMeta,
  },
};

// Function to fetch metadata based on params
async function fetchMetadata(offeringType, param1, locale) {
  const fetcher = metaFetchers[offeringType]?.[param1];

  const res = await fetcher(locale);
  const { title_tag: title, heading, subheading, meta_description: description, popular_searches } = res.data[0].attributes;

  return {
    title,
    heading,
    subheading,
    description,
    popular_searches
  };
}

export async function generateMetadata({ params }) {

  handle404(params)

  const BASE_URL = 'https://stageproperties.com/'
  const paramsToString = Object.values(params).join('/');

  // Split by '/', filter out any segment that matches "page-" followed by one or more digits, then join back.
  const cleanedParams = paramsToString
  .split('/')
  .filter(segment => !/^page-\d+$/.test(segment))
  .join('/');
  
  const { locale, offeringType, 'param-1': param1, 'param-2': param2, 'param-3': param3 } = params;

  const t_common = await getTranslations({locale, namespace: 'common'})

  const headerList = headers()
  const fullURL = headerList.get('x-current-url').replace('ar/', '')

  try {
    const obj = await fetchMetadata(offeringType, param1, locale);
    const canonical = BASE_URL+cleanedParams

    const {title, description} = obj

    const commercialOrResidential = param1?.toLowerCase()

    const {"param-2": propertyType} = params

    function capitalizeFirstLetter(str) {
      if (!str) return str;
      return str?.charAt(0)?.toUpperCase() + str?.toLowerCase().slice(1);
    }

    const communitySlug = params['param-3']?.split('-')?.slice(1)?.join('-').replaceAll('(', '').replaceAll(')', '');
    const community_res = await fetchCommunity(communitySlug, locale)
    const emirate = community_res?.attributes?.emirate?.data?.attributes?.emirate_name
    const community = community_res?.attributes?.community_name

    const contructTitle = () => {
      if(params['param-2'] === 'properties-for-sale' || params['param-2'] === 'properties-for-rent'){
        if(title && (!params['param-3'] || params['param-3'].includes('page-'))) {
          return title
        }
        else {
          return `${t_common(propertyType.toLowerCase())} ${community ? ` in ${community}, ${emirate}` : 'hello'}`
        } 
      } else { 
        return `${t_common(propertyType.toLowerCase())} ${community ? ` in ${community}, ${emirate}` : 'hello'}`
      }
    }

    const constructDescription = () => {
      if(params['param-2'] === 'properties-for-sale' || params['param-2'] === 'properties-for-rent'){
        if(description && (!params['param-3'] || params['param-3'].includes('page-'))) return description
        else return `${t_common('Explore')} ${param1} ${t_common(propertyType)} ${community ? ` in ${community}, ${emirate}` : ''} ${t_common('with your trusted real estate partner')}`
      } else return `${t_common('Explore')} ${param1} ${t_common(propertyType)} ${community ? ` in ${community}, ${emirate}` : ''} ${t_common('with your trusted real estate partner')}`
    }


    return {
      title: contructTitle(),
      description: constructDescription(),
      alternates: {
        canonical: canonical.replace('/en/', '/'),
        languages: {
          'en-gb': fullURL,
          'en': fullURL,
          'x-default': fullURL,
          'ar': fullURL.replace('https://stageproperties.com', 'https://stageproperties.com/ar'),
        },
      },
      openGraph: {
        url: fullURL,
        title: contructTitle(),
        description: constructDescription(),
        images: [
          {
            url: 'https://stageproperties.com/stage-default.png',
            width: 1200,
            height: 630,
            alt: 'Logo'
          }
        ],
        type: 'website'
      }
    }

  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: 'Default Title',
      description: 'Default Description',
    };
  }
}
const handle404 = (params) => {

  const handlePageFormat = (str) => {
    const pattern = /^page-\d+$/;
    return !str.match(pattern)
  }
  
  const {offeringType, 'param-1': param1, 'param-2': param2, 'param-3': param3, 'param-4' : param4} = params

  if(offeringType !== 'rent' && offeringType !== 'buy') notFound()
  if(param1?.toLowerCase() !== 'commercial' && param1.toLowerCase() !== 'residential' ) notFound()
  if(handlePageFormat(param4?.toLowerCase())) notFound()
    
}

const page = async ({params, searchParams}) => {

  const { locale } = params
  const t = await getTranslations({locale, namespace: 'breadcrumb'});
  const isRTL = locale === 'ar'

  const metaFetchers = {
    rent: {
      residential: {
        text: t('rent'),
        url: 'https://stageproperties.com/rent/residential/properties-for-rent'
      },
      commercial: {
        text: t('commercial_for_rent'),
        url: 'https://stageproperties.com/rent/commercial/properties-for-rent'
      }
    },
    buy: {
      residential: {
        text: t('buy'),
        url: 'https://stageproperties.com/buy/residential/properties-for-sale'
      },
      commercial: {
        text: t('commercial_for_sale'),
        url: 'https://stageproperties.com/buy/commercial/properties-for-sale'
      }
    }
  };

  const {offeringType, 'param-1': param1} = params
  const _text = metaFetchers[offeringType]?.[param1].text;
  const _url = metaFetchers[offeringType]?.[param1].url;

  const {popular_searches, heading, subheading} = await fetchMetadata(offeringType, param1, locale);
  const isResidential = param1 === 'residential'

  const scriptJSON = 
  `{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://stageproperties.com/"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "${_text}",
      "item": "${_url}"
    }]
  }`

  const breadcrumbItems = [
    {
      title: <p className='breadcrumb focus'>{_text}</p>
    }
  ]

    return (
      <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
      <Mainpage params={params} searchParams={searchParams} heading={heading} subheading={subheading}/>
      <CTAContainer style={{marginBottom: '10rem'}}/>
      <FaqSection />
      {
        isResidential && popular_searches && !isRTL && (
          <div className='wrapper' style={{marginBottom: '130px'}}>
            <h2 className='mainHeading' style={{textAlign: 'left', marginBottom: '20px', color: 'white'}}>Popular Searches</h2>
            <Tags data={popular_searches}/>
          </div>
        )
      }
    </>
    );
  };

export default page
