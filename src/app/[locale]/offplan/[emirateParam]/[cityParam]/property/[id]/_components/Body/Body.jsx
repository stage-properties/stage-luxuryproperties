import React from "react";
import SimiliarSection from "@/app/[locale]/_components/SimiliarSection/SimiliarSection";
import LocationInfo from "../LocationInfo/LocationInfo";
import CurrencyAndPlan from "../CurrencyAndPlan/CurrencyAndPlan";
import PropertyInfo from "../PropertyInfo/PropertyInfo";
import Description from "../Description/Description";
import FloorPlans from "../FloorPlans/FloorPlans";
import PropertyPrice from "../PropertyPrice/PropertyPrice";
import AboutDeveloper from "../AboutDeveloper/AboutDeveloper";
import InvestSection from "../InvestSection/InvestSection";
import ContactAgentForm from "@/app/[locale]/_components/ContactAgentForm/ContactAgentForm";
import { getRandomAgentImage } from "@/app/[locale]/_commonService/network";
import Faq from "@/app/[locale]/_components/Faq/component/Faq";
import GradientLine from "@/app/[locale]/_components/GradientLine/GradientLine";
import GallerySectionSecondary from "@/app/[locale]/(secondary)/_components/GallerySectionSecondary/GallerySectionSecondary";
import { strapiRichTextToString } from "@/app/[locale]/_utils/utils";
import PropertyCard from "@/app/[locale]/_components/PropertyCard/PropertyCard";
import Carousel from "@/app/[locale]/_components/NoData/Carousel";
import { getTranslations } from 'next-intl/server';
import AboutCommunity from "../AboutCommunity/AboutCommunity";
import StickyFooter from "../StickyFooter/StickyFooter";
import { toPascalCase } from "@/app/[locale]/_utils/utils";
import Banner from "@/app/[locale]/_components/Banner/Banner";

const Body = async ({offplanData, offplanId, communitySlug, locale}) => {
  const t = await getTranslations({locale, namespace: 'offplan_single'});

  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const formRef = ""
  const random_agent_image = await getRandomAgentImage()

  let project_name = offplanData?.attributes?.project_name
  let developer_name = offplanData?.attributes?.developer?.data?.attributes?.developer_name
  let community_name = offplanData?.attributes?.community?.data?.attributes?.community_name
  const secondary_properties = offplanData?.attributes?.secondary_properties
  
  const secondary_properties_for_sale = secondary_properties?.data?.filter((item) => item?.attributes?.offering_type?.data?.attributes?.type === 'Sale')
  const secondary_properties_for_rent = secondary_properties?.data?.filter((item) => item?.attributes?.offering_type?.data?.attributes?.type === 'Rent')

  let developer_description = offplanData?.attributes?.developer?.data?.attributes?.developer_description;
  let content = offplanData?.attributes?.content

  const faqData = [
    {
      key: 'faq_location',
      question: `Where is ${project_name} by ${developer_name} located?`,
    },
    {
      key: 'faq_completion_handover_date',
      question: `When is the completion/handover date for ${project_name} by ${developer_name}?`,
    },
    {
      key: 'faq_amenities_available',
      question: `What are the amenities available in ${project_name} by ${developer_name}?`,
    },
    {
      key: 'faq_types_of_residences_available',
      question: `What types of residences are available at ${project_name} by ${developer_name} in ${community_name}?`,
    },
    {
      key: 'faq_payment_plan_available',
      question: `What is the payment plan available for ${project_name} by ${developer_name}?`,
    },
  ];
  
  const faqDataAR = [
    {
      key: 'faq_location',
      question: `أين يقع مشروع ${project_name} من قبل ${developer_name}؟`,
    },
    {
      key: 'faq_completion_handover_date',
      question: `متى موعد الإنجاز/التسليم لمشروع ${project_name} من قبل ${developer_name}؟`,
    },
    {
      key: 'faq_amenities_available',
      question: `ما هي وسائل الراحة المتوفرة في مشروع ${project_name} من قبل ${developer_name}؟`,
    },
    {
      key: 'faq_types_of_residences_available',
      question: `ما هي أنواع المساكن المتوفرة في مشروع ${project_name} من قبل ${developer_name} في ${community_name}؟`,
    },
    {
      key: 'faq_payment_plan_available',
      question: `ما هي خطة الدفع المتوفرة لمشروع ${project_name} من قبل ${developer_name}؟`,
    },
  ];

  const _faqData = isRTL ? faqDataAR : faqData
  
  const faqs = _faqData.reduce((acc, { key, question }) => {
    const answer = offplanData?.attributes?.[key];
    acc.push({ question, answer });
    return acc;
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs
      ?.filter(faq => strapiRichTextToString(faq.answer))
      .map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": strapiRichTextToString(faq.answer)
        }
      }))
  };
  
  const structuredDataJSON = JSON.stringify(structuredData);
  const showFAQs = faqs.some(({answer}) => (strapiRichTextToString(answer) !== '' && strapiRichTextToString(answer) !== null))
  const alternative_text = `${project_name} by ${developer_name}`

  const projectName = toPascalCase(developer_name) +  '_' + toPascalCase(community_name) + '_' + toPascalCase(project_name)
  
  return (
    <>
      {showFAQs ? <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: structuredDataJSON }} /> : null}
      <div className="bodyContainer">
        <div className="offplanContainerLeft">
          {offplanData?.attributes?.content && (
            <Description
              offplanDataContent={content}
              projectName={projectName}
              project_name={project_name}
              pageName={offplanData?.attributes?.slug}
              locale={locale}
            />
          )}
          {offplanData?.attributes?.gallery_images?.data?.length > 0 && (
            <div id="secondaryDetailsPage" className="wrapper" 
            style={{padding: 'unset', paddingBottom: '50px'}}
            >
              <GallerySectionSecondary galleryImages={offplanData?.attributes?.gallery_images?.data} alternativeText={alternative_text} />
            </div>
          )}

          <PropertyInfo offplanData={offplanData} />
          <FloorPlans offplanData={offplanData} />
          <PropertyPrice offplanData={offplanData} locale={locale} />
          <CurrencyAndPlan formRef={formRef} offplanData={offplanData} />
          <div className='wrapper gradientBorder' style={{marginBottom: '5rem'}}>
            <ContactAgentForm agentImageURL={random_agent_image.url} formRef={formRef} title={t("Talk to an agent")} projectName={projectName} pageName={offplanData?.attributes?.slug}/>
          </div>
          <div className="wrapper" style={{marginBottom: '5rem', marginTop :'5rem'}}>
            <Banner type={'LDR'} />
          </div>
          <LocationInfo offplanData={offplanData} projectName={projectName} pageName={offplanData?.attributes?.slug} />
          <AboutDeveloper offplanData={offplanData} developer_description={developer_description} />
          <AboutCommunity offplanData={offplanData} />
          <InvestSection projectName={projectName} pageName={offplanData?.attributes?.slug} />
          {showFAQs && (
            <div dir={direction} className="gradientBorder" style={{borderLeft: 'unset', borderRight: 'unset', borderWidth: '5px', borderBottom: 'unset'}}>
              <Faq data={faqs} style={{marginBottom: '80px', marginTop: '80px'}} />
            </div>
          )}

          <div className="wrapper" style={{marginBottom: '5rem'}}>
            <Banner type={'LDR'} />
          </div>
          {showFAQs && (<div style={{marginBottom: '6rem'}}>
            <GradientLine width='80%' />
          </div>)}
          <div className="wrapper">
            <SimiliarSection communitySlug={communitySlug} propertyId={offplanId} type="OFFPLAN" locale={locale} />
          </div>

          <div className="wrapper similiarPropertyComponent">
              {secondary_properties_for_sale?.length ? (
                <>
                {isRTL ? <>
                  <h2 className="mainHeading similarPropertyComponentHeading">{project_name} {t("Secondary properties for Sale In")}</h2>
                  <p className="similarPropertyComponentSubheading">{project_name} {t("Discover secondary properties for sale In")}</p>
                </> : <>
                <h2 className="mainHeading similarPropertyComponentHeading">{t("Secondary properties for Sale In")} {project_name}</h2>
                <p className="similarPropertyComponentSubheading">{t("Discover secondary properties for sale In")} {project_name}</p>
                </>}
                  <div className="carouselSection">
                      <Carousel data={{data: secondary_properties_for_sale}} Card={PropertyCard} />
                  </div>
                </>
              ): null }
              {secondary_properties_for_rent?.length ? (
                <>
                  {isRTL ?
                    <>
                      <h2 className="mainHeading similarPropertyComponentHeading">{project_name} {t("Secondary properties for Rent In")}</h2>
                      <p className="similarPropertyComponentSubheading">{project_name} {t("Discover secondary properties for Rent In")}</p>
                    </> : 
                    <>
                      <h2 className="mainHeading similarPropertyComponentHeading">{t("Secondary properties for Rent In")} {project_name}</h2>
                      <p className="similarPropertyComponentSubheading">{t("Discover secondary properties for Rent In")} {project_name}</p>
                    </>
                }
                  <div className="carouselSection">
                      <Carousel data={{data: secondary_properties_for_rent}} Card={PropertyCard} />
                  </div>
                </>
                ): null }
            </div>


          <div className="gradientBorder" style={{borderLeft: 'unset', borderRight: 'unset', borderBottom: 'unset', borderWidth: '5px'}}>
            <div className="wrapper">
              <div className="gradientBorder" style={{marginTop: '80px', marginBottom: '80px'}}>
                <ContactAgentForm agentImageURL={random_agent_image.url} formRef={formRef} title={t("GET IN TOUCH WITH ONE OF OUR EXPERTS")} projectName={projectName} pageName={offplanData?.attributes?.slug}/>
              </div>
            </div>
          </div>
          <StickyFooter offplanData={offplanData} projectName={projectName} />
        </div>
      </div>
    </>
  );
};

export default Body;
