'use client'
import React from "react";
import {useTranslations} from 'next-intl';
import { useSelector } from "react-redux";
import { useLocale } from 'next-intl';

const OverviewCard = (props) => {
  const t = useTranslations('common');
  const currency = useSelector((state) => state.currency.value);
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  return (
    <div className="overviewCard">
      <div className="top gradientBorder" dir={direction}>
        <div className="left">
          <h3 className="count">{props?.count}</h3>
          <span className="type">{props?.type}</span>
        </div>
        <div className="right">
          {isRTL ? <h3 className="value">{props?.salesValue} {t(currency.toLowerCase())}</h3> : <h3 className="value">{t(currency.toLowerCase())} {props?.salesValue}</h3>}
          <span className="text">{t('sales_value')}</span>
        </div>
      </div>
      <div className="bottom gradientBorder" dir={direction}>
        <span className="label">{t('average_sales_price')}: </span>
        {isRTL ? <span className="price">{props?.price} {t(currency.toLowerCase())}</span> : <span className="price">{t(currency.toLowerCase())} {props?.price}</span>}
      </div>
    </div>
  );
};

export default OverviewCard;
