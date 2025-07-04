import { fetchAPI } from "../_utils/utils";

export const getFeaturedOffplans = async (query) => {
  const queryParam = query?query:"page=1"
  const apiEndpoint = `offplan/featured?${queryParam}`;
  let response = await fetchAPI(apiEndpoint, "noCache");
  return response?.data;
};

export const getFeaturedCities = async (query) => {
  const queryParam = query?query:"page=1"
  const apiEndpoint = `communities/featured?${queryParam}`;
  let response = await fetchAPI(apiEndpoint, "noCache");
  return response;
};
 
  export const getMarketOveriview = async () => {
    const apiEndpoint = "overview";
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  };