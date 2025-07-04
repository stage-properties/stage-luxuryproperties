"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrency } from "@/app/[locale]/redux/currencySlice/currencySlice";
import { setAreaUnit } from "@/app/[locale]/redux/areaUnitSlice/areaUnitSlice";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

const LangCurrSwitcher = ({ isOpen, setIsOpen, currencies, areaUnits }) => {

  const langSwitcherVisility = useSelector((state) => state.langSwitcherVisibility.value);

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const languages = [
    { label: "English", value: "en", flag: { name: 'gb', url: '/flags/gb.svg', alternativeText: "Great Britain Flag" } },
    { label: "العربية", value: "ar", flag: { name: 'uae', url: '/flags/uae.svg', alternativeText: "United Arab Emirates Flag" }},
  ];

  const switchLanguage = (locale) => {
    if (locale === currentLocale) return;

    router.replace(pathname, { locale: locale });
  };
  
  const t = useTranslations("lang_switcher");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const dispatch = useDispatch();

  // Access current selections from Redux store
  const areaUnit = useSelector((state) => state.areaUnit.value);

  // Refs for detecting clicks outside the dropdown and handling shake
  const dropdownRef = useRef(null);

  // Ref to keep track of whether the dropdown has been opened once
  const hasBeenOpenedRef = useRef(false);

  // Update hasBeenOpenedRef when the dropdown is opened
  useEffect(() => {
    if (isOpen && !hasBeenOpenedRef.current) {
      hasBeenOpenedRef.current = true;
    }
  }, [isOpen]);

  // Handler for Currency Change
  const handleCurrencyChange = (newCurrency) => {
    dispatch(setCurrency(newCurrency));
  };

  // Handler for Area Unit Change (if applicable)
  const handleAreaUnitChange = (newAreaUnit) => {
    dispatch(setAreaUnit(newAreaUnit));
  };
  
  // Preload flag images
  useEffect(() => {
    if (currencies && currencies.length > 0) {
      currencies.forEach((currencyItem) => {
        const img = new window.Image();
        img.src = `/${currencyItem.value}.svg`;
      });
    }
  }, [currencies]);

  const allowedStaticTrans = pathname === '/blogs'
    || pathname === '/'
    || pathname.includes('/buy/')
    || pathname.includes('/rent/')
    || pathname === '/offplan'
    || pathname === '/developers'
    || pathname === '/areas-and-communities'
    || pathname === '/mortgage-calculator'
    || pathname === '/our-team'
    || pathname === '/contact-us'

  return (
    <div
      className={`langCurrSwitcher ${isRTL ? "ar" : ""}`}
      dir={direction}
    >
      <div className="container" ref={dropdownRef}>
        <div className={`dropDown ${isOpen ? "show" : "hide"}`}>
          <div className="areaUnitSwitcher">
            {areaUnits && areaUnits.length > 0 &&
              areaUnits.map((unit) => (
                <button
                  key={unit.value}
                  onClick={() => handleAreaUnitChange(unit.value)}
                  className={`areaUnitButton ${areaUnit === unit.value ? "active" : ""} ${isRTL ? "ar" : ""}`}
                >
                  {t(unit.label)}
                </button>
              ))
            }
          </div>
          <div className="listDropdownitemsParent">
          <ul className={`listDropdownitems ${isRTL ? 'ar' : ''}`}>
              {languages.map((lang) => {
                return (
                <li 
                  key={lang.value} 
                  className="dropdown-item"
                  onClick={() => (!langSwitcherVisility && !allowedStaticTrans) && lang.value === 'ar'? null : switchLanguage(lang.value)}
                  aria-current={lang.value === currentLocale ? "true" : "false"}
                  >
                    <span className="text" style={ (!langSwitcherVisility && !allowedStaticTrans) && lang.value === 'ar' ? {cursor: 'not-allowed', color: 'gray'} : {} }>
                      <Image
                        src={lang.flag.url} 
                        fetchpriority="high" 
                        decoding="async" 
                        data-nimg="1" 
                        style={{color: 'transparent'}}  
                        alt={lang.flag.alternativeText} 
                        width={20} 
                        height={15} 
                      />{" "}
                      <span className={lang.value === 'ar' ? 'ar' : ''}>{lang.label}</span>
                    </span>
                </li>
              )})}
            </ul>
            <div className="separator">&nbsp;</div>
            <ul className={`listDropdownitems ${isRTL ? "ar" : ""}`}>
              {/* Currency Options */}
              {currencies && currencies.length > 0 && (
                <>
                  {currencies.map((currencyItem) => (
                    <li
                      key={currencyItem.value}
                      onClick={() =>
                        handleCurrencyChange(currencyItem.value)
                      }
                      className="dropdown-item"
                    >
                      <span className="text">
                        <Image
                          src={`/${currencyItem.value}.svg`}
                          alt={`${currencyItem.label} flag`}
                          width={20}
                          height={15}
                          priority
                        />{" "}
                        {t(currencyItem.label)}
                      </span>
                    </li>
                  ))}
                </>
              )}
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LangCurrSwitcher;