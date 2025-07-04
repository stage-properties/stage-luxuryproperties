"use client";
import React from "react";
import { Link } from '@/i18n/routing';
import { usePathname } from "@/i18n/routing";
import SubListLinks from "./SubListLinks";
import { subLinkPathnameActiveFinder } from "@/app/[locale]/_utils/utils";
import { useLocale } from 'next-intl';

import DropDownArrow from "../../../../../assets/Icons/dropdownArrow.svg"

const ListLink = ({
  subLink,
  label,
  path,
  setResponsiveMenuIsActive,
  responsive,
  fullValue,
  activeSubmenu,    // shared state: currently open submenu identifier
  setActiveSubmenu, // shared state setter
}) => {
  const pathname = usePathname();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Create a unique identifier (using fullValue.id if available or fallback to label)
  const menuId = (fullValue && fullValue.id) || label;
  
  // Determine if this menu is open using the shared state
  const isOpen = activeSubmenu === menuId;

  // Handler for responsive (mobile) mode
  const responsiveMenuClickHandler = (e) => {
    if (responsive) {
      e.stopPropagation();
      if (subLink?.length) {
        // If clicking on a subLink item, close the responsive menu
        if (e.target.classList.contains("subLinkItem")) {
          setResponsiveMenuIsActive(false);
        }
        // Toggle the open state: open if closed, close if open.
        setActiveSubmenu(isOpen ? null : menuId);
      } else {
        setResponsiveMenuIsActive(false);
      }
    }
  };

  return (
    <li
      className={
        pathname === path
          ? `active link`
          : subLinkPathnameActiveFinder(subLink, pathname) === true
          ? `active link`
          : `link`
      }
      style={{ cursor: "pointer" }}
      // For mobile: use click handler; for desktop: use hover events.
      onClick={(e) => (responsive ? responsiveMenuClickHandler(e) : null)}
      onMouseEnter={!responsive && subLink?.length ? () => setActiveSubmenu(menuId) : undefined}
      onMouseLeave={!responsive && subLink?.length ? () => setActiveSubmenu(null) : undefined}
    >
      {responsive && subLink?.length ? (
        <div className="linkContainer">
          <span className="label">{label}</span>
          <span className="icon">
            <DropDownArrow />
          </span>
        </div>
      ) : (
        <>
          {!path && <span className="mainLink">{label}</span>}
          {path && (
            <Link className="mainLink" href={path} prefetch={true}>
              {label}
            </Link>
          )}
          {subLink?.length && (
            <span className={`icon ${isRTL ? 'ar' : ''}`}>
              <DropDownArrow />
            </span>
          )}
        </>
      )}
      <ul
        className="subLinks gradientBorder"
        style={
          isOpen
            ? { display: "block", cursor: "pointer" }
            : { display: "none", cursor: "pointer" }
        }
      >
        {subLink?.map((item) => (
          <SubListLinks
            key={item?.id}
            subLinkPath={item?.path}
            subLinkLabel={item?.label}
          />
        ))}
      </ul>
    </li>
  );
};

export default ListLink;