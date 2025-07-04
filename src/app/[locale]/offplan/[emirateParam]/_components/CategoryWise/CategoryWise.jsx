import OffplanListingSpotlight from '@/app/[locale]/offplan/_components/OffplanListingSpotlight/OffplanListingSpotlight';
import SearchForm from '@/app/[locale]/_components/SearchForm/SearchForm';
import SearchResults from '@/app/[locale]/search/_components/SearchResults/SearchResults';
import { fetchSearchResults } from '@/app/[locale]/search/service';
import { offplan_queryGeneratorAndWordChecker } from '@/app/[locale]/_utils/utils';
import React from 'react'

const CategoryWise = async ({ params, searchParams }) => {
  const { locale } = params;
  
  const query = offplan_queryGeneratorAndWordChecker(params, searchParams)
  const searchResults = await fetchSearchResults(query?.query + `&locale=${locale}`)

  return (
    <div id="categoryWise">
      <OffplanListingSpotlight/>
      <div className="wrapper">
          <SearchForm searchResults={searchResults} params={params} searchParams={searchParams} />
          <SearchResults searchResults={searchResults} searchParams={searchParams} />
      </div>
    </div>
  )
}

export default CategoryWise;