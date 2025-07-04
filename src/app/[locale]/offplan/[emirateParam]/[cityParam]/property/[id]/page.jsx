import React from "react";
import Spotlight from "./_components/Spotlight/Spotlight";
import { fetchOffplanData } from "./service";
import Body from "./_components/Body/Body";
import { Link } from '@/i18n/routing';
import CTAContainer from "@/app/[locale]/_components/CTA/CtaContainer/CtaContainer";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from 'next-intl/server';

// http://localhost:3000/offplan/dubai/emaar-south/property/golf-lane
import Breadcrumb from "@/app/[locale]/_components/Breadcrumb/Breadcrumb";

export const generateMetadata = async ({ params }) => {

  const {locale} = params

  const offplanData = await fetchOffplanData(params?.id, locale);
  const project_name = offplanData?.attributes?.project_name 
  
  // to check if the offplan have a translation in arabic
  const hasArabic = offplanData.hasArabic
  const alternatesLanguage =
    hasArabic ? {
    'en-gb': `https://stageproperties.com/offplan/${params.emirateParam}/${params.cityParam}/property/${params.id}`,
    'en': `https://stageproperties.com/offplan/${params.emirateParam}/${params.cityParam}/property/${params.id}`,
    'x-default': `https://stageproperties.com/offplan/${params.emirateParam}/${params.cityParam}/property/${params.id}`,
    'ar': `https://stageproperties.com/ar/offplan/${params.emirateParam}/${params.cityParam}/property/${params.id}`
  } : {
    'en-gb': `https://stageproperties.com/offplan/${params.emirateParam}/${params.cityParam}/property/${params.id}`,
    'en': `https://stageproperties.com/offplan/${params.emirateParam}/${params.cityParam}/property/${params.id}`,
    'x-default': `https://stageproperties.com/offplan/${params.emirateParam}/${params.cityParam}/property/${params.id}`
  }
  

  if(!project_name) notFound()

  const headerList = headers()
  const fullURL = headerList.get('x-current-url').replace('ar/', '')

  const url = `https://stageproperties.com/offplan/${params.emirateParam}/${params.cityParam}/property/${params.id}`
  const t = await getTranslations({locale, namespace: 'offplan'});

  return {
    metadataBase: new URL("https://stageproperties.com"),
    title: {
      absolute:offplanData?.attributes?.seo?.metaTitle ? offplanData?.attributes?.seo?.metaTitle + ` | ${t("Stage Properties")}` : offplanData?.attributes?.project_name + ` ${t('by')} ` + offplanData?.attributes?.developer?.data?.attributes?.developer_name + ` | ${t('Stage Properties')}`,
    },
    description: offplanData?.attributes?.seo?.metaDescription ? offplanData?.attributes?.seo?.metaDescription : `${t("Buy Property in Dubai - Stage Properties, Dubai's best investment property broker")}`,
    openGraph: {
      url: fullURL,
      title: offplanData?.attributes?.seo?.metaTitle ? offplanData?.attributes?.seo?.metaTitle + ` | ${t("Stage Properties")}` : offplanData?.attributes?.project_name + ` ${t("by")} ` + offplanData?.attributes?.developer?.data?.attributes?.developer_name + ` | ${t("Stage Properties")}`,
      description: offplanData?.attributes?.seo?.metaDescription ? offplanData?.attributes?.seo?.metaDescription : `${t("Buy Property in Dubai - Stage Properties, Dubai's best investment property broker")}`,
      images: [
        {
          url: offplanData?.attributes?.featured_image?.data?.attributes?.url,
          width: 1200,
          height: 630,
          alt: offplanData?.attributes?.featured_image?.data?.attributes?.alternativeText || (offplanData?.attributes?.project_name + " by " + offplanData?.attributes?.developer?.data?.attributes?.developer_name)
        }
      ],
      type: 'website'
    },
    twitter: {
      card: "summary_large_image",
      site: "Stage properties",
      title: offplanData?.attributes?.seo?.metaTitle ? offplanData?.attributes?.seo?.metaTitle  + `| ${t("Stage Properties")}` : offplanData?.attributes?.project_name  + `| ${t("Stage Properties")}`,
      description: offplanData?.attributes?.seo?.metaDescription ? offplanData?.attributes?.seo?.metaDescription : `${t("Buy Property in Dubai - Stage Properties, Dubai's best investment property broker")}`,
      image: "url/image.webp",
    },
    alternates: {
      canonical: fullURL,
      languages: {
        'en-gb': fullURL,
        'en': fullURL,
        'x-default': fullURL,
        'ar': fullURL.replace('https://stageproperties.com', 'https://stageproperties.com/ar'),
      },
    },
  };
};

const page = async ({ params }) => {

  const { locale } = params
  const t_offplan = await getTranslations({locale, namespace: 'offplan'});

  const offplanId = params?.id;
  const offplanData = await fetchOffplanData(offplanId, locale);

  const url = `https://stageproperties.com/offplan/${params.emirateParam}/${params.cityParam}/property/${params.id}`

  const breadcrumbItems = [
    {
      title: <Link href='/offplan' className='breadcrumb'>{t_offplan('OFF PLAN')}</Link>
    },
    {
      title: <p className="breadcrumb focus">{offplanData?.attributes?.project_name.toString().toUpperCase()}</p>
    }
  ]

  const available_units = offplanData?.attributes?.available_units

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
        "name": "Off plan",
        "item": "https://stageproperties.com/offplan"
      },{
        "@type": "ListItem",
        "position": 3,
        "name": "${offplanData?.attributes?.project_name}",
        "item": "${url}"
      }]
    }`

    return (
      <>
        <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON} />
        <div id="offplanInfoPage">
          <Spotlight offplanData={offplanData} available_units={available_units} />
          <Body offplanData={offplanData} offplanId={offplanId} communitySlug={params?.cityParam} locale={locale} />
          <CTAContainer style={{marginBottom: '80px'}}/>
          {/* <FaqSection classname='faqSectionContainer'/> */}
        </div>
      </>
    );
};

export default page;
