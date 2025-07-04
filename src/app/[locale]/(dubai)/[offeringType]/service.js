import { fetchAPI } from "../../_utils/utils";

export const fetchBuyCommercialMeta = async (locale) => {
  const apiEndpoint = `buyCommercial/meta?locale=${locale}`;
  try{
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response
  } catch(err){
    return err.message
  }
};

export const fetchBuyResidentialMeta = async (locale) => {
  const apiEndpoint = `buyResidential/meta?locale=${locale}`;
  try{
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response
  } catch(err){
    return err.message
  }
};

export const fetchRentCommercialMeta = async (locale) => {
  const apiEndpoint = `rentCommercial/meta?locale=${locale}`;
  try{
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response
  } catch(err){
    return err.message
  }
};

export const fetchRentResidentialMeta = async (locale) => {
  const apiEndpoint = `rentResidential/meta?locale=${locale}`;
  try{
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response
  } catch(err){
    return err.message
  }
};

export const fetchMinMaxPrices = async ({offeringType, categoryName}) => {
  let apiEndpoint = `secondary/minMaxPrice`;
  apiEndpoint += `?categoryName=${categoryName}&offeringType=${offeringType}`

  try{
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response
  } catch(err){
    return err.message
  }
};

export const fetchMinMaxAreas = async ({offeringType, categoryName}) => {
  let apiEndpoint = `secondary/minMaxArea`;
  apiEndpoint += `?categoryName=${categoryName}&offeringType=${offeringType}`

  try{
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response
  } catch(err){
    return err.message
  }
};

export const fetchSecondaryProperties = async (query) => {
  const apiEndpoint = `search/?${query}`;
  try {
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  } catch (err) {
    return err.message;
  }
};


export const fetchSecondaryPropertySearchSuggestion = async (query) => {
  const apiEndpoint = `search/suggestion?${query}`;
  try {
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  } catch (err) {
    return err.message;
  }
};

export const fetchCommunity = async (communitySlug, locale) => {
  const apiEndpoint = `communities/single/${communitySlug}?locale=${locale}`;
  try {
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  } catch (err) {
    return err.message;
  }
};