"use client";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslations, useLocale } from 'next-intl';

import LocationIcon from '../../../../../assets/Icons/location.svg'
import BedIcon from '../../../../../assets/Icons/bedIcon.svg'
import PhoneIcon from '../../../../../assets/Icons/phone.svg'
import MailIcon from '../../../../../assets/Icons/mail.svg'
import WhatsappIcon from '../../../../../assets/Icons/whatsapp.svg'
import RightArrow from '../../../../../assets/Icons/rightArrow.svg'
import CalendarIcon from '../../../../../assets/Icons/calendarIcon.svg'

import { convertMyCurrency, convertPrice } from "@/app/[locale]/_utils/utils";
import { Link } from '@/i18n/routing';
import { whatsappForLead } from "@/app/[locale]/_utils/contants";

const OffplanPropertyCard = ({ data, bg, configuration }) => {

  const t = useTranslations('offplan_single');
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr' 

  const aed_to_usd_exchange_rate = configuration?.data?.attributes?.aed_to_usd_exchange_rate || 0.27
  const aed_to_eur_exchange_rate = configuration?.data?.attributes?.aed_to_eur_exchange_rate || 0.25
  const aed_to_gbp_exchange_rate = configuration?.data?.attributes?.aed_to_gbp_exchange_rate || 0.25
  const aed_to_inr_exchange_rate = configuration?.data?.attributes?.aed_to_inr_exchange_rate || 23.53
  const aed_to_rub_exchange_rate = configuration?.data?.attributes?.aed_to_rub_exchange_rate || 24.91

  let formatState = data?.attributes?.community?.data?.attributes?.emirate?.data?.attributes?.slug
  let formatCity = data?.attributes?.community?.data?.attributes?.slug
  let formatSlug = data?.attributes?.slug?.toLowerCase();
  const redirectURL = `/offplan/${formatState}/${formatCity}/property/${formatSlug}`;

  const project_name = data?.attributes?.project_name
  const alternativeText = data?.attributes?.featured_image?.data?.attributes?.alternativeText
  const contactText = `Hi There, I am interested in this listing: ${process.env.NEXT_PUBLIC_WEBSITE_URL}${redirectURL} from your website. I would like to get more information. Thank you.`;
  const emailSubject = "Interested in property web enquiry";

  const currency = useSelector((state) => state.currency.value);

  const starting_price_text = data?.attributes?.starting_price ? 
  isRTL ? 
  `${t('starting_from')} ${convertPrice(convertMyCurrency({value: data?.attributes?.starting_price, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, currency}), true)} ${t(currency.toLowerCase())}`
  :
  `${t('starting_from')} ${t(currency.toLowerCase())} ${convertPrice(convertMyCurrency({value: data?.attributes?.starting_price, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, currency}), false)}`
  : t('ask_for_price')

  const developer_image_url = data?.attributes?.developer?.data?.attributes?.developer_logo?.data?.attributes?.url
  const developer_name = data?.attributes?.developer?.data?.attributes?.developer_name

  const handover_info = data?.attributes?.handover_info
  const handover_quarter = data?.attributes?.handover_quarter

  return (
    <div id="offplanPropertyCard" dir={direction}>
      <Link
        href={redirectURL}
        prefetch
      >
        <div className="imageContainer">
          <Image
            src={
              data?.attributes?.featured_image?.data?.attributes?.url
                ? data?.attributes?.featured_image?.data?.attributes?.url
                : "/sample_card_image.jpeg"
            }
            fill={true}
            alt={alternativeText || project_name}
            sizes=""
          />
          <div className="specsContainer">
            {developer_image_url ? <div className="developerImageContainer">
              <img src={developer_image_url} alt={developer_name} className="developerImage" />
            </div> : null}
            {handover_info ? 
            <div className={`handover ${isRTL ? 'ar' :''}`}>
              <CalendarIcon /> 
              <span className={`handoverText ${isRTL ? 'ar' : ''}`}>Handover {handover_quarter} {handover_info}</span>
            </div> : null}
          </div>
        </div>
      </Link>
      <div className={bg ? `detailsContainer ${bg}` : "detailsContainer"}>
        <Link href={redirectURL}>
          <h3 className="title">{data?.attributes?.project_name}</h3>
        </Link>
        <div className="extraInfo">
          <Link href={redirectURL}>
            <div className="top">
              <span className="location">
                <span className={`icon ${isRTL ? 'ar' : ''}`}>
                  <LocationIcon />
                </span>
                <span className="text">
                  {data?.attributes?.community?.data?.attributes?.community_name}, {data?.attributes?.community?.data?.attributes?.emirate?.data?.attributes?.emirate_name}
                </span>
              </span>
              <span className="bed">
                <span className={`icon ${isRTL ? 'ar' : ''}`}>
                  <BedIcon />
                </span>
                <span className="text">
                  {data?.attributes?.available_units?data?.attributes?.available_units:t("Ask for Bedroom")}
                </span>
              </span>
            </div>
          </Link>

          <div className="bottom">
            <Link href={redirectURL}>
              <span className="starting">{starting_price_text}</span>
            </Link>

            <div className="oneLine">
              <div className="contactInfo">
                
                   <a href={`tel:${whatsappForLead}`} onClick={(e) => e.stopPropagation()}>
                  <span className="icon">
                    <PhoneIcon />
                  </span>
                  </a>
                <a
                  href="/contact-us#contact-form"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="icon">
                    <MailIcon />
                  </span>
                </a>
                <a
                  href={`https://wa.me/${whatsappForLead}?text=${encodeURIComponent(
                    contactText
                  )}`}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                >
                  <span className="icon">
                    <WhatsappIcon />
                  </span>
                </a>
              </div>
              <Link href={redirectURL}>
                <span className="text">
                  {t('learn_more')}
                  <span className={`icon ${isRTL ? 'ar' : ''}`}>
                    <RightArrow />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffplanPropertyCard;
