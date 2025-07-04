'use client';

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLangSwitcherVisibility } from "@/app/[locale]/redux/langCurrSwitcherVisibility/langCurrSwitcherVisibilitySlice";
import { useTranslations, useLocale } from "next-intl";
import PropertyInfoServer from "./PropertyInfoServer";

const PropertyInfoClient = ({ offplanData }) => {
  const dispatch = useDispatch();
  const hasArabic = offplanData?.hasArabic;

  // Update language switcher state from Redux
  useEffect(() => {
    dispatch(setLangSwitcherVisibility(hasArabic));
  }, [dispatch, hasArabic]);

  const t = useTranslations('offplan_single');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  const areaUnit = useSelector((state) => state.areaUnit.value);

  return (
    <PropertyInfoServer 
      offplanData={offplanData}
      areaUnit={areaUnit}
      t={t}
      isRTL={isRTL}
      direction={direction}
    />
  );
};

export default PropertyInfoClient;