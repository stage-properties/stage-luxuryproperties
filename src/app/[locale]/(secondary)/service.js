import { fetchAPI } from "../_utils/utils";

export const fetchSingleSecondaryProperty = async (slug) => {
  const apiEndpoint = `secondary/single/${slug}`;
  try {
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  } catch (err) {
    return err.message;
  }
};