import React from "react";
import Image from "next/image";
import FloorPlan from "./FloorPlan";
import { numberFormat, formatNumberToArabic, square_feet_to_square_meter } from "@/app/[locale]/_utils/utils";
import { Link } from '@/i18n/routing';
import GradientLine from "@/app/[locale]/_components/GradientLine/GradientLine";
import Banner from "@/app/[locale]/_components/Banner/Banner";

const PropertyInfoServer = ({ offplanData, areaUnit, t, isRTL, direction }) => {
  // Calculate the unit area based on the provided areaUnit prop
  const unit_area = Math.round(
    Number(offplanData?.attributes?.area_starting_from * (areaUnit === 'ft²' ? 1 : square_feet_to_square_meter)) || 0
  );

  return (
    <div className="propertyInfo gradientBorder" style={{ borderBottom: 'unset' }} dir={direction}>
      <div className={offplanData?.floor_plan?.length > 0 ? "bgImageContainer" : "bgImageContainer noHeight"}>
        <Image src="/ourStoryBG.jpeg" fill alt="Our-story-bg" />
        <div className="gradient"></div>

        <div className="contentContainer">
          <div className="wrapper">
            <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t('Property Information')}</h2>
            <ul className="pInfo">
              <li className={`list ${isRTL ? 'ar' : ''}`}>
                <div className="left">
                  <span className="label">{t('Location')}</span>
                </div>
                <div className="right">
                  <span className="value">
                    {offplanData?.attributes?.community?.data?.attributes?.community_name},{" "}
                    {offplanData?.attributes?.community?.data?.attributes?.emirate?.data?.attributes?.emirate_name},{" "}
                    {t('UAE')}
                  </span>
                </div>
              </li>
              <li className={`list ${isRTL ? 'ar' : ''}`}>
                <div className="left">
                  <span className="label">{t('Developer')}</span>
                </div>
                <div className="right">
                  <Link href={`/developers/${offplanData?.attributes?.developer?.data?.attributes?.slug}`}>
                    <span className="textUnderline">{offplanData?.attributes?.developer?.data?.attributes?.developer_name}</span>
                  </Link>
                </div>
              </li>
              <li className={`list ${isRTL ? 'ar' : ''}`}>
                <div className="left">
                  <span className="label">{t("Status of Project")}</span>
                </div>
                <div className="right">
                  <span className="value">{offplanData?.attributes?.project_status ? offplanData?.attributes?.project_status : t("Ask for status")}</span>
                </div>
              </li>
              <li className={`list ${isRTL ? 'ar' : ''}`}>
                <div className="left">
                  <span className="label">{t("Area from")}</span>
                </div>
                <div className="right">
                  <span className="value">
                    {unit_area
                      ? isRTL
                        ? `${formatNumberToArabic(unit_area)} ${t(areaUnit)}`
                        : `${numberFormat(unit_area)} ${t(areaUnit)}`
                      : t('ask_for_area')}
                  </span>
                </div>
              </li>
              <li className={`list ${isRTL ? 'ar' : ''}`}>
                <div className="left">
                  <span className="label">{t('Communities')}</span>
                </div>
                <div className="right">
                  <Link href={`/areas-and-communities/${offplanData?.attributes?.community?.data?.attributes?.slug}`}>
                    <span className="textUnderline">{offplanData?.attributes?.community?.data?.attributes?.community_name}</span>
                  </Link>
                </div>
              </li>
              <li className={`list ${isRTL ? 'ar' : ''}`}>
                <div className="left">
                  <span className="label">{t("Type of Project")}</span>
                </div>
                <div className="right">
                  {offplanData?.attributes?.property_types?.data?.length ? (
                    <span className="value">
                      {offplanData?.attributes?.property_types?.data?.map(
                        (item, index) =>
                          item?.attributes?.type +
                          (index + 2 === offplanData?.attributes?.property_types?.data?.length ? " and " : index !== offplanData?.attributes?.property_types?.data?.length - 1 ? ", " : "")
                      )}
                    </span>
                  ) : (
                    <span className="value">{t("Ask for type")}</span>
                  )}
                </div>
              </li>
            </ul>
            {offplanData?.floor_plan?.length > 0 && (
              <div className="gradientLine">
                <Image src="/gradientLine.png" fill alt="GradientLine" />
              </div>
            )}
            {offplanData?.floor_plan?.length > 0 ? (
              <FloorPlan title={offplanData?.title} floorPlan={offplanData?.floor_plan} />
            ) : null}
          </div>
        </div>
      </div>
      <div className="wrapper" style={{ marginTop: '0rem', marginBottom: '5rem' }}>
        <Banner type={'LDR'} />
      </div>
      <GradientLine width='75%' />
    </div>
  );
};

export default PropertyInfoServer;