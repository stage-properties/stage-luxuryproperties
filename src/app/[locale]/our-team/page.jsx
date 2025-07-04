import React from "react";
import Image from "next/image";
import DropDownArrow from "../../../../assets/Icons/dropdownArrow.svg";
import ListingContainer from "./_ListingContainer/ListingContainer";
import { getTeamData } from "../_commonService/network";
import SubscribeNewsletter from "../_components/SubscribeNewsletter/SubscribeNewsletter";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { getTranslations } from 'next-intl/server';
import { fetchPageInfo } from "./service";

const Breadcrumb = dynamic(() =>
  import('@/app/[locale]/_components/Breadcrumb/Breadcrumb')
)

export async function generateMetadata({params}) {

  const {locale} = params

  const headerList = headers()
  const fullURL = headerList.get('x-current-url').replace('ar/', '')

  const pageInfo = await fetchPageInfo(locale)
  const title = pageInfo?.data?.attributes?.title
  const t_meet_our_team = await getTranslations({locale, namespace: 'meet_our_team'});
  const description = t_meet_our_team("Discover our seasoned team with")

  return {
    title: title,
    description: description,
    alternates: {
      canonical: fullURL,
      languages: {
        'en-gb': fullURL,
        'en': fullURL,
        'x-default': fullURL,
        'ar': fullURL.replace('https://stageproperties.com', 'https://stageproperties.com/ar'),
      },
    },
    openGraph: {
      url: fullURL,
      title: title,
      description: description,
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
}

const page = async ({params}) => {

  const { locale } = params

  const t_meet_our_team = await getTranslations({locale, namespace: 'meet_our_team'});
  const pageInfo = await fetchPageInfo(locale)
  const title = pageInfo?.data?.attributes?.title
  const subtitle = pageInfo?.data?.attributes?.subtitle

  const isRTL = locale === 'ar'
  const direction = isRTL ? "rtl" : 'ltr'

  const managementData = await getTeamData("management","page=1",6);
  const seniorAgentData = await getTeamData("senior","page=1");
  const agentData = await getTeamData("junior","page=1",6);

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
      "name": "Meet our team",
      "item": "https://stageproperties.com/our-team"
    }]
  }`

  const breadcrumbItems = [
    {
      title: <p className="breadcrumb focus">{title}</p>
    }
  ]

  return (
    <>
      <Breadcrumb items={breadcrumbItems} scriptJSON={scriptJSON}/>
      <div id="ourTeam" dir={direction}>
        <div className="featuredMembers">
          <div className="content">
            <div className="logo">
              <Image
                src="/stage-gradient-logo.png"
                fill={true}
                alt="Stage_logo"
              />
            </div>
            <h1 className="mainHeading">{title}</h1>
            <span className="dropDownArrow">
              <DropDownArrow />
            </span>
            <p className="description">
              {subtitle}
            </p>

            <div className="experienceSection">
              <ul>
                <li className="texts">
                  <span className="title">{t_meet_our_team('20+ years')}</span>
                  <span>{t_meet_our_team('OF INDUSTRY EXPERIENCE')}</span>
                </li>
                <li className="texts">
                  <span className="title">{t_meet_our_team('500+')}</span>
                  <span>{t_meet_our_team('customer served')}</span>
                </li>
                <li className="texts">
                  <span className="title">{t_meet_our_team('15+')}</span>
                  <span>{t_meet_our_team('LANGUAGES SPOKEN')}</span>
                </li>
              </ul>
              <div className="gradientLine">
                <Image src="/gradientLine.png" fill={true} alt="GradientLine" />
              </div>
            </div>
          </div>
        </div>

        <ListingContainer data={managementData?.data} heading={t_meet_our_team("management")} type="MANAGEMENT" apiType="management" APIinfo={managementData?.meta} />
        <ListingContainer data={seniorAgentData?.data} heading={t_meet_our_team("Senior Property Consultants")} apiType="senior" type="AGENT" APIinfo={seniorAgentData?.meta} />
        <ListingContainer data={agentData?.data} heading={t_meet_our_team("Property Consultants")} type="AGENT" apiType="junior" APIinfo={agentData?.meta} />
        <div className="formContainer">
          <div className="imageContainer">
            <Image src="/team_section_bg.jpeg" fill={true} alt="Our-story-bg" />
            <div className="gradient"></div>
            <div className="wrapper">

            <div className="contentContainer">
              <SubscribeNewsletter title={t_meet_our_team("GET IN TOUCH WITH ONE OF OUR EXPERTS")} type='contact-form'/>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
