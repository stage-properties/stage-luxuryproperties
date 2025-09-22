"use client";

import React, { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";

import LanguageSwitcherMobile from "@/app/[locale]/_components/LanguageSwitcher/LanguageSwitcherMobile/LanguageSwitcherMobile";
import MenuIcon from "../../../../../assets/Icons/menuIcon.svg";
import CloseIcon from "../../../../../assets/Icons/closeIcon.svg";
import ListLink from "./ListLink";
import { navLinks, navLinks_ar } from "@/app/[locale]/_utils/contants";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const locale = useLocale();
  const isRTL = locale === "ar";
  const pathname = usePathname();
  const links = isRTL ? navLinks_ar : navLinks;

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled((window.scrollY || document.documentElement.scrollTop) > 8);
        ticking = false;
      });
    };
    onScroll(); // set initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        id="mHeader"
        dir={isRTL ? "rtl" : "ltr"}
        aria-label="Site header"
        className={scrolled ? "scrolled" : ""}
      >
        <div className="mH-left">{/* <LanguageSwitcherMobile /> */}</div>

        <Link href="/" className="mH-brand" aria-label="Stage Lux – Home">
          <img
            src="/stage-lux-logo-white.svg"
            alt="Stage Lux"
            className="mH-logo"
          />
        </Link>

        <button
          className="mH-burger"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <MenuIcon />
        </button>
      </header>

      {/* Drawer */}
      <div
        className={`mDrawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="mDrawer-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
        <nav className="mDrawer-nav">
          <ul>
            {links?.map((item) => (
              <ListLink
                key={item?.id}
                fullValue={item}
                label={item?.label}
                responsive
                path={item?.path}
                subLink={item?.subLinks}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* Backdrop */}
      <button
        className={`mBackdrop ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />
    </>
  );
}
