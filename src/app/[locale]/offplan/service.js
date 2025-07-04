import { fetchAPI } from "@/app/[locale]/_utils/utils";

export const fetchPageInfo = async () => {
  const apiEndpoint = "pageOffplan";
  try {
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  } catch (err) {
    return err.message;
  }
};
