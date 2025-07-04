'use client'

import { convertPrice, formatNumberToArabic, numberFormat } from "@/app/[locale]/_utils/utils";
import React from "react";
import PropertyTypeIcon from "../../../../../../assets/Icons/propertyTypeIcon.svg";
import BedroomIcon from "../../../../../../assets/Icons/bedIcon.svg";
import BathroomIcon from "../../../../../../assets/Icons/bathroomIcon.svg";
import AreaIcon from "../../../../../../assets/Icons/area.svg";
import DropDownArrow from "../../../../../../assets/Icons/dropdownArrow.svg";
import Parking from "../../../../../../assets/Icons/parking.svg";
import parse from "html-react-parser";
import DescriptionReadMoreBtn from "./DescriptionReadMoreBtn";
import LocationIcon from "../../../../../../assets/Icons/location.svg";
import { Link } from '@/i18n/routing';
import { useSelector } from "react-redux";
import { square_feet_to_square_meter } from "@/app/[locale]/_utils/utils";
import { useTranslations, useLocale } from "next-intl";
import { convertMyCurrency } from "@/app/[locale]/_utils/utils";

const PropertyInfo = ({ propertyData, configuration }) => {

  const t = useTranslations('single_secondary')
  const t_common = useTranslations('common')
  const locale =  useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const global_aed_to_usd_exchange_rate = configuration?.data?.attributes?.aed_to_usd_exchange_rate
  const global_aed_to_eur_exchange_rate = configuration?.data?.attributes?.aed_to_eur_exchange_rate
  const global_aed_to_gbp_exchange_rate = configuration?.data?.attributes?.aed_to_gbp_exchange_rate
  const global_aed_to_inr_exchange_rate = configuration?.data?.attributes?.aed_to_inr_exchange_rate
  const global_aed_to_rub_exchange_rate = configuration?.data?.attributes?.aed_to_rub_exchange_rate

  const aed_to_usd_exchange_rate = global_aed_to_usd_exchange_rate || 0.27
  const aed_to_eur_exchange_rate = global_aed_to_eur_exchange_rate || 0.25
  const aed_to_gbp_exchange_rate = global_aed_to_gbp_exchange_rate || 0.21
  const aed_to_inr_exchange_rate = global_aed_to_inr_exchange_rate || 23.53
  const aed_to_rub_exchange_rate = global_aed_to_rub_exchange_rate || 24.91

  const community_slug = propertyData?.attributes?.community?.data?.attributes?.slug;
  const category = propertyData?.attributes?.category?.data?.attributes?.category_name;
  const offeringType = propertyData?.attributes?.offering_type?.data?.attributes?.type;
  const emirate = propertyData?.attributes?.emirate?.data?.attributes?.emirate_name;
  const community = propertyData?.attributes?.community?.data?.attributes?.community_name;
  const propertyType = propertyData?.attributes?.property_type?.data?.attributes?.type;
  const propertyTypeSlug = propertyData?.attributes?.property_type?.data?.attributes?.slug
  const subCommunity = propertyData?.attributes?.sub_community?.data?.attributes?.sub_community_name;

  const emirate_ar = propertyData?.attributes?.emirate?.data?.attributes?.localizations?.data?.[0]?.attributes?.emirate_name
  const _emirate = locale === 'ar' ? emirate_ar ?? emirate : emirate
  // /buy/commercial/properties-for-sale
  // /rent/commercial/properties-for-rent
  
  // /buy/residential/properties-for-sale
  // /rent/residential/properties-for-rent

  const propertyTypeURL = `/${offeringType?.toLowerCase() === 'sale' ? 'buy' : 'rent'}/${category?.toLowerCase()}/${propertyTypeSlug}-for-${offeringType?.toLowerCase()}`

  // const _community = locale === 'ar' ? propertyData?.attributes?.community?.data?.attributes?.localizations?.data?.[0]?.attributes?.community_name : propertyData?.attributes?.community?.data?.attributes?.community_name
  const _community = locale === 'ar' ? propertyData?.attributes?.community?.data?.attributes?.localizations?.data?.[0]?.attributes?.community_name ?? propertyData?.attributes?.community?.data?.attributes?.community_name  : propertyData?.attributes?.community?.data?.attributes?.community_name
  const _property_name = locale === 'ar' ? propertyData?.attributes?.property_name.localizations?.data?.[0]?.attributes?.property_name ?? propertyData?.attributes?.property_name : propertyData?.attributes?.property_name
  const _primary_view = locale === 'ar' ? propertyData?.attributes?.primary_view.locatizations?.data?.[0]?.attributes?.primary_view ?? propertyData?.attributes?.primary_view : propertyData?.attributes?.primary_view

  let englishTitle = "";
  let arabicTitle = "";

  const bedrooms = propertyData?.attributes?.bedrooms

  const NumToBedroomsInAR = (number) => {
    if(number == 0) return t('studio')
    if(number == 1) return locale === 'ar' ? t('bedroom') : `${number} ${t('bedroom')}`
    else if(number == 2) return locale === 'ar' ? t('two-bedrooms') : `${number} ${t('bedrooms')}`
    else if(number > 2) return `${locale === 'ar' ? `من ${formatNumberToArabic(number)}` : number} ${t('bedrooms')}`
  }
  
  if (category === "Residential") {
    if (bedrooms == '0') {
        // When bedrooms is "0", we assume this is a studio
        englishTitle = `${t('studio')} ${t('for')} ${t(offeringType.toLowerCase())} ${t('in')} ${_community}, ${_emirate}`;
        // Arabic order: you might want to reverse certain parts and use an Arabic comma (،)
        arabicTitle = `${t('studio')} ${t('for')}${t(offeringType.toLowerCase())} ${t('in')} ${_community}، ${_emirate}`;
    } else if (propertyData?.attributes?.bedrooms) {
        // When there is a bedroom count
        englishTitle = `${NumToBedroomsInAR(bedrooms)} ${t_common(propertyType?.toLowerCase())} ${t('for')} ${t(offeringType.toLowerCase())} ${t('in')} ${_community}, ${_emirate}`;
        arabicTitle = `${t_common(propertyType?.toLowerCase())} ${NumToBedroomsInAR(bedrooms)}  ${t('for')}${t(offeringType.toLowerCase())} ${t('in')} ${_community}، ${_emirate}`;
    } else {
        // Fallback when bedroom count is not provided
        englishTitle = `${t_common(propertyType?.toLowerCase())} ${t('for')} ${t(offeringType.toLowerCase())} ${t('in')} ${_community}, ${_emirate}`;
        arabicTitle = `${t_common(propertyType?.toLowerCase())} ${t('for')}${t(offeringType.toLowerCase())} ${t('in')} ${_community}، ${_emirate}`;
    }
  } else {
      // Fallback for non-residential categories
      englishTitle = `${t_common(propertyType?.toLowerCase())} ${t('for')} ${t(offeringType.toLowerCase())} ${t('in')} ${_community}, ${_emirate}`;
      arabicTitle = `${t_common(propertyType?.toLowerCase())} ${t('for')}${t(offeringType.toLowerCase())} ${t('in')} ${_community}، ${_emirate}`;
  }

  const chosenTitle = propertyData?.attributes?.chosen_title
  const property_ref_no = propertyData?.attributes?.property_ref_no
  const title = chosenTitle || locale === 'ar' ? arabicTitle +  " " + property_ref_no.replaceAll('-', ' - ') : englishTitle + " " + property_ref_no.replaceAll('-', ' - ') 
  
  const currency = useSelector((state) => state.currency.value);
  const areaUnit = useSelector((state) => state.areaUnit.value);

  const unit_area = propertyData?.attributes?.unit_area ? Math.round(Number(propertyData?.attributes?.unit_area) * (areaUnit === 'ft²' ? 1 : square_feet_to_square_meter)) : 'Ask for unit area';
  const price = propertyData?.attributes?.price ? 
  isRTL ? 
  formatNumberToArabic(convertMyCurrency({value: propertyData?.attributes?.price, currency, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate}), true)
  : 
  numberFormat(convertMyCurrency({value: propertyData?.attributes?.price, currency, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate})) 

  : 
  t('ask_for_price')
  const permit_number = propertyData?.attributes?.permit_number

  return (
    <div className="propertyInfo">
      {propertyData?.attributes?.is_archived && (
        <div style={{color: 'white', width: 'fit-content', 
          paddingTop: '1rem',
          paddingBottom: '1rem',
          marginBottom: '1rem',
          fontWeight: '600',
          display: 'flex',
          paddingLeft: '1rem',
          fontSize: '.9rem',
          paddingRight: '1rem',
          alignItems: 'center'
        }} className="gradientBorder">{t('not_available')}</div>
      )}
      <h1 className="title">
        {title}
      </h1>
      <div style={{display: 'flex', marginBottom: '1rem'}}>
        <h2 className="price" style={{width: 'fit-content', marginRight: '1rem', marginBottom: '0rem', fontFamily: 'unset'}}>
          {isRTL ? `${price} ${t(currency.toLowerCase())}` : `${currency} ${price}`}
        </h2>
      </div>
      <div className="metaInfo gradientBorder">
        <ul className="items">
          {propertyType && (
            <li className="item">
              <span className={`icon ${isRTL ? 'ar': ''}`}>
                <PropertyTypeIcon />
              </span>
              <span className="text">{t_common(propertyType.toLowerCase())}</span>
            </li>
          )}

          {propertyData?.attributes?.bedrooms && (
            <li className="item">
              <span className={`icon ${isRTL ? 'ar' : ''}`}>
                <BedroomIcon />
              </span>
              <span className="text">
                {propertyData?.attributes?.bedrooms == "0" ||
                propertyData?.attributes?.bedrooms.toString().toLowerCase() === "studio"
                  ? t("studio")
                  : isRTL ? formatNumberToArabic(propertyData?.attributes?.bedrooms) : propertyData?.attributes?.bedrooms
                }
              </span>
            </li>
          )}

          {propertyData?.attributes?.no_of_bathroom && (
            <li className="item">
              <span className={`icon ${isRTL ? 'ar' : ''}`}>
                <BathroomIcon />
              </span>
              <span className="text">
                {isRTL ? formatNumberToArabic(propertyData?.attributes?.no_of_bathroom) : propertyData?.attributes?.no_of_bathroom}
              </span>
            </li>
          )}

          {propertyData?.attributes?.parking && (
            <li className="item">
              <span className={`icon ${isRTL ? 'ar' : ''}`}>
                <Parking />
              </span>
              <span className="text">{isRTL ? formatNumberToArabic(propertyData?.attributes?.parking) : propertyData?.attributes?.parking}</span>
            </li>
          )}

          {propertyData?.attributes?.unit_area && (
            <li className="item">
              <span className={`icon ${isRTL ? 'ar' : ''}`}>
                <AreaIcon />
              </span>
              <span className="text">
                {isRTL ? formatNumberToArabic(unit_area) : unit_area}
                {" "}{t(areaUnit.toString().toLowerCase())}
              </span>
            </li>
          )}
          {_community && (
            <li className={`item location ${isRTL ? 'ar' : ''}`}>
              <span className={`icon ${isRTL ? "ar" : ''}`}>
                <LocationIcon />
              </span>
              <span className="text">{_community}</span>
            </li>
          )}
        </ul>
      </div>

      <div className="description">
        <h2 className="heading">{t('description')}</h2>
        <div
          id="descriptionContainer"
          className="content"
        >
          {propertyData?.attributes?.content &&
            parse(propertyData?.attributes?.content?.split("\n")?.join("<br>"))}
        </div>
      </div>

      <div className="listingDetails gradientBorder">
        <h2 className="heading">{t('additional_details')}</h2>
        <ul className="pInfo">
          {community && (
            <li className="list">
              <div className="left">
                <h6 className="label">{t('location')}</h6>
              </div>
              <div className="right">
                <h4 className="value">
                  <Link href={`/areas-and-communities/${community_slug}`}>
                    <span className="textUnderline">{_community}</span>
                  </Link>
                  {subCommunity ? ", " + subCommunity : null}
                </h4>
              </div>
            </li>
          )}
          {propertyData?.attributes?.property_name && (
            <li className="list">
              <div className="left">
                <h6 className="label">{t('property_name')}</h6>
              </div>
              <div className="right">
                <h4 className="value">
                  {_property_name}
                </h4>
              </div>
            </li>
          )}

          {propertyData?.attributes?.permit_number && (
            <li className="list">
              <div className="left">
                <h6 className="label">{t('permit_number')}</h6>
              </div>
              <div className="right">
                {permit_number ? <h4 className="value">
                  {isRTL ? formatNumberToArabic(permit_number) : permit_number}
                </h4> : t('N/A')}
              </div>
            </li>
          )}
          {_emirate && (
            <li className="list">
              <div className="left">
                <h6 className="label">{t('emirate')}</h6>
              </div>
              <div className="right">
                <h4 className="value">{_emirate}</h4>
              </div>
            </li>
          )}
          {propertyType && (
            <li className="list">
              <div className="left">
                <h6 className="label">{t('property_type')}</h6>
              </div>
              <div className="right">
                <Link href={propertyTypeURL}>
                    <span className="textUnderline">{t_common(propertyType.toLowerCase())}</span>
                </Link>
              </div>
            </li>
          )}
          {propertyData?.attributes?.property_ref_no && (
            <li className="list">
              <div className="left">
                <h6 className="label">{t('unit_reference')}</h6>
              </div>
              <div className="right">
                <h4 className="value">
                  {propertyData?.attributes?.property_ref_no}
                </h4>
              </div>
            </li>
          )}
          {propertyData?.attributes?.cheques &&
            propertyData?.attributes?.cheques !== "0" &&
            offeringType === "Rent" && (
              <li className="list">
                <div className="left">
                  <h6 className="label">{t('cheques')}</h6>
                </div>
                <div className="right">
                  <h4 className="value">{isRTL ? formatNumberToArabic(propertyData?.attributes?.cheques) : propertyData?.attributes?.cheques}</h4>
                </div>
              </li>
            )}

          <li className="list">
            <div className="left">
              <h6 className="label">{t("status_of_project")}</h6>
            </div>
            <div className="right">
              <h4 className="value">
                {propertyData?.attributes?.is_offplan ? t("Off-Plan") : t("Ready")}
              </h4>
            </div>
          </li>
          {_primary_view && (
            <li className="list">
              <div className="left">
                <h6 className="label">{t('primary_view')}</h6>
              </div>
              <div className="right">
                <h4 className="value">
                  {_primary_view}
                </h4>
              </div>
            </li>
          )}
          {offeringType && (
            <li className="list">
              <div className="left">
                <h6 className="label">{t('purpose')}</h6>
              </div>
              <div className="right">
                <h4 className="value">{t(offeringType.toLowerCase())}</h4>
              </div>
            </li>
          )}
        </ul>
      </div>

      {propertyData?.attributes?.property_features?.data.length > 0 ? <div className="featuresAndAmenities">
        <h2 className="heading">{t('features_and_amenities')}</h2>
        <ul className="listItems">
          {propertyData?.attributes?.property_features?.data?.map((item) => (
            <li className="item" key={item?.id}>
              <span className={`icon ${isRTL ? 'ar' : ''}`}>
                {item?.attributes?.logo?.data?.attributes?.url ? <img style={{rotate: '90deg', filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)'}} width={32} height={32} src={item?.attributes?.logo?.data?.attributes?.url} /> : <DropDownArrow />}
              </span>
              <span className="text">{locale === 'ar' ? item?.attributes?.localizations?.data?.[0]?.attributes?.feature_name ?? item?.attributes?.feature_name : item?.attributes?.feature_name}</span>
            </li>
          ))}
        </ul>
      </div> : null}
    </div>
  );
};

export default PropertyInfo;
