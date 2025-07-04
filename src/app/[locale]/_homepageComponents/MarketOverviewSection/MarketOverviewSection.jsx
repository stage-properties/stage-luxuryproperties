'use client'
import OverviewCard from "@/app/[locale]/_components/OverviewCard/OverviewCard";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { getMarketOveriview } from "../service";
import { useTranslations, useLocale } from 'next-intl';
import { formatNumberToArabic } from "@/app/[locale]/_utils/utils";
import { convertMyCurrency } from "@/app/[locale]/_utils/utils";

import {
  convertPrice,
  convertToDate,
  numberFormat,
} from "@/app/[locale]/_utils/utils";
import SubscribeNewsletter from "@/app/[locale]/_components/SubscribeNewsletter/SubscribeNewsletter";

const MarketOverviewSection = () => {
  const t = useTranslations('common');
  const locale = useLocale()

  const [marketOverviewData,setMarketOverviewData] = useState()

  const currency = useSelector((state) => state.currency.value);

  useEffect(()=>{
    fetchMarketOverview()
  },[])
  const fetchMarketOverview = async () => {
  const marketOverviewData = await getMarketOveriview();
  // setMarketOverviewData(marketOverviewData?.data?.attributes)
  setMarketOverviewData(marketOverviewData)
  }

  const aed_to_usd_exchange_rate = marketOverviewData?.configuration?.data?.attributes?.aed_to_usd_exchange_rate
  const aed_to_eur_exchange_rate = marketOverviewData?.configuration?.data?.attributes?.aed_to_eur_exchange_rate
  const aed_to_gbp_exchange_rate = marketOverviewData?.configuration?.data?.attributes?.aed_to_gbp_exchange_rate
  const aed_to_inr_exchange_rate = marketOverviewData?.configuration?.data?.attributes?.aed_to_gbp_exchange_rate
  const aed_to_rub_exchange_rate = marketOverviewData?.configuration?.data?.attributes?.aed_to_rub_exchange_rate

  const isArabic = locale === 'ar'

  const aparment_sale_price = convertPrice(convertMyCurrency({value: marketOverviewData?.data?.attributes?.aparment_sale_price, currency, aed_to_eur_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate}), isArabic)
  const apartment_sale_value = convertPrice(convertMyCurrency({value: marketOverviewData?.data?.attributes?.apartment_sale_value, currency, aed_to_eur_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate}), isArabic)

  const total_villa_sale_value = convertPrice(convertMyCurrency({value: marketOverviewData?.data?.attributes?.total_villa_sale_value, currency, aed_to_eur_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate}), isArabic)
  const villa_sale_price = convertPrice(convertMyCurrency({value: marketOverviewData?.data?.attributes?.villa_sale_price, currency, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, aed_to_usd_exchange_rate}), isArabic)

  const total_commercial_sale_value = convertPrice(convertMyCurrency({value: marketOverviewData?.data?.attributes?.total_commercial_sale_value, currency, aed_to_eur_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate}), isArabic)
  const commercial_sale_price = convertPrice(convertMyCurrency({value: marketOverviewData?.data?.attributes?.commercial_sale_price, currency, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, aed_to_usd_exchange_rate}), isArabic)

  return (
    <div className="marketOverviewSection">
      <div className="wrapper">
        <span className="heading gradientText">{t('dubai_real_estate_market_overview')}</span>
        <span className="date">{convertToDate(marketOverviewData?.data?.attributes?.date, locale)}</span>
        <h2 className="totalCount">
          {isArabic ? formatNumberToArabic(marketOverviewData?.data?.attributes?.total_property_sale, true) : numberFormat(marketOverviewData?.data?.attributes?.total_property_sale)}
        </h2>
        <span className="subheading">{t('total_property_sale_transactions')}</span>

        <div className="salesOverviewSection">
          <div className="overviewCardItem">
            <OverviewCard
              count={isArabic ? formatNumberToArabic(marketOverviewData?.data?.attributes?.total_apartment, true) : numberFormat(marketOverviewData?.data?.attributes?.total_apartment)}
              type={t('apartments')}
              salesValue={apartment_sale_value}
              price={aparment_sale_price}
            />
          </div>
          <div className="overviewCardItem">
            <OverviewCard 
            count={isArabic ? formatNumberToArabic(marketOverviewData?.data?.attributes?.total_villa, true) : numberFormat(marketOverviewData?.data?.attributes?.total_villa)}
             type={t('villas_and_townhouses')}
             salesValue={total_villa_sale_value}
             price={villa_sale_price}
            />
          </div>
          <div className="overviewCardItem">
            <OverviewCard 
            count={isArabic ? formatNumberToArabic(marketOverviewData?.data?.attributes?.total_commercial, true) : numberFormat(marketOverviewData?.data?.attributes?.total_commercial)}
             type={t("commercial")}
             salesValue={total_commercial_sale_value}
             price={commercial_sale_price}
            />
          </div>
        </div>
        <div className="line">
          <Image src="/gradientLine.png" fill={true} alt="Gradient-line" />
        </div>

        <SubscribeNewsletter type='newsletter-form'/>
      </div>
    </div>
  );
};

export default MarketOverviewSection;
