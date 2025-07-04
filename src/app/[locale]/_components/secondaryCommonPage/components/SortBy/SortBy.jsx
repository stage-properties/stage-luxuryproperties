'use client'

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWindowSize } from "@uidotdev/usehooks";
import { useTranslations, useLocale } from 'next-intl';
import { secondary_urlRename, secondary_secondaryQueryGeneratorAndWordChecker } from "@/app/[locale]/_utils/utils";
import SortIcon from '../../../../../../../assets/Icons/sort.svg'

const SortBy = ({searchParams, params}) => {

    const [sortOrder, setSortOrder] = useState(searchParams.sort ?? "new_to_old");
    const [selectedDropDown, setDropDown] = useState("");
    const [isPageRouting, setIsPageRouting] = useState(false);
    const [inputValues, setInputValues] = useState({});

    // Create a ref for the container
    const containerRef = useRef(null);
    
    const windowSize = useWindowSize();
    const router = useRouter();
    const pathname = usePathname();

    const t_secondary = useTranslations('secondary')
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
    const redirectURL = secondary_urlRename(
        pathname,
        { ...inputValues, sortOrder },
        "SECONDARY",
        true
    );
    router.push(redirectURL);
    setIsPageRouting(false);
    };

    useEffect(() => {
        const initialValues = secondary_secondaryQueryGeneratorAndWordChecker(
            params,
            searchParams
        );
        setInputValues((prevValues) => ({
            ...prevValues,
            ...initialValues.valuesForInput,
        }));
    }, [params, searchParams]);

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

    if(windowSize.width > 1400) return null

    return (
        <div className="secondarySearchFields" ref={containerRef}>
            <div className="_allFields">
                <div
                    className={`sortOrder _commonContainer ${isRTL ? 'ar' : ''}`}
                    onClick={(e) => dropDownHandler(e, "SORTORDER")}
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    <div className="inputField">
                        <div className="selectedValue desktopSort">
                            <span>
                                {sortOrder === "new_to_old"
                                ? t_secondary('order_new_to_old')
                                : sortOrder === "price_low_high"
                                ? t_secondary('price_low_to_high')
                                : sortOrder === "price_high_low"
                                ? t_secondary('price_high_to_low')
                                : "Sort by"}
                            </span>
                        </div>
                        {selectedDropDown === "SORTORDER" && (
                            <ul className="dropDown gradientBorder desktopSort">
                                <li className={isRTL ? 'ar' : ''} onClick={(e) => handleChange("sortOrder", "new_to_old", e)}>
                                <span>{t_secondary('order_new_to_old')}</span>
                                </li>
                                <li className={isRTL ? 'ar' : ''} onClick={(e) => handleChange("sortOrder", "price_low_high", e)}>
                                <span>{t_secondary('price_low_to_high')}</span>
                                </li>
                                <li className={isRTL ? 'ar' : ''} onClick={(e) => handleChange("sortOrder", "price_high_low", e)}>
                                <span>{t_secondary('price_high_to_low')}</span>
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