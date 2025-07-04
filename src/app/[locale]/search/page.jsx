import React from 'react'
import SearchForm from '../_components/SearchForm/SearchForm'
import SearchResults from './_components/SearchResults/SearchResults'
import { fetchSearchResults } from './service';
// import OffplanListingSpotlight from '../offplan/components/OffplanListingSpotlight/OffplanListingSpotlight';

const page = async ({searchParams}) => {
  const queryString = new URLSearchParams(searchParams).toString();
  const searchResults = await fetchSearchResults(queryString)

  return (
   <div id="searchPage">
    <div className="wrapper">
        <SearchForm searchResults={searchResults}/>
        <SearchResults searchResults={searchResults}/>
    </div>
   </div>
  )
}

export default page