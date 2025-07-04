import { fetchAPI } from "../_utils/utils";

export const fetchBlogs = async (query) => {
  const apiEndpoint = `blog/list?${query}`;
  try {
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  } catch (err) {
    return err.message;
  }
};

export const fetchPageInfo = async (query) => {
  const apiEndpoint = `pageBlogs?${query}`;
  try {
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  } catch (err) {
    return err.message;
  }
};
