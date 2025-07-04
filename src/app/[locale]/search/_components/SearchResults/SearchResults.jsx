"use client";
import Pagination from "@/app/[locale]/_components/Pagination/Pagination";
import OffplanPropertyCard from "@/app/[locale]/_components/PropertyCard/OffplanPropertyCard";
import { getFilteredSearchResults } from "@/app/[locale]/redux/searchResultSlice/searchResultSlice";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSearchResults } from "../../service";
import Carousel from "@/app/[locale]/_components/NoData/Carousel";
import { useTranslations, useLocale } from 'next-intl';
import SortBy from "@/app/[locale]/offplan/[emirateParam]/_components/SortBy/SortBy";
import Banner from '@/app/[locale]/_components/Banner/Banner'

const SearchResults = ({ searchResults, showResults = true, searchParams }) => {

  const t = useTranslations('offplan');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr'; 

  const filteredDataRedux = useSelector(
    (state) => state?.searchResultFilter?.value
  );
  const [searchData, setSearchData] = useState();
  const [_searchData, _setSearchData] = useState(searchData);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(
      getFilteredSearchResults({
        searchResultFilter: searchResults,
      })
    );
  }, [searchResults]);

  useEffect(() => {
    setSearchData(filteredDataRedux);
    setLoading(false);
  }, [filteredDataRedux]);

  useEffect(() => {
    const fetchAllData = async () => {
      const searchResults = await fetchSearchResults('page=1');
      _setSearchData(searchResults);
    }
    fetchAllData();
  }, []);

  const renderPropertiesWithBanner = () => {
    const elements = []
    searchData.data.forEach((item, index) => {
      // Render the property card
      elements.push(
        <div className={`item ${isRTL ? 'ar': ''}`} key={item?.id}>
          <OffplanPropertyCard data={item} configuration={searchResults?.configuration} />
        </div>
      )
      // After every 3 items (except if it is the last group), insert the special element
      if ((index + 1) % 3 === 0 && index !== searchData.data.length - 1) {
        elements.push(<Banner type={'MPU'} key={`banner-${index}`} />)
      }
    })
    return elements
  }

  return (
    <div className="searchResults" id="searchResults" dir={direction}>
      {showResults && (
        <div className="mainHeadingDiv">
          <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t('results')}</h2>
          <SortBy searchParams={searchParams} />
        </div>
      )}
      <div className="mainContainer">
        <div className="leftContainer">
          {searchData?.data?.length ? (
            <div className="listings">
              <Banner type={'HP'} />
              {/* {searchData?.data?.map((item) => (
                <div className={`item ${isRTL ? 'ar': ''}`} key={item?.id}>
                  <OffplanPropertyCard data={item} configuration={searchResults?.configuration} />
                </div>
              ))} */}
              {renderPropertiesWithBanner()}
            </div>
          ) : (
            !loading && (
              <div className='noData'>
                <img className="noDataImg" src='/noData.svg' alt="No Data" />
                <h3 className='we_could_not_find_match'>{t('we_couldn_t_find_a_perfect_match')}</h3>
                <h3 className='similar_interests'>{t("but_these_units_might_interest_you")}</h3>
                {_searchData?.data?.length && <Carousel data={_searchData} Card={OffplanPropertyCard} />}
              </div>
            )
          )}
        </div>
      </div>
      {searchData?.meta?.pagination?.pageCount > 1 && (
        <Pagination pageDetails={searchData?.meta?.pagination} searchParams={searchParams} />
      )}
    </div>
  );
};

export default SearchResults;