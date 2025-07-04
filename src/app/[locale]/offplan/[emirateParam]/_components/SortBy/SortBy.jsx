'use client'

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWindowSize } from "@uidotdev/usehooks";
import { useTranslations, useLocale } from 'next-intl';
import dynamic from "next/dynamic";
import { offplan_urlRename } from "@/app/[locale]/_utils/utils";
const SortIcon = dynamic(() => import('../../../../../../../assets/Icons/sort.svg'))

const SortBy = ({searchParams}) => {

    const [sortOrder, setSortOrder] = useState(searchParams.sort ?? "launch_date_latest");
    const [selectedDropDown, setDropDown] = useState("");
    const [isPageRouting, setIsPageRouting] = useState(false);
    const [inputValues, setInputValues] = useState({});

    // Create a ref for the container
    const containerRef = useRef(null);
    
    const windowSize = useWindowSize();
    const router = useRouter();
    const pathname = usePathname();

    const t = useTranslations('offplan')
    const locale = useLocale()
    const isRTL = locale === 'ar'

    const dropDownHandler = (e, type) => {
        e.stopPropagation();
        setDropDown((prevState) => (prevState === type ? "" : type));
    };

    const handleChange = (name, value, e) => {
        e.stopPropagation();
        setDropDown("");

        // Handle sorting state
        if (name === "sortOrder") {
            setSortOrder(value);
            setIsPageRouting(true);
        }
        const replacedString = value.replace(/&/g, "and");
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: replacedString,
        }));
    };

    const pageRouting = () => {
        // Merge the existing searchParams with the updated values
        const updatedFilters = { ...searchParams, ...inputValues, sort: sortOrder };
        const redirectURL = offplan_urlRename(pathname, updatedFilters, "OFFPLAN", true);
        router.push(redirectURL, { scroll: false });
        setIsPageRouting(false);
      };

    useEffect(() => {
    if (isPageRouting) {
        pageRouting();
    }
    }, [isPageRouting]);

    // Event listener to detect clicks outside the component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setDropDown("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // if(windowSize.width > 1400) return null

    return (
        <div className={`offplanSortBy secondarySearchFields ${isRTL ? 'ar' : ''}`} ref={containerRef}>
            <div className="allFields">
                <div
                    className={`sortOrder _commonContainer ${isRTL ? 'ar' : ''}`}
                    onClick={(e) => dropDownHandler(e, "SORTORDER")}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    style={{marginRight: 'unset !important'}}
                >
                    <div className="inputField">
                        <div className={`selectedValue ${isRTL ? 'ar' : ''} desktopSort`}>
                            <span>
                                {sortOrder === "launch_date_earliest"
                                ? t('launch_date_earliest')
                                : sortOrder === "launch_date_latest"
                                ? t('launch_date_latest')
                                : sortOrder === "price_low_to_high"
                                ? t('price_low_to_high')
                                : sortOrder === "price_high_to_low"
                                ? t('price_high_to_low')
                                : sortOrder === 'handover_info_high_low'
                                ? t('handover_info_high_low')
                                : sortOrder === 'handover_info_low_high'
                                ? t('handover_info_low_high')
                                : "Sort by"}
                            </span>
                        </div>
                        {selectedDropDown === "SORTORDER" && (
                            <ul className="dropDown gradientBorder desktopSort">
                                <li className={isRTL ? 'ar' : ''} onClick={(e) => handleChange("sortOrder", "launch_date_earliest", e)}>
                                    <span>{t('launch_date_earliest')}</span>
                                </li>
                                <li className={isRTL ? 'ar' : ''} onClick={(e) => handleChange("sortOrder", "launch_date_latest", e)}>
                                    <span>{t('launch_date_latest')}</span>
                                </li>
                                <li className={isRTL ? 'ar' : ''} onClick={(e) => handleChange("sortOrder", "price_low_to_high", e)}>
                                    <span>{t('price_low_to_high')}</span>
                                </li>
                                <li className={isRTL ? 'ar' : ''} onClick={(e) => handleChange("sortOrder", "price_high_to_low", e)}>
                                    <span>{t('price_high_to_low')}</span>
                                </li>
                                <li className={isRTL ? 'ar' : ''} onClick={(e) => handleChange("sortOrder", "handover_info_high_low", e)}>
                                    <span>{t('handover_info_high_low')}</span>
                                </li>
                                <li className={isRTL ? 'ar' : ''} onClick={(e) => handleChange("sortOrder", "handover_info_low_high", e)}>
                                    <span>{t('handover_info_low_high')}</span>
                                </li>
                            </ul>
                        )}
                        <div className="icon">
                            <SortIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SortBy