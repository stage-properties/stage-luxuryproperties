"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useWindowSize } from "@uidotdev/usehooks";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { bedrooms, bedroomsAR, price, propertyTypes, propertyTypesAR, areaOptions } from "@/app/[locale]/_utils/contants";
import {
  capitalizeWords,
  checkIsResidential,
  findOfferingType,
  secondary_secondaryQueryGeneratorAndWordChecker,
  secondary_urlRename,
  capitalizeFirstLetters,
  formatNumberToArabic,
  convertMyCurrency,
  numberFormat,
  fetchAPI
} from "@/app/[locale]/_utils/utils";
import { fetchSecondaryPropertySearchSuggestion } from "@/app/[locale]/(dubai)/[offeringType]/service";
import { getActiveFilters } from "../getActiveFilters";

import DropDownArrow from "../../../../../../../assets/Icons/dropdownArrow.svg"
import FilterIcon from "../../../../../../../assets/Icons/filter.svg"
import CloseIcon from "../../../../../../../assets/Icons/closeIcon.svg"
import SortIcon from '../../../../../../../assets/Icons/sort.svg'

const SecondarySearch = ({ params, searchParams, minMaxPrices, minMaxAreas, configuration, secondaryProperties }) => {

  const t = useTranslations('common');
  const t_secondary = useTranslations('secondary');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  const _propertyTypes = isRTL ? propertyTypesAR : propertyTypes;
  const _bedrooms = isRTL ? bedroomsAR : bedrooms;

  const currency = useSelector((state) => state.currency.value);
  const areaUnit = useSelector((state) => state.areaUnit.value);

  const {
    aed_to_eur_exchange_rate,
    aed_to_usd_exchange_rate,
    aed_to_gbp_exchange_rate,
    aed_to_inr_exchange_rate,
    aed_to_rub_exchange_rate
  } = configuration?.data?.attributes || {};

  // ---------------------
  //  STATE
  // ---------------------
  const [selectedDropDown, setDropDown] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [hiddenPills, setHiddenPills] = useState(new Set());
  const [isFilterModal, setIsFilterModal] = useState(false);
  const [searchDropDown, setSearchDropDown] = useState(false);
  const [querySuggestions, setQuerySuggestions] = useState([]);
  const [isResidential, setIsResidential] = useState(false);
  const [sortOrder, setSortOrder] = useState(searchParams.sort ?? "new_to_old");

  // ---- Price states ----
  const [selectedMinPrice, setSelectedMinPrice] = useState(
    searchParams.minPrice ?? Number.MIN_SAFE_INTEGER
  );
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(
    searchParams.maxPrice ?? Number.MAX_SAFE_INTEGER
  );

  // ---- Area states ----
  const [selectedMinArea, setSelectedMinArea] = useState(
    searchParams.minArea ?? Number.MIN_SAFE_INTEGER
  );
  const [selectedMaxArea, setSelectedMaxArea] = useState(
    searchParams.maxArea ?? Number.MAX_SAFE_INTEGER
  );

  const windowSize = useWindowSize();
  const dropDownRef = useRef(null);
  const searchDropDownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const isEmpty = (obj) => {
    const keys = Object.keys(obj);
    return keys.length === 0 || (keys.length === 1 && keys[0] === 'sort');
  };

  // ---------------------
  //  USE EFFECTS
  // ---------------------
  useEffect(() => {
    setIsResidential(checkIsResidential(params));
    const initialValues = secondary_secondaryQueryGeneratorAndWordChecker(
      params,
      searchParams
    );

    // console.log('params', params)
    // console.log('searchParams', searchParams)

    const fetchCommunityInArabic = async () => {
      const communitySlug = params['param-3']?.replace(/^in-/, '');
      const communityInArabic = await fetchAPI(`/search/communityInArabic?slug=${communitySlug}`, 'cache')
      setInputValues((prevValues) => {
        const obj = {
          ...prevValues,
          ...initialValues.valuesForInput,
          text: initialValues.valuesForInput.keywords,
          keywords: communityInArabic.communityNameArabic
        };
        console.log('obj', obj)
        return obj
      });
    }

    if(params['param-3'] && locale === 'ar'){
      fetchCommunityInArabic()
    } else {
      setInputValues((prevValues) => {
        const obj = {
          ...prevValues,
          ...initialValues.valuesForInput,
          text: initialValues.valuesForInput.keywords,
        };
        console.log('obj', obj)
        return obj
      });
    }
  }, [params, searchParams]);

  useEffect(() => {
    const handleOutClick = (e) => {
      if (!dropDownRef.current?.contains(e.target)) {
        setDropDown("");
      }
      if (!searchDropDownRef.current?.contains(e.target)) {
        setSearchDropDown(false);
      }
    };
    window.addEventListener("click", handleOutClick);
    return () => window.removeEventListener("click", handleOutClick);
  }, []);

  useEffect(() => {
    if (inputValues.keywords && searchDropDown) {
      secondarySearchSuggestion();
    } else {
      setQuerySuggestions([]);
    }
  }, [inputValues.keywords, searchDropDown]);

  // ---------------------
  //  FUNCTIONS
  // ---------------------
  const dropDownHandler = (e, type) => {
    e.stopPropagation();
    setSearchDropDown(false);
    setDropDown((prevState) => (prevState === type ? "" : type));
  };

  const handleChange = (name, value, e) => {
    e.stopPropagation();
    setDropDown("");

    // Immediately un-hide this pill if user re-selects
    setHiddenPills((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });

    // Handle sorting state
    if (name === "sortOrder") {
      setSortOrder(value);
      // Immediately update the URL when sorting is changed
      const updatedQueryParams = { ...inputValues, sortOrder: value };
      const redirectURL = secondary_urlRename(pathname, updatedQueryParams, "SECONDARY", true);
      router.push(redirectURL);
      return; // No need to update state further for sorting
    }

    if (name === "keywords") {
      setSearchDropDown(true);
    }
    if (name === "text") {
      setSearchDropDown(false);
    }

    // ---- Price updates
    if (name === "minPrice") {
      setSelectedMinPrice(value);
    }
    if (name === "maxPrice") {
      setSelectedMaxPrice(value);
    }

    // ---- NEW: Area updates
    if (name === "minArea") {
      setSelectedMinArea(value);
    }
    if (name === "maxArea") {
      setSelectedMaxArea(value);
    }

    const replacedString = value.toString().replace(/&/g, "and");
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: replacedString,
    }));
  };

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, e);
  };

  const modalHandler = () => {
    setIsFilterModal(!isFilterModal);
  };

  const secondarySearchSuggestion = async () => {
    const offeringType = findOfferingType(pathname);
    const query = `searchType=scndry&text=${inputValues.keywords}&oft=${offeringType}&ctg=${
      isResidential ? "residential" : "commercial"
    }&cs=${inputValues.status || ""}&locale=${locale}`;
    try {
      const response = await fetchSecondaryPropertySearchSuggestion(query);
      setQuerySuggestions(response?.data || []);
      setSearchDropDown(response?.data?.length > 0);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setQuerySuggestions([]);
      setSearchDropDown(false);
    }
  };

  const pageRouting = () => {
    const _sortOrder = searchParams?.sort || sortOrder
    // Push to next route with updated query (and area)
    const redirectURL = secondary_urlRename(
      pathname,
      { ...inputValues, sortOrder: _sortOrder },
      "SECONDARY",
      true
    );
    router.push(redirectURL);
    setIsFilterModal(false);
  };

  // Reuse your existing function for price filters
  const findPriceAndRest = (prices, givenNumber) => {
    return prices.filter(
      (item) => parseFloat(item.value) >= parseFloat(givenNumber)
    );
  };

  const findAreaAndRest = (arr, minNumber, maxNumber) => {
    // Ensure the array is sorted in ascending order by the numeric value
    const sortedArr = arr.slice().sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
    
    // Find the starting index: the last index where the value is ≤ minNumber.
    let startIndex = -1;
    for (let i = 0; i < sortedArr.length; i++) {
      if (parseFloat(sortedArr[i].value) <= parseFloat(minNumber)) {
        startIndex = i;
      } else {
        break; // no need to continue since array is sorted
      }
    }
    // If no element is ≤ minNumber, start at the beginning of the array.
    if (startIndex === -1) {
      startIndex = 0;
    }
    
    // Find the ending index: the first index where the value is > maxNumber.
    let endIndex = sortedArr.length;
    for (let i = 0; i < sortedArr.length; i++) {
      if (parseFloat(sortedArr[i].value) > parseFloat(maxNumber)) {
        endIndex = i;
        break;
      }
    }
    
    // Return the slice from startIndex up to (but not including) endIndex.
    return sortedArr.slice(startIndex, endIndex + 1);
  };

  const convertFTM = (number) => {
    if(areaUnit === 'ft²') return numberFormat(number)
    return Math.floor(number / 10.7639)
  }

  const resetFilters = () => {
    // Preserve the current offering type (for commercial searches)
    const preservedOffer = inputValues.offer;
    // Preserve the sorting order
    const preservedSortOrder = searchParams?.sort || sortOrder;

    // console.log('sortOrder', sortOrder)
    // console.log('searchParams?.sort', searchParams?.sort)

    // console.log('preservedSortOrder', preservedSortOrder)
  
    // Reset all filters except the offering type (for commercial) and sorting order
    setInputValues((prevValues) => ({
      ...(preservedOffer ? { offer: preservedOffer } : {}),
      sortOrder: preservedSortOrder, // Keep the sorting order unchanged
    }));
  
    setSelectedMinPrice(Number.MIN_SAFE_INTEGER);
    setSelectedMaxPrice(Number.MAX_SAFE_INTEGER);
    setSelectedMinArea(Number.MIN_SAFE_INTEGER);
    setSelectedMaxArea(Number.MAX_SAFE_INTEGER);
    setDropDown("");
  
    // Build query parameters for the redirect.
    // Preserve offering type for commercial and sorting order for all.
    const queryParams = { property_type: "any", sortOrder: preservedSortOrder };
    if (preservedOffer) {
      queryParams.offer = preservedOffer;
    }

    const redirectURL = secondary_urlRename(pathname, queryParams, "SECONDARY", true);
    router.push(redirectURL);
    setIsFilterModal(false);
  };

  const totalNbProperties = secondaryProperties?.data?.length
  const totalNbPropertiesArchived = secondaryProperties?.data?.reduce((acc, curr) => {
    if(curr?.attributes?.is_archived) return acc += 1
    return acc
  }, 0)

  const activeFilters = getActiveFilters({
    pathname,
    searchParams,
    t: t_secondary,
    currency,
    areaUnit,
    rates: configuration.data.attributes,
    isRTL,
    convertMyCurrency,
    numberFormat,
    formatNumberToArabic,
    convertFTM
  }).filter(f => !hiddenPills.has(f.key));;
  
  const removeFilter = (key) => {
    setHiddenPills((prev) => new Set(prev).add(key));
    // then clear from state & URL
    const updated = { ...inputValues };
    if(key==='propertyType') updated.property_type='any';
    else if(key==='search'){ delete updated.text; delete updated.keywords; }
    else delete updated[key];
    setInputValues(updated);

    // 5) Reset any “selectedX” state tied to that key
    if (key === "minPrice") setSelectedMinPrice(Number.MIN_SAFE_INTEGER);
    if (key === "maxPrice") setSelectedMaxPrice(Number.MAX_SAFE_INTEGER);
    if (key === "minArea" ) setSelectedMinArea(Number.MIN_SAFE_INTEGER);
    if (key === "maxArea" ) setSelectedMaxArea(Number.MAX_SAFE_INTEGER);

    // Also clear any open dropdown
    setDropDown("");

    router.push(secondary_urlRename(pathname, updated, 'SECONDARY', true));
  };

  return (
    <div className="secondarySearchFields" dir={direction}>
      {isFilterModal && <div className="overlay"></div>}

      <div
        className={`allFields ${
          windowSize.width > 1400 ? "" : "responsive"
        } ${isFilterModal ? "showModal" : ""}`}
      >
        {/* MOBILE TOP HEADING */}
        {windowSize.width < 1401 && (
          <div className="top">
            <h1 className="mainHeading gradientText" style={{ marginBottom: "unset" }}>
              {t_secondary("properties_for_sale_in_dubai")}
            </h1>
            <div className="closeIcon" onClick={modalHandler}>
              <CloseIcon style={{fontSize: '8px'}} />
            </div>
          </div>
        )}

        {/* Fields Container */}
        <div className={`fieldsContainer ${isRTL ? 'ar' : ''}`}>
          {/* Offer Type */}
          {!isResidential && (
            <div
              className={`offeringType commonContainer ${isRTL ? 'ar' : ''}`}
              onClick={(e) => dropDownHandler(e, "OFFER")}
            >
              <div className="inputField">
                <div className="selectedValue">
                  <span>
                    {inputValues.offer
                      ? capitalizeWords(t_secondary(inputValues.offer))
                      : t_secondary("buy")}
                  </span>
                </div>
                {selectedDropDown === "OFFER" && (
                  <ul className="dropDown gradientBorder">
                    <li
                      className={isRTL ? 'ar' : ''}
                      onClick={(e) => handleChange("offer", "buy", e)}
                    >
                      <span>{t_secondary("buy")}</span>
                    </li>
                    <li
                      className={isRTL ? 'ar' : ''}
                      onClick={(e) => handleChange("offer", "rent", e)}
                    >
                      <span>{t_secondary("rent")}</span>
                    </li>
                  </ul>
                )}
                <span className="icon">
                  <DropDownArrow />
                </span>
              </div>
            </div>
          )}

          {/* Property Status */}
          {isResidential && inputValues.offer === "buy" && (
            <div
              className={`propertyStatus commonContainer ${isRTL ? 'ar' : ''} ${ pathname.includes("/buy/residential") ? "buyResidential" : ''}`}
              onClick={(e) => dropDownHandler(e, "PROPERTYSTATUS")}
              ref={dropDownRef}
            >
              <div className="inputField">
                <div className="selectedValue">
                  <span>
                    {inputValues.status
                      ? t_secondary(capitalizeWords(inputValues.status))
                      : t_secondary("all")}
                  </span>
                </div>
                {selectedDropDown === "PROPERTYSTATUS" && (
                  <ul className="dropDown gradientBorder">
                    <li
                      className={isRTL ? 'ar' : ''}
                      onClick={(e) => handleChange("status", "all", e)}
                    >
                      <span>{t_secondary("all")}</span>
                    </li>
                    <li
                      className={isRTL ? 'ar' : ''}
                      onClick={(e) => handleChange("status", "off-plan", e)}
                    >
                      <span>{t_secondary("offplan")}</span>
                    </li>
                    <li
                      className={isRTL ? 'ar' : ''}
                      onClick={(e) => handleChange("status", "ready", e)}
                    >
                      <span>{t_secondary("ready")}</span>
                    </li>
                  </ul>
                )}
                <span className="icon">
                  <DropDownArrow />
                </span>
              </div>
            </div>
          )}

          {/* Search Text */}
          <div
            className={`inputSection commonContainer ${isRTL ? 'ar' : ''} ${
              pathname.includes("/buy/residential") ? "buyResidential" :  pathname.includes("/rent/residential") ? "rentResidential" : "sale"
            }`}
            ref={searchDropDownRef}
          >
            <div className="inputField">
              <input
                type="text"
                name="keywords"
                value={capitalizeFirstLetters(inputValues.keywords || "")}
                placeholder={t_secondary("location_or_property")}
                onChange={handleUpdate}
                className={`${isRTL ? 'ar' : ''}`}
              />
              {searchDropDown && querySuggestions.length > 0 && (
                <ul className="dropDown gradientBorder">
                  {querySuggestions.map((mainItem) =>
                    mainItem.value.map((insideItem) => (
                      <li
                        key={insideItem.id}
                        className={isRTL ? 'ar' : ''}
                        onClick={(e) => {
                          handleChange(
                            "text",
                            insideItem.attributes.slug ||
                              insideItem.attributes.property_name,
                            e
                          );
                          setInputValues((prevValues) => ({
                            ...prevValues,
                            keywords:
                              insideItem.attributes.community_name ||
                              insideItem.attributes.property_name,
                          }));
                        }}
                      >
                        <span>
                          {insideItem.attributes.community_name ||
                            insideItem.attributes.property_name}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Property Type */}
          <div
            className={`propertyType commonContainer ${isRTL ? 'ar' : ''}`}
            onClick={(e) => dropDownHandler(e, "PROPERTYTYPE")}
          >
            <div className="inputField">
              <div className="selectedValue">
                <span>
                  {inputValues.property_type
                    ? capitalizeWords(t_secondary(inputValues.property_type))
                    : t_secondary("property_type")}
                </span>
              </div>
              {selectedDropDown === "PROPERTYTYPE" && (
                <ul className="dropDown gradientBorder">
                  {_propertyTypes
                    .filter((filterItem) =>
                      isResidential
                        ? filterItem.type === "Residential" ||
                          filterItem.type === "Any"
                        : filterItem.type === "Commercial" ||
                          filterItem.type === "Any"
                    )
                    .map((item) => (
                      <li
                        className={isRTL ? 'ar' : ''}
                        key={item.id}
                        onClick={(e) =>
                          handleChange("property_type", item.value, e)
                        }
                      >
                        <span>{item.label}</span>
                      </li>
                    ))}
                </ul>
              )}
              <span className="icon">
                <DropDownArrow />
              </span>
            </div>
          </div>

          {/* Bedrooms (Only if Residential) */}
          {isResidential && (
            <div
              className={`bedrooms commonContainer ${isRTL ? 'ar' : ''}`}
              onClick={(e) => dropDownHandler(e, "BEDROOM")}
            >
              <div className="inputField">
                <div className="selectedValue">
                  <span>
                    {inputValues.bedroom
                      ? `${isRTL ? formatNumberToArabic(inputValues.bedroom) : inputValues.bedroom} ${
                          inputValues.bedroom > 1
                            ? t_secondary("bedrooms")
                            : t_secondary("bedroom")
                        }`
                      : t_secondary("bedroom")}
                  </span>
                </div>
                {selectedDropDown === "BEDROOM" && (
                  <ul className="dropDown gradientBorder">
                    {_bedrooms.map((item) => (
                      <li
                        className={isRTL ? 'ar' : ''}
                        key={item.id}
                        onClick={(e) => handleChange("bedroom", item.value, e)}
                      >
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <span className="icon">
                  <DropDownArrow />
                </span>
              </div>
            </div>
          )}

          {/* Min Price */}
          <div
            className={`minPrice commonContainer ${isRTL ? 'ar' : ''}`}
            onClick={(e) => dropDownHandler(e, "MINPRICE")}
          >
            <div className="inputField">
              <div className="selectedValue">
                <span>
                  {inputValues.minPrice
                    ? `${isRTL
                        ? formatNumberToArabic(
                            convertMyCurrency({
                              value: inputValues.minPrice,
                              aed_to_gbp_exchange_rate,
                              aed_to_eur_exchange_rate,
                              aed_to_inr_exchange_rate,
                              aed_to_rub_exchange_rate,
                              aed_to_usd_exchange_rate,
                              currency
                            }),
                            true
                          )
                        : numberFormat(
                            convertMyCurrency({
                              value: inputValues.minPrice,
                              aed_to_gbp_exchange_rate,
                              aed_to_eur_exchange_rate,
                              aed_to_inr_exchange_rate,
                              aed_to_rub_exchange_rate,
                              aed_to_usd_exchange_rate,
                              currency
                            })
                          )
                      } ${t_secondary(currency.toString().toLowerCase())}`
                    : t("min_price")}
                </span>
              </div>
              {selectedDropDown === "MINPRICE" && (
                <ul className="dropDown gradientBorder">
                  {findPriceAndRest(price, minMaxPrices.minPrice).map((item) => {
                    const isSelectedSmallerThanMax =
                      parseFloat(item.value) < parseFloat(selectedMaxPrice);
                    return (
                      <li
                        key={item.id}
                        className={isRTL ? 'ar' : ''}
                        style={{
                          backgroundColor: isSelectedSmallerThanMax
                            ? ""
                            : "lightgray",
                        }}
                        onClick={(e) => {
                          if (isSelectedSmallerThanMax) {
                            handleChange("minPrice", item.value, e);
                          }
                        }}
                      >
                        <span
                          style={{
                            color: isSelectedSmallerThanMax ? "" : "#121823",
                          }}
                        >
                          {isRTL
                            ? formatNumberToArabic(
                                convertMyCurrency({
                                  value: item.value,
                                  aed_to_gbp_exchange_rate,
                                  aed_to_eur_exchange_rate,
                                  aed_to_usd_exchange_rate,
                                  aed_to_inr_exchange_rate,
                                  aed_to_rub_exchange_rate,
                                  currency
                                }),
                                true
                              )
                            : numberFormat(
                                convertMyCurrency({
                                  value: item.value,
                                  aed_to_gbp_exchange_rate,
                                  aed_to_eur_exchange_rate,
                                  aed_to_usd_exchange_rate,
                                  aed_to_inr_exchange_rate,
                                  aed_to_rub_exchange_rate,
                                  currency
                                })
                              )}{" "}
                          {t_secondary(currency.toString().toLowerCase())}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <span className="icon">
                <DropDownArrow />
              </span>
            </div>
          </div>

          {/* Max Price */}
          <div
            className={`maxPrice commonContainer ${pathname.includes("/rent/residential") ? 'rentResidential' : pathname.includes("/buy/residential") ? 'buyResidential' : ''} ${isRTL ? 'ar' : ''}`}
            onClick={(e) => dropDownHandler(e, "MAXPRICE")}
          >
            <div className="inputField">
              <div className="selectedValue">
                <span>
                  {inputValues.maxPrice
                    ? `${isRTL
                        ? formatNumberToArabic(
                            convertMyCurrency({
                              value: inputValues.maxPrice,
                              aed_to_gbp_exchange_rate,
                              aed_to_eur_exchange_rate,
                              aed_to_inr_exchange_rate,
                              aed_to_rub_exchange_rate,
                              aed_to_usd_exchange_rate,
                              currency
                            }),
                            true
                          )
                        : numberFormat(
                            convertMyCurrency({
                              value: inputValues.maxPrice,
                              aed_to_gbp_exchange_rate,
                              aed_to_eur_exchange_rate,
                              aed_to_inr_exchange_rate,
                              aed_to_rub_exchange_rate,
                              aed_to_usd_exchange_rate,
                              currency
                            })
                          )
                      } ${t(currency.toString().toLowerCase())}`
                    : t_secondary("max_price")}
                </span>
              </div>
              {selectedDropDown === "MAXPRICE" && (
                <ul className="dropDown gradientBorder">
                  {findPriceAndRest(price, minMaxPrices.minPrice).map((item) => {
                    const isSelectedBiggerThanMin =
                      parseFloat(item.value) > parseFloat(selectedMinPrice);
                    return (
                      <li
                        className={isRTL ? 'ar' : ''}
                        key={item.id}
                        style={{
                          backgroundColor: isSelectedBiggerThanMin
                            ? ""
                            : "lightgray",
                        }}
                        onClick={(e) => {
                          if (isSelectedBiggerThanMin) {
                            handleChange("maxPrice", item.value, e);
                          }
                        }}
                      >
                        <span
                          style={{
                            color: isSelectedBiggerThanMin ? "" : "#121823",
                          }}
                        >
                          {isRTL
                            ? formatNumberToArabic(
                                convertMyCurrency({
                                  value: item.value,
                                  aed_to_gbp_exchange_rate,
                                  aed_to_eur_exchange_rate,
                                  aed_to_usd_exchange_rate,
                                  aed_to_inr_exchange_rate,
                                  aed_to_rub_exchange_rate,
                                  currency
                                }),
                                true
                              )
                            : numberFormat(
                                convertMyCurrency({
                                  value: item.value,
                                  aed_to_gbp_exchange_rate,
                                  aed_to_eur_exchange_rate,
                                  aed_to_inr_exchange_rate,
                                  aed_to_rub_exchange_rate,
                                  aed_to_usd_exchange_rate,
                                  currency
                                })
                              )}{" "}
                          {t(currency.toString().toLowerCase())}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <span className="icon">
                <DropDownArrow />
              </span>
            </div>
          </div>

          {/* -------------------------------------- */}
          {/* NEW: Min Area */}
          {/* -------------------------------------- */}
          {!isResidential ? <div
            className={`minArea commonContainer ${isRTL ? 'ar' : ''}`}
            onClick={(e) => dropDownHandler(e, "MINAREA")}
          >
            <div className="inputField">
              <div className="selectedValue">
                <span>
                  {inputValues.minArea
                    ? `${convertFTM(inputValues.minArea)} ${t_secondary(areaUnit.toUpperCase())}` // or whatever label you want
                    : t_secondary("min_area")
                  }
                </span>
              </div>
              {selectedDropDown === "MINAREA" && (
                <ul className="dropDown gradientBorder">
                  {findAreaAndRest(areaOptions, minMaxAreas.minUnitArea, minMaxAreas.maxUnitArea).map((item) => {
                    // Make sure it's < selectedMaxArea
                    const isSelectedSmallerThanMaxArea =
                      parseFloat(item.value) < parseFloat(selectedMaxArea);
                    return (
                      <li
                        key={item.id}
                        className={isRTL ? 'ar' : ''}
                        style={{
                          backgroundColor: isSelectedSmallerThanMaxArea
                            ? ""
                            : "lightgray",
                        }}
                        onClick={(e) => {
                          if (isSelectedSmallerThanMaxArea) {
                            handleChange("minArea", item.value, e);
                          }
                        }}
                      >
                        <span>{convertFTM(item.value)} {t_secondary(areaUnit.toUpperCase())}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <span className="icon">
                <DropDownArrow />
              </span>
            </div>
          </div> : null}

          {/* -------------------------------------- */}
          {/* NEW: Max Area */}
          {/* -------------------------------------- */}
          {!isResidential ? <div
            className={`maxArea commonContainer ${isRTL ? 'ar' : ''}`}
            onClick={(e) => dropDownHandler(e, "MAXAREA")}
          >
            <div className="inputField">
              <div className="selectedValue">
                <span>
                  {inputValues.maxArea
                    ? `${convertFTM(inputValues.maxArea)} ${t_secondary(areaUnit.toUpperCase())}`
                    : t_secondary("max_area")
                  }
                </span>
              </div>
              {selectedDropDown === "MAXAREA" && (
                <ul className="dropDown gradientBorder">
                  {findAreaAndRest(areaOptions, minMaxAreas.minUnitArea, minMaxAreas.maxUnitArea).map((item) => {
                    // Make sure it's > selectedMinArea
                    const isSelectedBiggerThanMinArea =
                      parseFloat(item.value) > parseFloat(selectedMinArea);
                    return (
                      <li
                        key={item.id}
                        className={isRTL ? 'ar' : ''}
                        style={{
                          backgroundColor: isSelectedBiggerThanMinArea
                            ? ""
                            : "lightgray",
                        }}
                        onClick={(e) => {
                          if (isSelectedBiggerThanMinArea) {
                            handleChange("maxArea", item.value, e);
                          }
                        }}
                      >
                        <span>{convertFTM(item.value)} {t_secondary(areaUnit.toUpperCase())}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <span className="icon">
                <DropDownArrow />
              </span>
            </div>
          </div> : null}
          {/* -------------------------------------- */}
        </div>
        <div className="buttonAndFilters" style={{ width: `calc(94.5% + 30px)`, height: '7rem' }}>
          <div className={`frame ${isRTL ? 'ar' : ''}`}>
            <div className="plainButton" onClick={resetFilters}>{t("Reset Filters")}</div>
            <div className="inputField applyFilters">
              <div className="selectedValue">
                <div className="applyFilters" onClick={pageRouting}>{t("APPLY FILTERS")}</div>
              </div>
            </div>
          </div>
          {windowSize.width > 1400 && activeFilters.length > 0 && (
          <div className="filterPills" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {activeFilters.map(({ key, label }) => (
              <span 
                key={key} 
                className="pill" 
                style={{
                  color: '#f0f0f0',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  display: 'inline-block',
                  cursor: 'pointer',
                  padding: '10px',
                  border: '1px solid #F0CAB2'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter(key);
                }}
              >
                <span style={{ marginRight: '1ch' }}>{label}</span>
                <CloseIcon style={{fontSize: '8px'}} />
              </span>
            ))}
          </div>
        )}
        </div>
        {/* Sort Order Dropdown (Desktop Only) */}
        {windowSize.width > 1400 ? (
          <div style={{ width: `calc(99.5% + 30px)` }}>
            <div
              className={`sortOrder commonContainer ${isRTL ? 'ar' : ''}`}
              onClick={(e) => dropDownHandler(e, "SORTORDER")}
            >
              <div className="inputField">
                <div className="selectedValue desktopSort">
                  <span>
                    {sortOrder === "new_to_old"
                      ? t_secondary("order_new_to_old")
                      : sortOrder === "price_low_high"
                      ? t_secondary("price_low_to_high")
                      : sortOrder === "price_high_low"
                      ? t_secondary("price_high_to_low")
                      : "Sort by"}
                  </span>
                </div>
                {selectedDropDown === "SORTORDER" && (
                  <ul className="dropDown gradientBorder desktopSort">
                    <li
                      className={isRTL ? 'ar' : ''}
                      onClick={(e) => handleChange("sortOrder", "new_to_old", e)}
                    >
                      <span>{t_secondary("order_new_to_old")}</span>
                    </li>
                    <li
                      className={isRTL ? 'ar' : ''}
                      onClick={(e) => handleChange("sortOrder", "price_low_high", e)}
                    >
                      <span>{t_secondary("price_low_to_high")}</span>
                    </li>
                    <li
                      className={isRTL ? 'ar' : ''}
                      onClick={(e) => handleChange("sortOrder", "price_high_low", e)}
                    >
                      <span>{t_secondary("price_high_to_low")}</span>
                    </li>
                  </ul>
                )}
                <div className="icon">
                  <SortIcon />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Filter Button on Mobile */}
      {windowSize.width < 1401 && (
        <>
          <div className="filterBtn">
            <button className="globalBtn" onClick={modalHandler}>
              <span className="text">
                {t_secondary("all_filters").toString().toLowerCase()}
              </span>
              <span className="icon">
                <FilterIcon />
              </span>
            </button>
          </div>
          {activeFilters.length > 0 && (
            <div className="filterPills" style={{ marginTop: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginLeft: '1.2%' }}>
              {activeFilters.map(({ key, label }) => (
                <span 
                  key={key} 
                  className="pill" 
                  style={{
                    color: '#f0f0f0',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    display: 'inline-block',
                    cursor: 'pointer',
                    padding: '7.5px 12px',
                    border: '1px solid #F0CAB2'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter(key);
                  }}
                >
                  <span style={{ marginRight: '1ch' }}>{label}</span>
                    <CloseIcon style={{fontSize: '8px'}} />
                </span>
              ))}
            </div>
          )}
        </>
      )}
      {(totalNbProperties === totalNbPropertiesArchived && !isEmpty(searchParams)) && 
        <div className="noAvailableUnits">
          <div className="noAvailableUnitsText">
            {t('It seems that no available units matched your search')} <span>{t("Try adjusting your filters and explore more options")}</span>
          </div>
          <div className="noAvailableUnitsButton">
            <div className="plainButton Withbackground" onClick={resetFilters}>{t("Reset Filters")}</div>
          </div>
        </div>
      }
    </div>
  );
};

export default SecondarySearch;