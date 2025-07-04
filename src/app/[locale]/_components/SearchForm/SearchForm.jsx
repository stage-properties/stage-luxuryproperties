"use client";
import React, { useEffect, useRef, useState } from "react";
import DropDownArrow from "../../../../../assets/Icons/dropdownArrow.svg";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { convertMyCurrency, fetchAPI, formatNumberToArabic, numberFormat, offplan_queryGeneratorAndWordChecker, offplan_urlRename } from "@/app/[locale]/_utils/utils";
import { useRouter, usePathname } from "@/i18n/routing";
import { fetchSearchSuggestions } from "../SearchSection/service";
import { price } from "@/app/[locale]/_utils/contants";
import { isObjectEmpty } from "@/app/[locale]/_utils/utils";
import { useSelector } from "react-redux";
import { useTranslations, useLocale } from 'next-intl';

const SearchForm = ({searchResults, params, searchParams, style={}}) => {

  // Toggle state
  const [isToggled, setIsToggled] = useState(searchParams?.posthandover ?? false);

  // Toggle change handler
  const handleToggleChange = (e) => {
    const newValue = e.target.checked;
    setIsToggled(newValue);

    // Immediately update the filters with the new toggle value
    const isUpdatingFields = true;
    const _pathname = pathname.replace(/page-\d+/, `page-1`);
    const preservedSort = searchParams.sort || "launch_date_latest";
    const filters = {
      ...inputValues,
      sortOrder: preservedSort,
      posthandover: newValue,
    };
    router.push(offplan_urlRename(_pathname, filters, "OFFPLAN", isUpdatingFields), { scroll: false });
  };

  const t = useTranslations('offplan');
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl': "ltr"

  const [activeDropDown, setActiveDropDown] = useState(null);
  const [searchDropDown, setSearchDropDown] = useState(true);
  const dropDownRef = useRef(null);
  const pathname = usePathname()

  const [selectedMinPrice, setSelectedMinPrice] = useState(searchParams.minPrice ?? Number.MIN_SAFE_INTEGER);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(searchParams.maxPrice ?? Number.MAX_SAFE_INTEGER);

  const [inputValues, setInputValues] = useState({});
  const [searchSuggestions, setSearchSuggestions] = useState(null);

  const [minPriceStrapi, setMinPriceStrapi] = useState(0)
  const [aed_to_usd_exchange_rate, set_aed_to_usd_exchange_rate] = useState()
  const [aed_to_eur_exchange_rate, set_aed_to_eur_exchange_rate] = useState()
  const [aed_to_gbp_exchange_rate, set_aed_to_gbp_exchange_rate] = useState()
  const [aed_to_inr_exchange_rate, set_aed_to_inr_exchange_rate] = useState()
  const [aed_to_rub_exchange_rate, set_aed_to_rub_exchange_rate] = useState()

  const searchDropDownRef = useRef(null);
  const dispatch = useDispatch()
  const router = useRouter()
  const minPrice = [
    { value: null, label: "No Min" },
    { value: 300000, label: "300,000 AED" },
    { value: 400000, label: "400,000 AED" },
    { value: 500000, label: "500,000 AED" },
    { value: 600000, label: "600,000 AED" },
    { value: 700000, label: "700,000 AED" },
    { value: 800000, label: "800,000 AED" },
    { value: 900000, label: "900,000 AED" },
    { value: 1000000, label: "1000,000 AED" },
  ];
  const maxPrice = [
    { value: null, label: "No Min" },
    { value: 300000, label: "300,000 AED" },
    { value: 400000, label: "400,000 AED" },
    { value: 500000, label: "500,000 AED" },
    { value: 600000, label: "600,000 AED" },
    { value: 700000, label: "700,000 AED" },
    { value: 800000, label: "800,000 AED" },
    { value: 900000, label: "900,000 AED" },
    { value: 1000000, label: "1000,000+ AED" },
  ];
  useEffect(() => {
   let initialValues = offplan_queryGeneratorAndWordChecker(params, searchParams)
   if(Object.keys(initialValues?.valuesForInput).length){
    setInputValues(initialValues?.valuesForInput)
   }
  },[pathname, searchParams])

  useEffect(() => {
    let handleOutClick = (e) => {
      if (!dropDownRef?.current?.contains(e.target)) {
        setActiveDropDown(null);
      }
      if (!searchDropDownRef?.current?.contains(e.target)) {
        setSearchDropDown(false);
      }
    };
    window.addEventListener("click", handleOutClick);
  }, [dropDownRef]);

  useEffect(() => {
    if(inputValues?.text && searchDropDown){
      getSearchSuggestion()
    }else{
      setSearchDropDown(false)
    }
  }, [inputValues]);

  const dropDownHandler = (e, type) => {
    e.stopPropagation();
    setActiveDropDown(type);
  };

  const getSearchSuggestion = async () => {
    try {
      let query = `text=${inputValues?.text}`
      const response = await fetchSearchSuggestions(query + `&locale=${locale}`);
      if (response?.length) {
        setSearchDropDown(true);
        setActiveDropDown(null);
      }
      setSearchSuggestions(response)
    } catch (err) {}
  };

  const minPriceHandleChange = (value,e) => {
    e.stopPropagation()
    setSelectedMinPrice(value);
    handleChange("minPrice",value)
    setActiveDropDown("")

  };

  const maxPriceHandleChange = (value,e) => {
    e.stopPropagation()
    setSelectedMaxPrice(value);
    handleChange("maxPrice",value)
    setActiveDropDown("")

  };

  const handleUpdate = (item) => {
    const { name, value } = item?.target;
    if (name === 'text') {setSearchDropDown(true)}
    handleChange(name, value);
  };

  const handleChange = (name, value,type_id) => {
    if (name === 'bed') {
      setActiveDropDown(null)
    }
    if (name === "text") {
      setSearchDropDown(true);
    }
    setInputValues({
      ...inputValues,
      [name]: value,
    });

  };

  function removeDuplicates(array) {
    const uniqueCities = {};
    return array.filter(item => {
      const developerName = item.developer_name;
      if (!uniqueCities[developerName]) {
        uniqueCities[developerName] = true;
        return true;
      }
      return false;
    });
  }

  const dropDownSelecter = (e,value,type) => {
    e.stopPropagation()
    if(type === 'BED'){
        handleChange('bed',value)
    }else if('TYPE'){
        handleChange('type',value)
    }
    setActiveDropDown(null)
  }
  // Function to filter results based on the specified criteria
  const filterResults = () => {
    return searchResults?.filter((item) => {
    //   const cityMatch = !inputValues?.text || item?.city?.toLowerCase().startsWith(inputValues?.text?.toLowerCase());
      const developerMatch = !inputValues?.text || item?.developer_name.toLowerCase().startsWith(inputValues?.text?.toLowerCase());
      const titleMatch = !inputValues?.title || item?.title.toLowerCase().includes(inputValues?.title.toLowerCase());
      const typeMatch = !inputValues?.type || item?.type?.some((t) => t?.type_name?.toLowerCase() === inputValues?.type.toLowerCase());
      const minPriceMatch = !inputValues?.minPrice || Number(item?.starting_from) >= Number(inputValues?.minPrice);
      const maxPriceMatch = !inputValues?.maxPrice || Number(item?.starting_from) >= Number(inputValues?.maxPrice);
      const bedMatch = !inputValues?.bed || Number(item?.total_bedrooms) >= Number(inputValues?.bed);
      return developerMatch && typeMatch && minPriceMatch && maxPriceMatch && bedMatch;
    });

  };

  const submitFilter = () => {
    let isUpdatingFields = true;
    const _pathname = pathname.replace(/page-\d+/, `page-${1}`);
    // Preserve the sort parameter (defaulting if needed)
    const preservedSort = searchParams.sort || "launch_date_latest";
    
    // Merge the current input values with the preserved sort value.
    // (Make sure the key ("sort" in this example) matches what your URL function expects.)
    const filters = {
      ...inputValues,
      sortOrder: preservedSort,
      posthandover: isToggled
    };
  
    router.push(offplan_urlRename(_pathname, filters, "OFFPLAN", isUpdatingFields), { scroll: false });
  };

  // const resetFilter = () => {
  //   router.push('/offplan', {scroll: false})
  //   setInputValues({})
  //   setSelectedMinPrice(Number.MIN_SAFE_INTEGER)
  //   setSelectedMaxPrice(Number.MAX_SAFE_INTEGER)
  // }
  const resetFilter = () => {
    // Preserve the sort parameter if it exists
    const preservedSort = searchParams.sort ? `?sort=${searchParams.sort}` : `?sort=launch_date_latest`;
    router.push(`/offplan${preservedSort}`, { scroll: false });
    
    setInputValues({});
    setSelectedMinPrice(Number.MIN_SAFE_INTEGER);
    setSelectedMaxPrice(Number.MAX_SAFE_INTEGER);
  };
  
  function findPriceAndRest(prices, givenNumber) {
    let resultIndex = -1;
    for (let i = 0; i < prices.length; i++) {
      if (parseFloat(prices[i].value) <= givenNumber) {
        resultIndex = i;
      } else {
        break;
      }
    }
  
    if (resultIndex === -1) {
      return [];
    } else {
      return prices.slice(resultIndex);
    }
  }
  
  useEffect(() => {
    const getMinPriceOffplanProperty = async () => {
      const res = await fetchAPI('offplan/minPrice', 'noCache')
      setMinPriceStrapi(res.starting_price)
    }
    getMinPriceOffplanProperty()
  }, [])

  useEffect(() => {
    const getConfiguration = async () => {
      const res = await fetchAPI('configuration', 'noCache')
      set_aed_to_eur_exchange_rate(res?.data?.attributes?.aed_to_eur_exchange_rate)
      set_aed_to_usd_exchange_rate(res?.data?.attributes?.aed_to_usd_exchange_rate)
      set_aed_to_gbp_exchange_rate(res?.data?.attributes?.aed_to_gbp_exchange_rate)
      set_aed_to_inr_exchange_rate(res?.data?.attributes?.aed_to_inr_exchange_rate)
      set_aed_to_rub_exchange_rate(res?.data?.attributes?.aed_to_rub_exchange_rate)
    }
    getConfiguration()
  }, [])

  const currency = useSelector((state) => state.currency.value);

  return (
    <div id="searchForm" style={{...style}} dir={direction}>
      <div className="mainContainer">
        <div className={`formContainer ${isRTL ? 'ar' : ''}`}>
          <div className={`inputContainer ${isRTL ? 'ar' : ''}`}>
            <input className={`${isRTL ? 'ar' : ''}`} type="text" name="text" value={inputValues?.text || ""} placeholder={t('community_project_or_developer')} onChange={(item)=>handleUpdate(item)} />
            {searchDropDown&&searchSuggestions?.length>0 && (
              <div className="dropDown">
                <ul className="lists">
                {searchSuggestions?.map((item, index) => (
                  item?.value?.map((valueItem,secondIndex)=>(
                    <li
                    key={valueItem?.id}
                    onClick={() => {
                      handleChange("text", valueItem?.attributes?.project_name || valueItem?.attributes?.developer_name || valueItem?.attributes?.community_name);
                      setSearchDropDown(false);
                    }}
                  >
                    <span className="text">
                    {valueItem?.attributes?.project_name ||
                    (valueItem?.attributes?.developer_name 
                      ? `${valueItem.attributes.developer_name} (${t('developer')})` 
                      : `${valueItem.attributes.community_name} (${t('community')})`  )}
                    </span>
                  </li>
                  ))
                  
                ))}
                </ul>
              </div>
            )}
          </div>
          <div className="selectContainer">
            <div
              ref={dropDownRef}
              className={`field ${isRTL ? 'ar' : ''}`}
              onClick={(e) => dropDownHandler(e, "TYPE")}
            >
              <span className="text">{inputValues?.type ? t(inputValues?.type.toLowerCase()) : t('property_type')}</span>
              <span className="icon">
                <DropDownArrow />
              </span>
              <div className="dropDown">
                {activeDropDown === "TYPE" && (
                  <ul className="lists">
                    <li onClick={(e)=>dropDownSelecter(e,'Apartment','TYPE')}> 
                      <span>{t('apartment')}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,'Villa','TYPE')}> 
                      <span>{t('villa')}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,'Townhouse','TYPE')}> 
                      <span>{t('townhouse')}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,'Penthouse','TYPE')}> 
                      <span>{t('penthouse')}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,'Duplex','TYPE')}> 
                      <span>{t('duplex')}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,'Plot','TYPE')}> 
                      <span>{t('plot')}</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <div
            className={`field ${isRTL ? 'ar' : ''}`}
            onClick={(e) => dropDownHandler(e, "BED")}>
              <span className="text"> {
                inputValues?.bed ? 
                isRTL ? formatNumberToArabic(inputValues?.bed) : inputValues?.bed + (inputValues?.bed === 1 ? ` ${t('BED')}` :inputValues?.bed=== 7 ?`+ ${t('BEDS')}`: ` ${t('BEDS')}`):
                t("BEDS")}
              </span>
              <span className="icon">
                <DropDownArrow />
              </span>
              <div className="dropDown">
                {activeDropDown === "BED" && (
                  <ul className="lists">
                    <li onClick={(e)=>dropDownSelecter(e,1,'BED')}>
                      <span>{isRTL ? formatNumberToArabic(1): 1}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,2,'BED')}>
                      <span>{isRTL ? formatNumberToArabic(2): 2}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,3,'BED')}>
                      <span>{isRTL ? formatNumberToArabic(3): 3}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,4,'BED')}>
                      <span>{isRTL ? formatNumberToArabic(4): 4}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,5,'BED')}>
                      <span>{isRTL ? formatNumberToArabic(5): 5}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,6,'BED')}>
                      <span>{isRTL ? formatNumberToArabic(6): 6}</span>
                    </li>
                    <li onClick={(e)=>dropDownSelecter(e,7,'BED')}>
                      <span>{isRTL ? formatNumberToArabic(7): 7}+</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <div 
            className={`field ${isRTL ? 'ar' : ''}`}
             onClick={(e) => dropDownHandler(e, "MINPRICE")}>
              <span className="text">{inputValues?.minPrice ? `${
              isRTL ? 
              formatNumberToArabic(
                convertMyCurrency({currency, aed_to_eur_exchange_rate, aed_to_usd_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, value: inputValues?.minPrice})
                , true) 
              :
              numberFormat(
                convertMyCurrency({currency, aed_to_eur_exchange_rate, aed_to_usd_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, value: inputValues?.minPrice})
              ) 
              } ${t(currency.toLowerCase())}`
              : t('min_price')
              }</span>
              <span className="icon">
                <DropDownArrow />
              </span>
              {activeDropDown === "MINPRICE" && (
                <div className="dropDown">
                  <ul className="lists">
                   {
                    findPriceAndRest(price, minPriceStrapi).map((item)=> {
                      
                      const isSelectedSmallerThanMax = parseFloat(item.value) < parseFloat(selectedMaxPrice)
                      
                      return (
                        <li style={{
                          color: isSelectedSmallerThanMax ? '' : 'lightgray'}} 
                          key={item?.id} 
                          onClick={(e)=>{ isSelectedSmallerThanMax &&  minPriceHandleChange(item?.value,e)}}
                          >
                          {isRTL ? 
                          <span>{formatNumberToArabic(convertMyCurrency({value: item?.value, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, currency}), true)} {t(currency.toLowerCase())}</span>
                          :
                          <span>{numberFormat(convertMyCurrency({value: item?.value, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, currency}))} {currency}</span>
                          }
                        </li>
                      )
                    })
                   }
                  </ul>
                </div>
              )}
            </div>

            <div className={`field ${isRTL ? 'ar' : ''}`} onClick={(e) => dropDownHandler(e, "MAXPRICE")}>
              <span className="text">{inputValues?.maxPrice ? `${
              isRTL ? formatNumberToArabic(convertMyCurrency({currency, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, value: inputValues?.maxPrice})) 
              : numberFormat(convertMyCurrency({currency, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, value: inputValues?.maxPrice}))
              } ${t(currency.toLowerCase())}`: t('max_price')}</span>
              <span className="icon">
                <DropDownArrow />
              </span>
              {activeDropDown === "MAXPRICE" && (
                <div className="dropDown">
                  <ul className="lists">
                   {
                    findPriceAndRest(price, minPriceStrapi).map((item)=> {
                      const isSelectedBiggerThanMin = parseFloat(item.value) > parseFloat(selectedMinPrice)

                      return (
                        <li style={{
                          color: isSelectedBiggerThanMin ? '' : 'lightgray'}} 
                          key={item?.id} 
                          onClick={(e)=>{ isSelectedBiggerThanMin &&  maxPriceHandleChange(item?.value,e)}}>
                          {isRTL ? 
                          <span>{formatNumberToArabic(convertMyCurrency({value: item?.value, aed_to_gbp_exchange_rate, aed_to_eur_exchange_rate, aed_to_inr_exchange_rate, aed_to_usd_exchange_rate, aed_to_rub_exchange_rate, currency}), true)} {t(currency.toLowerCase())}</span>
                          :
                          <span>{numberFormat(convertMyCurrency({value: item?.value, aed_to_gbp_exchange_rate, aed_to_eur_exchange_rate, aed_to_usd_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate, currency}))} {currency}</span>
                          }
                        </li>
                      )
                    })
                   }
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`buttonContainer resetButton ${isRTL ? 'ar' : ''}`} >
          <button className="gradientBorder" onClick={resetFilter}>
            <span className="text">{t('reset')}</span>
          </button>
        </div>
        <div className="buttonContainer">
          <button className="gradientBorder" onClick={submitFilter}>
            <span className="text">{t('search')}</span>
          </button>
        </div>
      </div>
      <div className={`buttonContainer toggleContainer ${isRTL ? 'ar' : ''}`}>
        <span className="toggleLabel">{t("post_handover")}</span>
        <label className={`toggleSwitch ${isRTL ? 'ar' : ''}`}>
          <input
            type="checkbox"
            checked={isToggled}
            onChange={handleToggleChange}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default SearchForm;
