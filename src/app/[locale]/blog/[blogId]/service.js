import { fetchAPI } from "@/app/[locale]/_utils/utils";

export const fetchBlog = async(id, locale) => {
    const apiEndpoint = `blog/single/${id}?locale=${locale}`;
    try{
        let response = await fetchAPI(apiEndpoint, "noCache");
        return response;
    }catch(err){
        return err.message
    }
}


export const fetchYouMayLikeBlogs = async({categorySlug, locale, pageSize}) => {
    const apiEndpoint = `blog/you-may-like/${categorySlug}?locale=${locale}&pageSize=${pageSize}`;
    try{
        let response = await fetchAPI(apiEndpoint, "noCache");
        return response;
    }catch(err){
        return err.message
    }
}