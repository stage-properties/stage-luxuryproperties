import React from "react";
import { useTranslations, useLocale } from 'next-intl';
import { formatNumberToArabic, numberFormat } from "@/app/[locale]/_utils/utils";

const PaymentPlan = ({ paymentInfo }) => {
  
  const t = useTranslations('offplan_single');
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  return (
    <div className="payment" dir={direction}>
      {isRTL ? 
      <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t('Payment plan')} {paymentInfo?.plan_name}</h2>
      : 
      <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>Payment plan {paymentInfo?.plan_name}</h2>
      }

      <ul className='listPlans gradientBorder isDesktop' style={{justifyContent: paymentInfo?.plans.length === 2 ? 'space-around' : ''}}>
        {paymentInfo?.plans?.map((item, index) => (
          <li className="item" key={index}>
            <span className="value">{item?.percentage}</span>
            <span className="label">{item?.label}</span>
          </li>
        ))}
      </ul>
      <ul className="listPlans isMobile">
        {paymentInfo?.plans?.map((item, index) => (
          <li className={`item ${isRTL ? 'ar' : ''}`} key={index}>
            <span className="value">{item?.percentage}</span>
            <span className="label">{item?.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentPlan;
