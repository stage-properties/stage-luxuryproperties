import React from 'react'
import CategoryWise from './[emirateParam]/_components/CategoryWise/CategoryWise'
import Tags from '@/app/[locale]/_components/Tags/Tags';
import { fetchPageInfo } from './service';
import CTAContainer from '@/app/[locale]/_components/CTA/CtaContainer/CtaContainer';
import FaqSection from '@/app/[locale]/_components/Faq/FaqSection';
import { useServerPathname } from '../_utils/useServerPathname';
import { headers } from "next/headers";
import { getTranslations} from 'next-intl/server';
import Breadcrumb from '@/app/[locale]/_components/Breadcrumb/Breadcrumb';

export const generateMetadata = async ({params}) => {

  const headerList = headers()
  const fullURL = headerList.get('x-current-url').replace('ar/', '')

  const {locale} = params
  const t = await getTranslations('offplan')

  return {
    title: t("Discover Off-Plan Properties in Dubai"),
    description: t(`Explore Dubai's off-plan projects and properties with Stage Properties`),
    alternates: {
      canonical: `https://stageproperties.com/${locale === 'ar' ? 'ar/' : ''}offplan`,
      languages: {
        'en-gb': fullURL,
        'en': fullURL,
        'x-default': fullURL,
        'ar': fullURL.replace('https://stageproperties.com', 'https://stageproperties.com/ar'),
      },
    },
    openGraph: {
      url: fullURL,
      title: t("Our Passionate Real Estate Professionals"),
      description: t(`Discover our seasoned team with`),
      images: [
        {
          url: 'https://stageproperties.com/stage-default.png',
          width: 1200,
          height: 630,
          alt: 'All offplan projects'
        }
      ],
      type: 'website'
    }
  }
}

const page = async ({params, searchParams}) => {

  const { locale } = params

  const t = await getTranslations({locale, namespace: 'offplan'});

  const isRTL = locale === 'ar'

  const res_popularSearch = await fetchPageInfo()
  const popularSearches = res_popularSearch?.data?.attributes?.popular_searches

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
      "name": "OFF PLAN",
      "item": "https://stageproperties.com/offplan"
    }]
  }`

  const breadcrumbItems = [
    {
      title: <p className='breadcrumb focus' style={{fontWeight: 600, color: 'white'}}>{t('OFF PLAN')}</p>
    }
  ]

  return (
    <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON}/>
      <CategoryWise params={params} searchParams={searchParams} />
      <CTAContainer style={{marginBottom: '7rem'}}/>
      <FaqSection style={{marginBottom: '7rem'}}/>
        {
          popularSearches && !isRTL && (
            <>
              <div className='wrapper' style={{marginBottom: '130px'}}>
                <h2 className='mainHeading' style={{textAlign: 'left', marginBottom: '20px', color: 'white'}}>{t('Popular Searches')}</h2>
                <Tags data={popularSearches} />
              </div>
            </>
          )
        }
    </>
  )
}

export default page