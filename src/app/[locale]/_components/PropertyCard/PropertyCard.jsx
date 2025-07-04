'use client'

import React from "react";
import LocationIcon from "../../../../../assets/Icons/location.svg";
import BedIcon from "../../../../../assets/Icons/bedIcon.svg";
import BathroomIcon from "../../../../../assets/Icons/bathroomIcon.svg";
import PhoneIcon from "../../../../../assets/Icons/phone.svg";
import MailIcon from "../../../../../assets/Icons/mail.svg";
import WhatsappIcon from "../../../../../assets/Icons/whatsapp.svg";
import AreaIcon from "../../../../../assets/Icons/area.svg";

import { convertMyCurrency, convertPrice, formatNumberToArabic } from "@/app/[locale]/_utils/utils";
import { Link } from '@/i18n/routing';
import ImageComponent from "./ImageComponent";
import { whatsappForLead } from "@/app/[locale]/_utils/contants";

import { square_feet_to_square_meter } from "@/app/[locale]/_utils/utils";
import { useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";

const PropertyCard = ({ data, configuration }) => {

  const t = useTranslations('secondary')
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : "ltr"

  const aed_to_usd_exchange_rate = configuration?.data?.attributes?.aed_to_usd_exchange_rate || 0.27
  const aed_to_eur_exchange_rate = configuration?.data?.attributes?.aed_to_eur_exchange_rate || 0.25
  const aed_to_gbp_exchange_rate = configuration?.data?.attributes?.aed_to_gbp_exchange_rate || 0.25
  const aed_to_inr_exchange_rate = configuration?.data?.attributes?.aed_to_inr_exchange_rate || 23.53
  const aed_to_rub_exchange_rate = configuration?.data?.attributes?.aed_to_rub_exchange_rate || 24.91

  const messageText = `Hi ${data?.attributes?.agent_name} I came across Ref. No: ${data?.attributes?.property_ref_no} for the property at ${data?.attributes?.community?.data?.attributes?.community_name} on your website, and I'd like to gather more information about it.`;

  let offeringType =
    data?.attributes?.offering_type?.data?.attributes?.type === "Sale"
      ? "buy"
      : "rent";
  let redirectURL = `/${offeringType}/${data?.attributes?.slug}`;

  const currency = useSelector((state) => state.currency.value);
  const areaUnit = useSelector((state) => state.areaUnit.value);
  
  const price = data?.attributes?.price ? 
  isRTL ? 
  convertPrice(convertMyCurrency({value: data?.attributes?.price, aed_to_usd_exchange_rate, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, currency}), locale)
  :
  convertPrice(convertMyCurrency({value: data?.attributes?.price, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, currency}))
   : 'Ask for price'
  const unit_area = data?.attributes?.unit_area ? Math.round(Number(data?.attributes?.unit_area) * (areaUnit === 'ft²' ? 1 : square_feet_to_square_meter)) : 'Ask for unit area';

  // const { translatedText, loading, error } = useTranslationAuto({ text: data?.attributes?.property_title, locale });

  const community_name = data?.attributes?.community?.data?.attributes?.community_name
  const community_ar = data?.attributes?.community?.data?.attributes?.localizations?.data[0]?.attributes?.community_name
  const community = locale === 'ar' ? community_ar ?? community_name : community_name

  return (
    <div id="propertyCard" dir={direction}>
      <Link
        href={redirectURL}
        prefetch
        // onClick={(e) => {
        //   e.stopPropagation();
        // }}
      >
        <ImageComponent data={data} />
        <div className="detailsContainer">
          <div style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
            }}>
            {isRTL ? <span className="price">{price} {t(currency.toString().toLowerCase())}</span>  : <span className="price">{t(currency.toString().toLowerCase())} {price}</span>}
            <div style={{
              color: 'white', 
              width: 'fit-content', 
              padding: '1rem',
              paddingTop: '0.6rem',
              paddingBottom: '0.6rem',
              marginBottom: '1rem',
              fontWeight: '600',
              fontSize: '.8rem',
              alignItems: 'center',
              visibility: data?.attributes?.is_archived ? 'visible' : 'hidden'
            }} 
            className="gradientBorder"
            >{t('not_available')}
            </div>
          </div>
          <h3 className="title">{data?.attributes?.property_title}</h3>
          <span className="location">
            <span className="icon">
              <LocationIcon />
            </span>
            {community}
            {/* {data?.attributes?.property_name?", " + data?.attributes?.property_name:null} */}
          </span>
          <div className="extraInfo">
            <div className="top">
              {data?.attributes?.bedrooms && (
                <span className="bed">
                  <span className={`icon ${isRTL ? 'ar' : ""}`}>
                    <BedIcon />
                  </span>
                  <span className="text">
                    {isRTL ? formatNumberToArabic(data?.attributes?.bedrooms) : data?.attributes?.bedrooms}
                  </span>
                </span>
              )}

              {data?.attributes?.no_of_bathroom && (
                <span className={`bathroom ${isRTL ? 'ar' : ''}`}>
                  <span className="icon">
                    <BathroomIcon />
                  </span>
                  <span className={`text ${isRTL ? 'ar' : ''}`}>
                    {isRTL ? formatNumberToArabic(data?.attributes?.no_of_bathroom) : data?.attributes?.no_of_bathroom }
                  </span>
                </span>
              )}

              <span className={`area ${isRTL ? 'ar' : ''}`}>
                <span className={`icon ${isRTL ? 'ar' : ''}`}>
                  <AreaIcon />
                </span>
                <span className={`text ${isRTL ? 'ar' : ""}`}>
                  {isRTL ? formatNumberToArabic(unit_area) : unit_area} {t(areaUnit)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="bottom">
        <div className="contactInfo">
          <a href={`tel:${whatsappForLead}`}>
            <span className="icon">
              <PhoneIcon />
            </span>
          </a>
          <Link href="/contact-us#contact-form">
            <span className="icon">
              <MailIcon />
            </span>
          </Link>
          <a
            href={`https://wa.me/${whatsappForLead}?text=${encodeURIComponent(
              messageText
            )}`}
            target="_blank"
          >
            <span className="icon">
              <WhatsappIcon />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
