import { fetchAPI } from "@/app/[locale]/_utils/utils";

export const getTeamData = async (query) => {
  const queries = query?query:"page=1"
  const apiEndpoint = `team/list?${queries}`;
  let response = await fetchAPI(apiEndpoint, "noCache");
  return response;
};
 