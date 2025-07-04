"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocale, useTranslations } from 'next-intl';
import dynamic from "next/dynamic";
import Image from "next/image";
import LangCurrSwitcher from "../LangCurrSwitcher/LangCurrSwitcher";

const DropDownArrow = dynamic(() =>
  import("../../../../../assets/Icons/dropdownArrow.svg")
);

const LanguageSwitcher = () => {
  const t = useTranslations("lang_switcher");
  const currentLocale = useLocale();
  const isRTL = currentLocale === 'ar'

  const [isOpen, setIsOpen] = useState(false);

  const currency = useSelector((state) => state.currency.value);

  const currencies = [
    { label: "EUR (€)", value: "EUR" },
    { label: "USD ($)", value: "USD" },
    { label: "GBP (£)", value: "GBP" },
    { label: "AED", value: "AED" },
    { label: "INR (₹)", value: "INR" },
    { label: "RUB (₽)", value: "RUB" },
  ];

  // Updated areaUnits as objects with label and value
  const areaUnits = [
    { label: "SQ FT", value: "ft²" },
    { label: "SQ M", value: "m²" },
  ];

  const languages = [
    { label: "English", value: "en", flag: { name: 'gb', url: '/flags/gb.svg', alternativeText: "Great Britain Flag" } },
    { label: "العربية", value: "ar", flag: { name: 'uae', url: '/flags/uae.svg', alternativeText: "United Arab Emirates Flag" }},
  ];

  const currentLanguage = languages.find(lang => lang.value === currentLocale);

  const openDropdown = () => {
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="language-switcher"
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
      onFocus={openDropdown}
      onClick={closeDropdown}
    >
      <button
        className="switcher-button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Image src={currentLanguage.flag.url} fetchpriority="high" decoding="async" data-nimg="1" style={{color: 'transparent', marginBottom: '4px'}}  alt={currentLanguage.flag.alternativeText} width={20} height={15} className={`flag ${isRTL ? 'ar' : ''}`} />
        <span className="text">{t(currentLanguage.value)} / {t(currency.toLowerCase())}</span>
        <span className={`icon ${isRTL ? 'ar' : ''}`}>
          <DropDownArrow />
        </span>
      </button>
      <LangCurrSwitcher 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currencies={currencies}
        areaUnits={areaUnits}
      />
    </div>
  );
};

export default LanguageSwitcher;