import { fetchAPI } from "../_utils/utils";

export const getTeamData = async (type,page,count) => {
  const apiEndpoint = `team/list?type=${type}&${page}&count=${count || 7}`;
  let response = await fetchAPI(apiEndpoint, "noCache");
  return response;
};

export const getRandomAgentImage = async () => {
  const apiEndpoint = 'team/randomAgentImage'
  let response = await fetchAPI(apiEndpoint, 'noCache')
  return response
}

export const getTeamDataImages = async () => {
  const apiEndpoint = `team/list/images`;
  let response = await fetchAPI(apiEndpoint, "cache");
  return response;
};

export const fetchBlogs = async (locale, sort) => {
    const apiEndpoint = `blog/list?page=1&locale=${locale}&sort=${sort}`;
    try {
      let response = await fetchAPI(apiEndpoint, "noCache");
      return response?.data;
    } catch (err) {
      return err.message;
    }
  };
  