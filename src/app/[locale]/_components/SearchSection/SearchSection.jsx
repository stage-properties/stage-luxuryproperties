"use client";
import dynamic from "next/dynamic";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { fetchSearchSuggestions } from "./service";
import { useRouter } from "@/i18n/routing";
import {
  bedrooms,
  bedrooms_ar,
  price,
  price_ar,
  areaOptions,
} from "@/app/[locale]/_utils/contants";
import {
  fetchMinMaxAreas,
  fetchMinMaxPrices,
} from "@/app/[locale]/(dubai)/[offeringType]/service";
import {
  convertMyCurrency,
  convertMyCurrencyReturnRate,
  formatNumberToArabic,
  numberFormat,
} from "../../_utils/utils";
import { useSelector } from "react-redux";

const SearchIcon = dynamic(() =>
  import("../../../../../assets/Icons/searchIcon.svg")
);
const Select = dynamic(() => import("react-select"));
const DropDownArrow = dynamic(() =>
  import("../../../../../assets/Icons/dropdownArrow.svg")
);

const SearchSection = ({ bgColor }) => {
  const t = useTranslations("common");
  const currency = useSelector((state) => state.currency.value);
  const areaUnit = useSelector((state) => state.areaUnit.value);

  const locale = useLocale();
  const isRTL = locale === "ar";

  const router = useRouter();

  // Track which dropdown is open (OFFER, BED, PRICE, AREA)
  const [activeDropDown, setActiveDropDown] = useState(null);
  // Search suggestions for the text input
  const [searchDropDown, setSearchDropDown] = useState(true);
  // Price
  const [selectedMinPrice, setSelectedMinPrice] = useState(null);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(null);
  // **AREA** new states
  const [selectedMinArea, setSelectedMinArea] = useState(null);
  const [selectedMaxArea, setSelectedMaxArea] = useState(null);

  // Fetched search suggestions
  const [searchSuggestions, setSearchSuggestions] = useState(null);
  // Track if a user selected a known item (community, developer, etc.)
  const [selectedKeywords, setSelectedKeywords] = useState();
  // Category (RESIDENTIAL, COMMERCIAL, OFFPLAN)
  const [category, setCategory] = useState("RESIDENTIAL");
  // Whether category button dropdown is open on mobile
  const [dropDownBtn, setDropDownBtn] = useState(false);

  // Refs for dropdowns so we can close them when clicking outside
  const dropDownRefBed = useRef(null);
  const searchDropDownRefBed = useRef(null);
  const dropDownBtnRef = useRef(null);

  // Our main form values
  const [inputValues, setInputValues] = useState({
    offer: "BUY",
    minPrice: "",
    maxPrice: "",
    // We will STILL store raw numeric values for area in here
    // after the user picks from the dropdown.
    minArea: "",
    maxArea: "",
  });

  // List of possible price from back-end
  const [prices, setPrices] = useState([]);

  // List of possible areas from back-end
  const [areas, setAreas] = useState([]);

  // Prefetch offplan route (optional)
  useEffect(() => {
    router.prefetch("/offplan");
  }, [router]);

  // Close dropdowns if we click outside them
  useEffect(() => {
    const handleOutClick = (e) => {
      if (!dropDownRefBed?.current?.contains(e.target)) {
        setActiveDropDown(null);
      }
      if (!searchDropDownRefBed?.current?.contains(e.target)) {
        setSearchDropDown(false);
      }
      if (!dropDownBtnRef?.current?.contains(e.target)) {
        setDropDownBtn(false);
      }
    };
    window.addEventListener("click", handleOutClick);
    return () => {
      window.removeEventListener("click", handleOutClick);
    };
  }, []);

  // If user types something in the main text input, fetch suggestions
  useEffect(() => {
    if (inputValues?.text && searchDropDown) {
      getSearchSuggestion();
    }
  }, [inputValues, searchDropDown]);

  // Fetch search suggestions
  const getSearchSuggestion = async () => {
    try {
      const query = `locale=${locale}&text=${
        inputValues?.text
      }&searchType=scndry&ctg=${category.toLowerCase()}&oft=${
        inputValues?.offer === "BUY" ? "BY" : "RT"
      }`;
      const response = await fetchSearchSuggestions(query);
      if (response?.length) {
        setSearchDropDown(true);
        setActiveDropDown(null);
      }
      setSearchSuggestions(response);
    } catch (err) {
      console.error(err);
    }
  };

  // Basic handleChange function for the text input
  const handleChange = (name, value) => {
    // If user changes 'text', clear any previous selection
    if (name === "text" && selectedKeywords?.result_type) {
      setSelectedKeywords(null);
    }
    setInputValues({ ...inputValues, [name]: value });
  };

  // MAIN TEXT or ANY input onChange
  const handleUpdate = (e) => {
    const { name, value } = e.target;
    if (name === "text") {
      setSearchDropDown(true);
    }
    handleChange(name, value);
  };

  // Offer dropdown
  const offeringDropDownHandler = (e, val) => {
    e.stopPropagation();
    handleChange("offer", val);
    setActiveDropDown(null);
  };

  // Bedrooms dropdown
  const bedDropDownHandler = (e, count) => {
    e.stopPropagation();
    handleChange("bed", count);
    setActiveDropDown(null);
  };

  // Price dropdown changes
  const minPriceHandleChange = (option) => {
    console.log("option", option);

    setSelectedMinPrice(option);
    if (option) {
      // Convert from user currency back to base numeric
      const valueWithRate = option.value / option.rate;
      handleChange("minPrice", valueWithRate);
    } else {
      handleChange("minPrice", "");
    }
  };
  const maxPriceHandleChange = (option) => {
    setSelectedMaxPrice(option);
    if (option) {
      const valueWithRate = option.value / option.rate;
      handleChange("maxPrice", valueWithRate);
    } else {
      handleChange("maxPrice", "");
    }
  };

  // ** AREA DROPDOWN changes
  const minAreaHandleChange = (option) => {
    setSelectedMinArea(option);
    // const ratio = areaUnit === 'ft²' ? 1 : 0.3048
    if (option) {
      handleChange("minArea", option.value);
    } else {
      handleChange("minArea", "");
    }
  };
  const maxAreaHandleChange = (option) => {
    setSelectedMaxArea(option);
    if (option) {
      handleChange("maxArea", option.value);
    } else {
      handleChange("maxArea", "");
    }
  };

  // Category switching
  const categoryBtnHandler = (type) => {
    if (type === "OFFPLAN") {
      router.push(`/offplan`);
    } else {
      setCategory(type);
    }
  };

  // Build the final query and push to router
  const searchSubmitHandler = () => {
    let url = "";
    let emirate = "allemirates";
    let containsQuery = false;

    // bed
    if (inputValues?.bed) {
      url += containsQuery ? "&" : "?";
      url += `bedroom=${inputValues?.bed}`;
      containsQuery = true;
    }

    // area
    if (inputValues?.minArea) {
      url += containsQuery ? "&" : "?";
      url += `minArea=${inputValues?.minArea}`;
      containsQuery = true;
    }
    if (inputValues?.maxArea) {
      url += containsQuery ? "&" : "?";
      url += `maxArea=${inputValues?.maxArea}`;
      containsQuery = true;
    }

    // price
    if (inputValues?.minPrice) {
      url += containsQuery ? "&" : "?";
      url += `minPrice=${inputValues?.minPrice}`;
      containsQuery = true;
    }
    if (inputValues?.maxPrice) {
      url += containsQuery ? "&" : "?";
      url += `maxPrice=${inputValues?.maxPrice}`;
      containsQuery = true;
    }

    // keywords / text
    if (inputValues?.text) {
      url += containsQuery ? "&" : "?";

      if (selectedKeywords && selectedKeywords.result_type === "community") {
        const replacedValue = selectedKeywords.item_name
          .replace(/ /g, "-")
          .toLowerCase();
        url += `keywords=${replacedValue}`;
        const emiratesReplacedValue = selectedKeywords.emirate
          .replace(/ /g, "-")
          .toLowerCase();
        emirate = emiratesReplacedValue;
      } else {
        const replacedValue = inputValues.text.replace(/ /g, "-").toLowerCase();
        url += `keywords=${replacedValue}`;
      }

      containsQuery = true;
    }

    router.push(
      `/${inputValues?.offer.toLowerCase()}/${category.toLowerCase()}/properties-for-${
        inputValues?.offer === "BUY" ? "sale" : "rent"
      }/${url}`
    );
  };

  // Fill the dropdown for bedroom counts
  const _bedrooms = isRTL ? bedrooms_ar : bedrooms;

  // Custom styles for react-select
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isDisabled
        ? "gray"
        : state.isSelected
        ? "#2684FF"
        : state.isFocused
        ? "#B2D4FF"
        : "white",
      color: state.isDisabled ? "lightgray" : "black",
      cursor: state.isDisabled ? "not-allowed" : "default",
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  // Fetch min/max price from the backend
  useEffect(() => {
    const _fetchMinMaxPrices = async () => {
      const offer = inputValues?.offer === "BUY" ? "Sale" : "Rent";
      const minMaxPrices = await fetchMinMaxPrices({
        offeringType: offer,
        categoryName: category,
      });
      const configuration = minMaxPrices?.configuration?.data?.attributes;
      if (!configuration) return;

      const {
        aed_to_usd_exchange_rate,
        aed_to_eur_exchange_rate,
        aed_to_gbp_exchange_rate,
        aed_to_inr_exchange_rate,
        aed_to_rub_exchange_rate,
      } = configuration;

      const _prices = price
        ?.filter(
          (item) =>
            parseFloat(item?.value) > minMaxPrices?.minPrice &&
            parseFloat(item?.value) < minMaxPrices?.maxPrice
        )
        ?.map((item) => {
          const value = convertMyCurrency({
            aed_to_eur_exchange_rate,
            aed_to_gbp_exchange_rate,
            aed_to_inr_exchange_rate,
            aed_to_rub_exchange_rate,
            aed_to_usd_exchange_rate,
            currency,
            value: item?.value,
          });

          const { rate } = convertMyCurrencyReturnRate({
            aed_to_eur_exchange_rate,
            aed_to_gbp_exchange_rate,
            aed_to_inr_exchange_rate,
            aed_to_rub_exchange_rate,
            aed_to_usd_exchange_rate,
            currency,
            value: item?.value,
          });

          const label = `${
            locale === "ar" ? formatNumberToArabic(value) : numberFormat(value)
          } ${t(currency.toLowerCase())}`;
          return { ...item, value, label, rate };
        });
      setPrices(_prices);
    };

    _fetchMinMaxPrices();
  }, [inputValues?.offer, category, currency]);

  const findAreaAndRest = (arr, minNumber, maxNumber) => {
    // Ensure the array is sorted in ascending order by the numeric value
    const sortedArr = arr
      .slice()
      .sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

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

  // Fetch min/max area from the backend
  useEffect(() => {
    const _fetchMinMaxAreas = async () => {
      const offer = inputValues?.offer === "BUY" ? "Sale" : "Rent";
      const minMaxAreas = await fetchMinMaxAreas({
        offeringType: offer,
        categoryName: category,
      });
      const _areas = findAreaAndRest(
        areaOptions,
        minMaxAreas.minUnitArea,
        minMaxAreas.maxUnitArea
      )?.map((item) => {
        const ratio = areaUnit === "ft²" ? 1 : 0.092903;
        const value = item?.value * ratio;
        const label = isRTL
          ? `${formatNumberToArabic(Math.floor(value), true)} ${t(
              areaUnit.toUpperCase()
            )}`
          : `${numberFormat(Math.floor(value))} ${t(areaUnit.toUpperCase())}`;
        return { value: item?.value, label };
      });
      setAreas(_areas);
    };

    _fetchMinMaxAreas();
  }, [inputValues?.offer, category, areaUnit]);

  useEffect(() => {
    // Reset price filters when the category changes.
    setSelectedMinPrice(null);
    setSelectedMaxPrice(null);
    setInputValues((prev) => ({
      ...prev,
      minPrice: "",
      maxPrice: "",
    }));
  }, [category]);

  useEffect(() => {
    // Reset selected price values when currency changes
    setSelectedMinPrice(null);
    setSelectedMaxPrice(null);
    setInputValues((prev) => ({
      ...prev,
      minPrice: "",
      maxPrice: "",
    }));
  }, [currency]);

  return (
    <div id="searchSection" className={bgColor ? `bgColor` : ``}>
      {/* CATEGORY DROPDOWN (MOBILE) */}
      <div className="buttonDropDown">
        <button
          onClick={() => setDropDownBtn(!dropDownBtn)}
          ref={dropDownBtnRef}
        >
          <span className="text">{t(category.toLowerCase())}</span>
          <span className={`icon ${isRTL ? "ar" : ""}`}>
            <DropDownArrow />
          </span>
        </button>
        {dropDownBtn && (
          <div className="dropDown">
            <ul className="listDropdownitems gradientBorder">
              <li onClick={() => categoryBtnHandler("RESIDENTIAL")}>
                <span className="text">{t("residential")}</span>
              </li>
              <li onClick={() => categoryBtnHandler("COMMERCIAL")}>
                <span className="text">{t("commercial")}</span>
              </li>
              <li onClick={() => categoryBtnHandler("OFFPLAN")}>
                <span className="text">{t("offplan")}</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* CATEGORY BUTTONS (DESKTOP) */}
      <div
        className={dropDownBtn ? "buttonContainer active" : "buttonContainer"}
      >
        <button
          className={`button residential ${
            category === "RESIDENTIAL" ? "active" : ""
          }`}
          data-aos="fade-up"
          data-aos-delay="50"
          onClick={() => categoryBtnHandler("RESIDENTIAL")}
        >
          <span>{t("residential")}</span>
        </button>
        <button
          className={`button commercial ${
            category === "COMMERCIAL" ? "active" : ""
          }`}
          data-aos="fade-up"
          data-aos-delay="30"
          onClick={() => categoryBtnHandler("COMMERCIAL")}
        >
          <span>{t("commercial")}</span>
        </button>
        <button
          className={`button offPlan ${category === "OFFPLAN" ? "active" : ""}`}
          data-aos="fade-up"
          data-aos-delay="70"
          onClick={() => categoryBtnHandler("OFFPLAN")}
        >
          <span>{t("offplan")}</span>
        </button>
      </div>

      <div className="searchContainer">
        <div className="left">
          {/* OFFER DROPDOWN */}
          <div
            className={`types search-common ${isRTL ? "ar" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropDown("OFFER");
            }}
          >
            <div className="list">
              <span className={`details ${isRTL ? "ar" : ""}`}>
                {inputValues.offer
                  ? t(inputValues.offer.toLowerCase()).toUpperCase()
                  : t("buy").toUpperCase()}
              </span>
              <span className={`icon ${isRTL ? "ar" : ""}`}>
                <DropDownArrow />
              </span>
            </div>
            {activeDropDown === "OFFER" && (
              <div className={`dropDown ${isRTL ? "ar" : ""}`}>
                <ul className="listDropdownitems">
                  <li onClick={(e) => offeringDropDownHandler(e, "BUY")}>
                    <span className="text">{t("buy").toUpperCase()}</span>
                  </li>
                  <li onClick={(e) => offeringDropDownHandler(e, "RENT")}>
                    <span className="text">{t("rent").toUpperCase()}</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* BED DROPDOWN (only for Residential) */}
          {category === "RESIDENTIAL" && (
            <div
              ref={dropDownRefBed}
              className={`beds search-common ${isRTL ? "ar" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropDown("BED");
              }}
            >
              <div className="list">
                <span className={`details ${isRTL ? "ar" : ""}`}>
                  {inputValues.bed
                    ? isRTL
                      ? formatNumberToArabic(inputValues.bed) +
                        (inputValues.bed === 1
                          ? ` ${t("bed").toUpperCase()}`
                          : inputValues.bed === 7
                          ? `+ ${t("beds").toUpperCase()}`
                          : ` ${t("beds").toUpperCase()}`)
                      : inputValues.bed +
                        (inputValues.bed === 1
                          ? ` ${t("bed").toUpperCase()}`
                          : inputValues.bed === 7
                          ? `+ ${t("beds").toUpperCase()}`
                          : ` ${t("beds").toUpperCase()}`)
                    : t("beds").toUpperCase()}
                </span>
                <span className={`icon ${isRTL ? "ar" : ""}`}>
                  <DropDownArrow />
                </span>
              </div>
              {activeDropDown === "BED" && (
                <div className={`dropDown ${isRTL ? "ar" : ""}`}>
                  <ul className="listDropdownitems">
                    {_bedrooms?.map((item) => (
                      <li
                        key={item.id}
                        onClick={(e) => bedDropDownHandler(e, item.value)}
                      >
                        <span className="text">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* PRICE DROPDOWN */}
          <div
            className={`price search-common ${
              isRTL ? "ar" : ""
            } tablet-desktop-only`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropDown("PRICE");
            }}
          >
            <div className="list">
              <span className={`details ${isRTL ? "ar" : ""}`}>
                {t("price").toUpperCase()}
              </span>
              <span className={`icon ${isRTL ? "ar" : ""}`}>
                <DropDownArrow />
              </span>
            </div>
            {activeDropDown === "PRICE" && (
              <div className={`dropDown ${isRTL ? "ar" : ""}`}>
                <div className="selectContainer">
                  <Select
                    placeholder={t("min_price")}
                    value={selectedMinPrice || ""}
                    isSearchable
                    name="min-price"
                    options={prices}
                    onChange={minPriceHandleChange}
                    isOptionDisabled={(option) =>
                      selectedMaxPrice &&
                      parseInt(option.value) >= parseInt(selectedMaxPrice.value)
                    }
                    styles={customStyles}
                  />
                </div>
                <div className="selectContainer">
                  <Select
                    placeholder={t("max_price")}
                    value={selectedMaxPrice || ""}
                    isSearchable
                    name="max-price"
                    options={prices}
                    onChange={maxPriceHandleChange}
                    isOptionDisabled={(option) =>
                      selectedMinPrice &&
                      parseInt(option.value) <= parseInt(selectedMinPrice.value)
                    }
                    styles={customStyles}
                  />
                </div>
              </div>
            )}
          </div>
          {/* PRICE DROPDOWNS */}
          <div className="price-dropdowns mobile-only">
            {/* MIN PRICE DROPDOWN */}
            <div
              className={`min-price search-common ${isRTL ? "ar" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropDown("MIN_PRICE");
              }}
            >
              <div className="list">
                <span className={`details ${isRTL ? "ar" : ""}`}>
                  {selectedMinPrice
                    ? selectedMinPrice.label
                    : t("min_price").toUpperCase()}
                </span>
                <span className={`icon ${isRTL ? "ar" : ""}`}>
                  <DropDownArrow />
                </span>
              </div>
              {activeDropDown === "MIN_PRICE" && (
                <div className={`dropDown ${isRTL ? "ar" : ""}`}>
                  <ul className="listDropdownitems">
                    {prices.map((item) => {
                      // Disable items that are not allowed when a max price is selected
                      const isDisabled =
                        selectedMaxPrice &&
                        parseInt(item.value) >=
                          parseInt(selectedMaxPrice.value);
                      return (
                        <li
                          key={item.value}
                          className={isDisabled ? "disabled" : ""}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDisabled) {
                              minPriceHandleChange(item);
                              setActiveDropDown(null);
                            }
                          }}
                        >
                          <span className="text">{item.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* MAX PRICE DROPDOWN */}
            <div
              className={`max-price search-common ${isRTL ? "ar" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropDown("MAX_PRICE");
              }}
            >
              <div className="list">
                <span className={`details ${isRTL ? "ar" : ""}`}>
                  {selectedMaxPrice
                    ? selectedMaxPrice.label
                    : t("max_price").toUpperCase()}
                </span>
                <span className={`icon ${isRTL ? "ar" : ""}`}>
                  <DropDownArrow />
                </span>
              </div>
              {activeDropDown === "MAX_PRICE" && (
                <div className={`dropDown ${isRTL ? "ar" : ""}`}>
                  <ul className="listDropdownitems">
                    {prices.map((item) => {
                      // Disable items that are not allowed when a min price is selected
                      const isDisabled =
                        selectedMinPrice &&
                        parseInt(item.value) <=
                          parseInt(selectedMinPrice.value);
                      return (
                        <li
                          key={item.value}
                          className={isDisabled ? "disabled" : ""}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDisabled) {
                              maxPriceHandleChange(item);
                              setActiveDropDown(null);
                            }
                          }}
                        >
                          <span className="text">{item.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* AREA DROPDOWN (only for COMMERCIAL, as you indicated) */}
          {category === "COMMERCIAL" && (
            <div
              className={`area search-common ${isRTL ? "ar" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropDown("AREA");
              }}
            >
              <div className="list">
                <span className={`details ${isRTL ? "ar" : ""}`}>
                  {t("area").toUpperCase()} ({t(areaUnit.toUpperCase())})
                </span>
                <span className={`icon ${isRTL ? "ar" : ""}`}>
                  <DropDownArrow />
                </span>
              </div>
              {activeDropDown === "AREA" && (
                <div className={`dropDown ${isRTL ? "ar" : ""}`}>
                  <div className="selectContainer">
                    <Select
                      placeholder={t("min_area")}
                      value={selectedMinArea || ""}
                      isSearchable
                      name="minArea"
                      options={areas}
                      onChange={minAreaHandleChange}
                      isOptionDisabled={(option) =>
                        // disable if option.value >= selectedMaxArea?.value
                        selectedMaxArea?.value
                          ? option.value >= selectedMaxArea.value
                          : false
                      }
                      styles={customStyles}
                    />
                  </div>
                  <div className="selectContainer">
                    <Select
                      placeholder={t("max_area")}
                      value={selectedMaxArea || ""}
                      isSearchable
                      name="maxArea"
                      options={areas}
                      onChange={maxAreaHandleChange}
                      isOptionDisabled={(option) =>
                        // disable if option.value <= selectedMinArea?.value
                        selectedMinArea?.value
                          ? option.value <= selectedMinArea.value
                          : false
                      }
                      styles={customStyles}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMMUNITY / PROPERTY SEARCH INPUT */}
          <input
            dir={isRTL ? "rtl" : "ltr"}
            className={`searchInput ${isRTL ? "ar" : ""}`}
            type="text"
            name="text"
            value={inputValues.text || ""}
            placeholder={t("community_or_property")}
            onChange={handleUpdate}
            ref={searchDropDownRefBed}
          />

          {/* SEARCH SUGGESTIONS DROPDOWN */}
          {searchDropDown && searchSuggestions?.length > 0 && (
            <div className="dropDown">
              <ul className="listDropdownitems">
                {searchSuggestions?.map((group) =>
                  group.value?.map((valueItem) => (
                    <li
                      key={valueItem?.id}
                      onClick={() => {
                        handleChange(
                          "text",
                          valueItem?.attributes?.project_name ||
                            valueItem?.attributes?.developer_name ||
                            valueItem?.attributes?.community_name ||
                            valueItem?.attributes?.property_name
                        );
                        setSearchDropDown(false);
                        setSelectedKeywords({
                          result_type: group?.type,
                          emirate:
                            valueItem?.attributes?.emirate?.data?.attributes
                              ?.emirate_name,
                          item_name:
                            valueItem?.attributes?.project_name ||
                            valueItem?.attributes?.developer_name ||
                            valueItem?.attributes?.slug ||
                            valueItem?.attributes?.property_name,
                        });
                      }}
                    >
                      <span className="text">
                        {valueItem?.attributes?.project_name ||
                          valueItem?.attributes?.property_name ||
                          valueItem?.attributes?.developer_name ||
                          valueItem?.attributes?.community_name}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        {/* SEARCH BUTTON */}
        <div className={`right ${isRTL ? "ar" : ""}`}>
          <SearchIcon onClick={searchSubmitHandler} />
          <button className="search globalBtn" onClick={searchSubmitHandler}>
            {t("search")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
