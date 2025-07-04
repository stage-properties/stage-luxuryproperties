"use client"

import React from 'react'
import Whatsapp from "../../../../../assets/Icons/whatsapp.svg";
import MailIcon from "../../../../../assets/Icons/mail.svg";
import ContactIcon from "../../../../../assets/Icons/phone.svg";
import ContactForm from '../ContactForm/ContactForm';
import { whatsappForLead } from '@/app/[locale]/_utils/contants';
import { convertMyCurrency, formatNumberToArabic, numberFormat } from '@/app/[locale]/_utils/utils';
import {useDispatch} from "react-redux";
import { getContactModal } from '@/app/[locale]/redux/contactModal/contactModalSlice';
import { useSelector } from "react-redux";
import {useTranslations, useLocale} from 'next-intl';

const ContactBtns = ({propertyData, configuration}) => {
  const t = useTranslations('single_secondary');
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const aed_to_usd_exchange_rate = configuration?.data?.attributes?.aed_to_usd_exchange_rate || 0.27
  const aed_to_eur_exchange_rate = configuration?.data?.attributes?.aed_to_eur_exchange_rate || 0.25
  const aed_to_gbp_exchange_rate = configuration?.data?.attributes?.aed_to_gbp_exchange_rate || 0.25
  const aed_to_inr_exchange_rate = configuration?.data?.attributes?.aed_to_inr_exchange_rate || 23.53
  const aed_to_rub_exchange_rate = configuration?.data?.attributes?.aed_to_rub_exchange_rate || 24.91

  const messageText = `Hi ${propertyData?.attributes?.agent_name} I came across Ref. No: ${propertyData?.attributes?.property_ref_no} for the property at ${propertyData?.attributes?.community?.data?.attributes?.community_name} on your website, and I'd like to gather more information about it.`
  const dispatch = useDispatch()

  const messageHandler = () => {
    dispatch(
        getContactModal({
          contactModalRedux:true
        })
      )
  }

  const currency = useSelector((state) => state.currency.value);
  const price = propertyData?.attributes?.price ? 
  isRTL ? 
  formatNumberToArabic(
    convertMyCurrency({value: propertyData?.attributes?.price, aed_to_usd_exchange_rate, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, currency})
    , true) 
  : numberFormat(
    convertMyCurrency({value: propertyData?.attributes?.price, aed_to_usd_exchange_rate, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, currency})
  )
  : t('ask_for_price')

  return (
    <div className='contactBtns'>
        <div className="top">
            {isRTL ? <h2 className="price gradientText">{price} {t(currency.toLowerCase())}</h2> : <h2 className="price gradientText">{t(currency.toLowerCase())} {price}</h2> }
        </div>
        <div className="bottom">
            <div className="buttonContainer" style={{width: '100%'}}>
            <a
            className='gradientBorder'
              href={`https://wa.me/${whatsappForLead}?text=${
                messageText
                  ? encodeURIComponent(messageText)
                  : "window?.location?.href"
              }`}
              target="_blank"
            >
                    <span className={`icon ${isRTL ? 'ar' : ""}`}><Whatsapp/></span>
                    <span className="text gradientText">{t('whatsapp')}</span>
              </a>
                <button className='gradientBorder' onClick={messageHandler}>
                    <span className={`icon ${isRTL ? 'ar' : ""}`}><MailIcon/></span>
                    <span className="text gradientText ">{t('message')}</span>
                </button>

                <a  href={`tel:${whatsappForLead}`} className='gradientBorder'>
                    <span className={`icon ${isRTL ? 'ar' : ""}`}><ContactIcon/></span>
                    <span className="text gradientText ">{t('call_us')}</span>
                </a>
            </div>
        </div>
    </div>
  )
}

export default ContactBtns