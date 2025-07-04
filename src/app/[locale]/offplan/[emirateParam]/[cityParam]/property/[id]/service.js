import { fetchAPI } from "@/app/[locale]/_utils/utils";

export const fetchOffplanData = async(id, locale) => {
    const apiEndpoint = `offplan/single/${id}?locale=${locale}`;
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response?.data;
}

export const fetchCurrectExchangeRate = async (currencyFrom,currencyTo) => {
    const res = await fetch(`https://api.polygon.io/v1/conversion/${currencyFrom}/${currencyTo}?amount=100&precision=2&apiKey=0O0RU6OH58bvZFtNrGWSIMoIeFjjmXdP`)
    const exchangeRate = await res.json()
    return exchangeRate
}