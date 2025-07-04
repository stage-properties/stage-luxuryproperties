import React from "react";
import { fetchSingleSecondaryProperty } from "../service";
import GallerySectionSecondary from "./GallerySectionSecondary/GallerySectionSecondary";
import AgentStickyContainer from "@/app/[locale]/offplan/[emirateParam]/[cityParam]/property/[id]/_components/AgentStickyContainer/AgentStickyContainer";
import PropertyInfo from "./PropertyInfo/PropertyInfo";
import SecondaryLocation from "./SecondaryLocation/SecondaryLocation";
import PoupupFormContainer from "@/app/[locale]/offplan/[emirateParam]/[cityParam]/property/[id]/_components/PoupuFormContainer/PoupupFormContainer";
import PropertyContactForm from "@/app/[locale]/_components/PropertyContactForm/PropertyContactForm";
import AgentStickyV2 from "@/app/[locale]/_components/AgentStickyV2/AgentStickyV2";
import Carousel from "@/app/[locale]/_components/NoData/Carousel";
import PropertyCard from "@/app/[locale]/_components/PropertyCard/PropertyCard";
import { fetchAPI } from "@/app/[locale]/_utils/fetch";
import { getTranslations } from "next-intl/server";

const SecondaryDetailsPage = async ({ SecondaryPropertyData, alternativeText, locale }) => {
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const t = await getTranslations('common')

  const property_ref_no = SecondaryPropertyData?.data?.attributes?.property_ref_no
  const slug = SecondaryPropertyData?.data?.attributes?.community?.data?.attributes?.slug
  const offeringType = SecondaryPropertyData?.data?.attributes?.offering_type?.data?.attributes?.type
  const similarProperties = await fetchAPI(`secondary/communities/${slug}?offeringType=${offeringType}&locale=${locale}`, 'noCache')

  const similarPropertiesFilteres = similarProperties?.data?.filter(item => item?.attributes?.property_ref_no !== property_ref_no)

  return (
    <div id="secondaryDetailsPage">
        <div className="wrapper">
        <GallerySectionSecondary
            galleryImages={
              SecondaryPropertyData?.data?.attributes?.gallery_images?.data
            }
            alternativeText={alternativeText}
          />
        </div>
       
      <div className="wrapper" dir={direction}>
        <div className="leftContainer">
          <PropertyInfo propertyData={SecondaryPropertyData?.data} configuration={SecondaryPropertyData?.configuration} />
        </div>
        <div className="rightContainer">
          <AgentStickyV2 propertyData={SecondaryPropertyData?.data} configuration={SecondaryPropertyData?.configuration} />
        </div>
      </div>
      <div dir={direction}>
        <SecondaryLocation propertyData={SecondaryPropertyData?.data} />
        <PoupupFormContainer />
      </div>
      {similarPropertiesFilteres?.length > 0 ? <div>
        <div className="_wrapper similiarPropertyComponent" style={{marginTop: '3rem'}}>
          <h2 className="mainHeading similarPropertyComponentHeading">{t('similiar properties')}</h2>
          <Carousel data={{data: similarPropertiesFilteres}} Card={PropertyCard} />
        </div>
      </div> : null}
    </div>
  );
};

export default SecondaryDetailsPage;
