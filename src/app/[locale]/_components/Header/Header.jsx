"use client";
import React, { useEffect, useRef, useState } from "react";
import { Link } from '@/i18n/routing';
import ListLink from "./ListLink";
import useScrollPosition from "../useScrollPosition/useScrollPosition";
import { navLinks, navLinks_ar } from "@/app/[locale]/_utils/contants";
import Script from "next/script";
import { usePathname } from "@/i18n/routing";
import {useTranslations, useLocale} from 'next-intl';
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import LanguageSwitcherMobile from "@/app/[locale]/_components/LanguageSwitcher/LanguageSwitcherMobile/LanguageSwitcherMobile"
import MenuIcon from '../../../../../assets/Icons/menuIcon.svg'
import CloseIcon from "../../../../../assets/Icons/closeIcon.svg"

const Header = () => {

  const [menuContainer, setMenuContainer] = useState(false);
  const position = useScrollPosition();
  const menuRef = useRef(null);
  const [responsiveMenuIsActive, setResponsiveMenuIsActive] = useState(false);
  const t = useTranslations('common');

  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const _navLinks = locale === 'ar' ? navLinks_ar : navLinks

  const pathname = usePathname();

  // Define paths where LangCurrSwitcher should NOT be shown
  const pathsToExclude = [
    "/blogs",
    "/our-team",
    "/developers",
    "/areas-and-communities",
    "/contact-us",
    "/landing"
  ];

  // Normalize the pathname (remove trailing slashes)
  const normalizedPathname = pathname.replace(/\/$/, "");

  // Remove trailing slashes from pathsToExclude
  const normalizedPathsToExclude = pathsToExclude.map((path) =>
    path.replace(/\/$/, "")
  );

  // Check if current pathname exactly matches any of the paths to exclude
  const shouldExcludeSwitcher =
    normalizedPathsToExclude.includes(normalizedPathname) ||
    normalizedPathname.startsWith("/blog/") || normalizedPathname.startsWith("/landing/");

  useEffect(() => {
    const handleOutClick = (e) => {
      if (!menuRef?.current?.contains(e.target)) {
        setMenuContainer(false);
      }
    };
    window.addEventListener("click", handleOutClick);
    return () => {
      window.removeEventListener("click", handleOutClick);
    };
  }, [menuRef]);

  const responsiveMenuHandler = (flag) => {
    setResponsiveMenuIsActive(flag);
  };

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  // Updated currencies as objects with label and value
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

  const [activeSubmenu, setActiveSubmenu] = useState(null);

  return (
    <>
      <div
        id="header"
        className={position > 200 ? "background" : "headerComponent"}
        dir={direction}
      >
        <div className={`left ${isRTL ? 'ar' : ''}`}>
          <Link href="/">
            <img
              src="/Stage_Logo_White.png"
              priority={true}
              alt="Stage_logo"
              fill={true}
              className={`${isRTL ? 'ar' : ''} stage-logo`}
            />
          </Link>
          <ul className="links">
            <ListLink
              label={t('home').toUpperCase()}
              path="/"
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
            />
          </ul>
        </div>
        <div className={`right ${isRTL ? 'ar' : ''}`}>
          <ul className="links">
            {_navLinks?.map((item) => (
              <ListLink
                key={item?.id}
                fullValue={item}
                label={item?.label}
                path={item?.path}
                subLink={item?.subLinks}
                activeSubmenu={activeSubmenu}        // Pass the shared state
                setActiveSubmenu={setActiveSubmenu}  // Pass the shared state setter
              />
            ))}
          </ul>
            <div className="menuIcon">
              <LanguageSwitcherMobile />
            </div>
          <div className="menuIcon" onClick={() => responsiveMenuHandler(true)}>
            <MenuIcon />
          </div>
            <div className="isDesktop">
              <LanguageSwitcher />
            </div>
          {/* {!shouldExcludeSwitcher && ( */}
            {/* <LangCurrSwitcher
              isOpen={isSwitcherOpen}
              setIsOpen={setIsSwitcherOpen}
              currencies={currencies}
              areaUnits={areaUnits}
            /> */}
          {/* )} */}

        </div>
        <div className={`menuResponsiveContainer ${responsiveMenuIsActive ? 'active': ''}`}>
          <div className="closeIcon" onClick={() => responsiveMenuHandler(false)}>
            <CloseIcon />
          </div>
          <ul
            className="responsiveLinks"
            onClick={() => responsiveMenuHandler(false)}
          >
            {_navLinks?.map((item) => (
              <ListLink
                key={item?.id}
                fullValue={item}
                label={item?.label}
                responsive={true}
                path={item?.path}
                subLink={item?.subLinks}
                setResponsiveMenuIsActive={setResponsiveMenuIsActive}
                activeSubmenu={activeSubmenu}
                setActiveSubmenu={setActiveSubmenu}
              />
            ))}
          </ul>
        </div>
        {!pathname.includes("/landing") ? (
          <Script id="convolo" strategy="afterInteractive">
            {` (function f() { var widget_key = 'ed541f9379471ea80b43ef20889e2750'; window.leadCM = { widget_key: widget_key, }; var em = document.createElement('script'); em.type = 'text/javascript'; em.async = true; em.src = 'https://app.convolo.ai/js/icallback.js?v=' + Math.random() + '&key=' + widget_key + '&uri=' + encodeURIComponent(window.location.href); var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(em, s); })();`}
          </Script>
        ) : null}
      </div>

      {/* Conditionally render LangCurrSwitcher */}
      {/* {!shouldExcludeSwitcher && (
        <LangCurrSwitcher
          isOpen={isSwitcherOpen}
          setIsOpen={setIsSwitcherOpen}
          currencies={currencies}
          areaUnits={areaUnits}
        />
      )} */}
    </>
  );
};

export default Header;