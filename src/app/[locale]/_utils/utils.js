const moment = require("moment");
import 'moment/locale/ar';
import "moment-timezone";

/**
 * Standard Mortgage Payment Calculation
 * @param {number} propertyPrice 
 * @param {number} annualInterestRate - in percentage, e.g. 3.75 for 3.75%
 * @param {number} loanLengthYears 
 * @param {number} downPayment 
 * @returns {number} monthlyPayment
 */
export function calculateMortgage(propertyPrice, annualInterestRate, loanLengthYears, downPayment) {
  const principal = propertyPrice - downPayment; 
  // Convert annual percentage rate to a monthly decimal rate
  const monthlyInterestRate = (annualInterestRate / 100) / 12;
  const numberOfPayments = loanLengthYears * 12;
  
  // If interest rate is 0 (edge case), avoid division by zero
  if (monthlyInterestRate === 0) {
    return principal / numberOfPayments;
  }
  
  // Standard mortgage formula
  const monthlyPayment =
    principal *
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
  return monthlyPayment;
}

/**
 * Calculate total amount paid over the life of the loan
 * @param {number} propertyPrice 
 * @param {number} annualInterestRate - in percentage
 * @param {number} loanLengthYears 
 * @param {number} downPayment 
 * @returns {number} totalPaidOverLife
 */
export function calculateTotalLoanAmount(propertyPrice, annualInterestRate, loanLengthYears, downPayment) {
  const monthly = calculateMortgage(propertyPrice, annualInterestRate, loanLengthYears, downPayment);
  const numberOfPayments = loanLengthYears * 12;
  return monthly * numberOfPayments;
}

/**
 * Calculate principal borrowed (without interest):
 */
export function calculatePrincipalAmount(propertyPrice, downPayment) {
  return propertyPrice - downPayment;
}

export const convertMyCurrency = ({value, currency, aed_to_usd_exchange_rate, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate}) => {
  if(currency === 'USD') return value * aed_to_usd_exchange_rate
  else if(currency === 'EUR') return value * aed_to_eur_exchange_rate
  else if(currency === 'GBP') return value * aed_to_gbp_exchange_rate
  else if(currency === 'INR') return value * aed_to_inr_exchange_rate
  else if(currency === 'RUB') return value * aed_to_rub_exchange_rate
  else return value
}

export const convertMyCurrencyReturnRate = ({value, currency, aed_to_usd_exchange_rate, aed_to_eur_exchange_rate, aed_to_gbp_exchange_rate, aed_to_inr_exchange_rate, aed_to_rub_exchange_rate}) => {
  if(currency === 'USD') return {value: value * aed_to_usd_exchange_rate, rate: aed_to_usd_exchange_rate}
  else if(currency === 'EUR') return {value: value * aed_to_eur_exchange_rate, rate: aed_to_eur_exchange_rate}
  else if(currency === 'GBP') return {value: value * aed_to_gbp_exchange_rate, rate: aed_to_gbp_exchange_rate}
  else if(currency === 'INR') return {value: value * aed_to_inr_exchange_rate, rate: aed_to_inr_exchange_rate}
  else if(currency === 'RUB') return {value: value * aed_to_rub_exchange_rate, rate: aed_to_rub_exchange_rate}
  else return {value, rate: 1}
}

export function formatNumberToArabic(number, grouping = false) {
  return new Intl.NumberFormat('ar-EG', {
    useGrouping: grouping, // Disable thousands separators if not needed
    // You can add more options here if necessary
  }).format(number);
}

export const fetchAPI = async (endpoint, cacheType) => {
  let customConfig = filterHeader(cacheType);
  try {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      customConfig
    );
    let data = await res.json();
    return data;
  } catch (err) {
    return err.message;
  }
};

const filterHeader = (type) => {
  let customConfig;
  if (type === "cache") {
    customConfig = {
      headers: {
        "Content-Type": "application/json",
        d_acp: "true",
        dev_id: "true",
      },
      cache: "force-cache",
    };
  } else if (type === "noCache") {
    customConfig = {
      headers: {
        "Content-Type": "application/json",
        d_acp: "true",
        dev_id: "true",
      },
      cache: "no-store",
    };
  } else if (type === "revalidate") {
    customConfig = {
      headers: {
        "Content-Type": "application/json",
        d_acp: "true",
        dev_id: "true",
      },
      next: { revalidate: 60 },
    };
  }

  return customConfig;
};

export function toPascalCase(str) {
  return str
    ?.toLowerCase() // Convert to lowercase
    ?.split(" ") // Split by spaces
    ?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)) // Capitalize first letter
    ?.join(""); // Join words without spaces
}

export const convertPrice = (price, isArabic = false) => {
  if (isNaN(price)) {
    return isArabic ? "إدخال غير صالح" : "Invalid input";
  }

  // Return the price as is if it's less than a million
  if (price < 1_000_000) {
    return isArabic ? formatNumberToArabic(price, true) : numberFormat(price);
  }

  // Define the units and their corresponding labels
  const units = isArabic ? ["", "ألف", "مليون", "مليار", "تريليون"] : ["", "K", "M", "B", "T"];

  // Iterate through the units
  let unitIndex = 1; // Start with Thousand
  while (price >= 1000 && unitIndex < units.length) {
    price /= 1000;
    unitIndex++;
  }

  // Round to two decimal places
  const formattedPrice = Math.round(price * 100) / 100;

  // Add the unit label
  const result = `${isArabic ? formatNumberToArabic(formattedPrice) : formattedPrice}${units[unitIndex - 1]}`;

  return result;
};

export const convertToDate = (date, locale = 'en') => {
  return moment(date).locale(locale).format('MMMM YYYY');
};

export const numberFormat = (num) => {
  return new Intl.NumberFormat().format(num);
};

export const convertCurrency = (
  amountAED,
  exchangeRateUSD,
  exchangeRateEUR
) => {
  // Check if the input is a valid number
  if (isNaN(amountAED) || isNaN(exchangeRateUSD) || isNaN(exchangeRateEUR)) {
    return "Invalid input. Please provide valid numbers.";
  }

  // Perform the currency conversion
  const amountUSD = amountAED * exchangeRateUSD;
  const amountEUR = amountAED * exchangeRateEUR;

  // Return the converted amounts
  return {
    USD: amountUSD.toFixed(2), // Rounded to 2 decimal places
    EUR: amountEUR.toFixed(2),
  };
};

export const convertToLocalTime = (timestamp) => {
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = moment(timestamp).tz(currentTimeZone);
  const formattedDate = time.format("MMM Do, YYYY");
  return formattedDate;
};

export function capitalizeFirstLetters(str) {
  return str
    .split(' ') // Split the string into an array of words based on spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(' '); // Join the words back into a string
}


export const offplan_queryGeneratorAndWordChecker = (params, searchParams) => {

  let query = "";
  let hasPage = false;
  let valuesForInput = {}

  const minPrice = searchParams.minPrice
  const maxPrice = searchParams.maxPrice

  const propertyType = searchParams.propertyType

  const bedrooms = searchParams.bedrooms
  const keywords = searchParams.keywords
  const sort = searchParams.sort
  const posthandover = searchParams.posthandover

  if(sort) {
    query += query != "searchType=offplan&"  ? '&' : ''
    query += `sort=${sort}`;
    valuesForInput = { ...valuesForInput, sort: sort}
  }
  if(posthandover) {
    query += query != "searchType=offplan&"  ? '&' : ''
    query += `posthandover=${posthandover}`;
    valuesForInput = { ...valuesForInput, posthandover: posthandover}
  }

  // Handle query parameters directly
  if (keywords) {
    query += query !== "" ? "&" : "";

    let value = "";
    let valueSplitted = keywords.split("-"); // Split keywords directly
  
    for (let i = 0; i < valueSplitted.length; i++) {
      value += valueSplitted[i];
      if (i + 1 !== valueSplitted.length) {
        value += " ";
      }
    }
  
    query += `text=${encodeURIComponent(value)}`;
    valuesForInput = { ...valuesForInput, text: capitalizeFirstLetters(value) };
  }

  if(propertyType) {
    query += query != ""  ? '&' : ''
    query += `type=${propertyType}`;
    valuesForInput = { ...valuesForInput, type: propertyType}
  }

  if(bedrooms) {
    query += query != ""  ? '&' : ''
    query += `bed=${bedrooms}`;
    valuesForInput = { ...valuesForInput, bed: bedrooms}
  }

  if (minPrice) {
    query += query != ""  ? '&' : ''
    query += `minPrice=${minPrice}`;
    valuesForInput = { ...valuesForInput, minPrice: minPrice };
  }

  if (maxPrice) {
    query += query != ""  ? '&' : ''
    query += `maxPrice=${maxPrice}`;
    valuesForInput = { ...valuesForInput, maxPrice: maxPrice };
  }

  for (let x in params) {
    let str = params[x];

    if (str.indexOf("areas") !== -1) {
      if (query != "") {
        query += "&";
      }
      let decodedURI = decodeURIComponent(str);
      let correctFormat = decodedURI.replace(/&/g, "_");
      let valueSplitted = correctFormat?.split("-");
      let index = valueSplitted.indexOf("areas") + 1;
      let value = "";
      for (let i = index; i < valueSplitted?.length; i++) {
        value += valueSplitted[i];
        if (i + 1 !== valueSplitted?.length) {
          value += " ";
        }
      }

      query += `text=${encodeURIComponent(value)}`;
      valuesForInput = {...valuesForInput,text:value}

    }
    else if (str.indexOf("residential") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str;
      query += `category=${value}`;
    } 
    else if (str.indexOf("commercial") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str;
      query += `category=${value}`;
    } 
    else if (str.indexOf("page") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[1];
      query += `page=${value}`;
      hasPage = true; // Set the flag to true
    } 
  }
  // If "page" parameter doesn't exist, add default value
  if (!hasPage) {
    if (query != "") {
      query += "&";
    }
    query += "page=1";
  }
  return {query,valuesForInput};
};

export const queryGeneratorAndWordChecker = (params) => {
  let query = "";
  let hasPage = false;
  let valuesForInput = {}
  for (let x in params) {
    let str = params[x];

    if (str.indexOf("bedrooms") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[0];
      query += `bed=${value}`;
      valuesForInput = {...valuesForInput,bed:value}
    } else if (str.indexOf("min") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[0];
      query += `minPrice=${value}`;
      valuesForInput = {...valuesForInput,minPrice:value}

    } else if (str.indexOf("max") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[0];
      query += `maxPrice=${value}`;
      valuesForInput = {...valuesForInput,maxPrice:value}

    } else if (str.indexOf("areas") !== -1) {
      if (query != "") {
        query += "&";
      }
      let decodedURI = decodeURIComponent(str);
      let correctFormat = decodedURI.replace(/&/g, "_");
      let valueSplitted = correctFormat?.split("-");
      let index = valueSplitted.indexOf("areas") + 1;
      let value = "";
      for (let i = index; i < valueSplitted?.length; i++) {
        value += valueSplitted[i];
        if (i + 1 !== valueSplitted?.length) {
          value += " ";
        }
      }

      query += `text=${encodeURIComponent(value)}`;
      valuesForInput = {...valuesForInput,text:value}

    } else if (str.indexOf("keywords") !== -1) {
      if (query != "") {
        query += "&";
      }
      let valueSplitted = str?.split("-");
      let value = "";
      let index = valueSplitted.indexOf("keywords") + 1;
      for (let i = index; i < valueSplitted?.length; i++) {
        value += valueSplitted[i];
        if (i + 1 !== valueSplitted?.length) {
          value += " ";
        }
      }

      query += `text=${encodeURIComponent(value)}`;
      valuesForInput = {...valuesForInput,text:value}

    } else if (str.indexOf("residential") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str;
      query += `category=${value}`;
    } else if (str.indexOf("commercial") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str;
      query += `category=${value}`;
    } else if (str.indexOf("page") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[1];
      query += `page=${value}`;
      hasPage = true; // Set the flag to true
    } else if (str.indexOf("propertyType") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[1];
      query += `type=${value}`;
      valuesForInput = {...valuesForInput,type:value}

    }
  }
  // If "page" parameter doesn't exist, add default value
  if (!hasPage) {
    if (query != "") {
      query += "&";
    }
    query += "page=1";
  }
  return {query,valuesForInput};
};

export const secondaryQueryGeneratorAndWordChecker = (params) => {
  let query = "searchType=scndry&";
  let hasPage = false;
  let valuesForInput = {}
  const regexBeforeFor = /(.*)\sfor/
  for (let x in params) {
    let str = params[x];
    if (str.indexOf("bedroom") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[0];
      query += `br=${value}`;
      valuesForInput = {...valuesForInput,bedroom:value}
    } else if (str.indexOf("min") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[0];
      query += `mnp=${value}`;
      valuesForInput = {...valuesForInput,minPrice:value}

    } else if (str.indexOf("max") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[0];
      query += `mxp=${value}`;
      valuesForInput = {...valuesForInput,maxPrice:value}
    } else if (str.indexOf("areas") !== -1) {
      if (query != "") {
        query += "&";
      }
      let decodedURI = decodeURIComponent(str);
      let correctFormat = decodedURI.replace(/&/g, "_");
      let valueSplitted = correctFormat?.split("-");
      let index = valueSplitted.indexOf("areas") + 1;
      let value = "";
      for (let i = index; i < valueSplitted?.length; i++) {
        value += valueSplitted[i];
        if (i + 1 !== valueSplitted?.length) {
          value += " ";
        }
      }

      query += `txt=${encodeURIComponent(value)}`;
      valuesForInput = {...valuesForInput,keywords:value}

    } else if (str.indexOf("keywords") !== -1) {
      if (query != "") {
        query += "&";
      }
      let valueSplitted = str?.split("-");
      let value = "";
      let index = valueSplitted.indexOf("keywords") + 1;
      for (let i = index; i < valueSplitted?.length; i++) {
        value += valueSplitted[i];
        if (i + 1 !== valueSplitted?.length) {
          value += " ";
        }
      }

      query += `txt=${encodeURIComponent(value)}`;
      valuesForInput = {...valuesForInput,keywords:value}

    } else if (str==="residential") {
      if (query != "") {
        query += "&";
      }
      let value = str;
      query += `ctg=${value}`;
    } else if (str==="commercial") {
      if (query != "") {
        query += "&";
      }
      let value = str;
      query += `ctg=${value}`;
    } else if (str.indexOf("page") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[1];
      query += `pg=${value}`;
      hasPage = true; // Set the flag to true
    } else if (str.indexOf("propertyType") !== -1) {
      if (query != "") {
        query += "&";
      }
      let value = str?.split("-")[1];
      query += `type=${value}`;
    }else if(str.indexOf("-for-") !== -1){
      if (query != "") {
        query += "&";
      }
      let valueSplitted = str?.split("-");
      let index = valueSplitted.indexOf("for");
      let value = ""
      for(let i=0 ;i<index;i++){
        value += valueSplitted[i];
        if (i + 1 !== index) {
          value += " ";
        }
      }
      if(value !== "properties"){
        query += `pt=${encodeURIComponent(value)}`;
      valuesForInput = {...valuesForInput,property_type:value}

      }
    }else if(str.indexOf("status") !== -1){
      if (query != "") {
        query += "&";
      }
      let valueSplitted = str?.split("-");

      let index = valueSplitted.indexOf("status");
      let value = ""
      for(let i=index+1 ;i<valueSplitted?.length;i++){
        value += valueSplitted[i];
      }
      if(value === "offplan"){
        valuesForInput = {...valuesForInput,status:"Off-Plan"}

      query += `cs=off_plan`;
      }else if(value === "ready"){
        query += `cs=ready`;
        valuesForInput = {...valuesForInput,status:value}
      }else{
        valuesForInput = {...valuesForInput,status:value}
      }

    } 
    else if(str == "rent"){
      if (query != "") {
        query += "&";
      }
      query += `offer=${str}`
      valuesForInput = {...valuesForInput,offer:str}
    }else if(str == "buy"){
      if (query != "") {
        query += "&";
      }

      query += `offer=sale`
      valuesForInput = {...valuesForInput,offer:str}

    }
  }
  // If "page" parameter doesn't exist, add default value
  if (!hasPage) {
    if (query != "") {
      query += "&";
    }
    query += "pg=1";
  }
  return {query,valuesForInput};
};

export const secondary_secondaryQueryGeneratorAndWordChecker = (params, searchParams) => {
  let query = "searchType=scndry&";
  let hasPage = false;
  let valuesForInput = {}
  const regexBeforeFor = /(.*)\sfor/
  const status = searchParams.status
  const keywords = params['param-3']
  const bedroom = searchParams.bedroom
  const minPrice = searchParams.minPrice
  const maxPrice = searchParams.maxPrice
  const minArea = searchParams.minArea
  const maxArea = searchParams.maxArea
  const propertyType = searchParams.propertyType
  const sort = searchParams.sort

  if(status){
    query += query !== "searchType=scndry&" ? "&" : "";

    if(status === "off-plan"){
      valuesForInput = {...valuesForInput,status:"Off-Plan"}

    query += `cs=off_plan`;
    }else if(status === "ready"){
      query += `cs=ready`;
      valuesForInput = {...valuesForInput,status:status}
    }else{
      valuesForInput = {...valuesForInput,status:status}
    }
  } 

  if(sort) {
    query += query != "searchType=scndry&"  ? '&' : ''
    query += `sort=${sort}`;
    valuesForInput = { ...valuesForInput, sort: sort}
  }

  if (keywords && !keywords.includes('page-')) {
    if (query != "searchType=scndry&") {
      query += "&";
    }
    let valueSplitted = keywords.split("-").slice(1);
    let value = "";
    
    for (let i = 0; i < valueSplitted?.length; i++) {
      value += valueSplitted[i];
      if (i + 1 !== valueSplitted?.length) {
        value += " ";
      }
    }
    query += `txt=${encodeURIComponent(value)}`;
    valuesForInput = {...valuesForInput,keywords:value}
  }
  if(bedroom) {
    query += query != "searchType=scndry&"  ? '&' : ''
    query += `br=${bedroom}`;
    valuesForInput = { ...valuesForInput, bedroom: bedroom}
  }

  if(propertyType) {
    query += query != "searchType=scndry&"  ? '&' : ''
    
    if(propertyType !== 'any') query += `pt=${propertyType}`;
    
    valuesForInput = { ...valuesForInput, property_type: propertyType}
  }

  if (minPrice) {
    query += query != "searchType=scndry&"  ? '&' : ''
    query += `mnp=${minPrice}`;
    valuesForInput = { ...valuesForInput, minPrice: minPrice };
  }

  if (maxPrice) {
    query += query != "searchType=scndry&"  ? '&' : ''
    query += `mxp=${maxPrice}`;
    valuesForInput = { ...valuesForInput, maxPrice: maxPrice };
  }

  if (minArea) {
    query += query != "searchType=scndry&"  ? '&' : ''
    query += `minArea=${minArea}`;
    valuesForInput = { ...valuesForInput, minArea: minArea };
  }

  if (maxArea) {
    query += query != "searchType=scndry&"  ? '&' : ''
    query += `maxArea=${maxArea}`;
    valuesForInput = { ...valuesForInput, maxArea: maxArea };
  }

  for (let x in params) {
    let str = params[x];
    if (str.indexOf("areas") !== -1) {
      if (query != "searchType=scndry&") {
        query += "&";
      }
      let decodedURI = decodeURIComponent(str);
      let correctFormat = decodedURI.replace(/&/g, "_");
      let valueSplitted = correctFormat?.split("-");
      let index = valueSplitted.indexOf("areas") + 1;
      let value = "";
      for (let i = index; i < valueSplitted?.length; i++) {
        value += valueSplitted[i];
        if (i + 1 !== valueSplitted?.length) {
          value += " ";
        }
      }

      query += `txt=${encodeURIComponent(value)}`;
      valuesForInput = {...valuesForInput,keywords:value}

    }
    else if (str==="residential") {
      if (query != "searchType=scndry&") {
        query += "&";
      }
      let value = str;
      query += `ctg=${value}`;
    } 
    else if (str==="commercial") {
      if (query != "searchType=scndry&") {
        query += "&";
      }
      let value = str;
      query += `ctg=${value}`;
    } 
    else if (str.indexOf("page") !== -1) {
      if (query != "searchType=scndry&") {
        query += "&";
      }
      let value = str?.split("-")[1];
      query += `pg=${value}`;
      hasPage = true; // Set the flag to true
    }
    else if(str.indexOf("-for-") !== -1){
      if (query != "searchType=scndry&") {
        query += "&";
      }
      let valueSplitted = str?.split("-");
      let index = valueSplitted.indexOf("for");
      let value = ""
      for(let i=0 ;i<index;i++){
        value += valueSplitted[i];
        if (i + 1 !== index) {
          value += " ";
        }
      }
      if(value !== "properties"){
        query += `pt=${encodeURIComponent(value)}`;
      valuesForInput = {...valuesForInput,property_type:value}

      }
    }
    else if(str == "rent"){
      if (query != "searchType=scndry&") {
        query += "&";
      }
      query += `offer=${str}`
      valuesForInput = {...valuesForInput,offer:str}
    }else if(str == "buy"){
      if (query != "searchType=scndry&") {
        query += "&";
      }

      query += `offer=sale`
      valuesForInput = {...valuesForInput,offer:str}

    }
  }

  // If "page" parameter doesn't exist, add default value
  if (!hasPage) {
    if (query != "searchType=scndry&") {
      query += "&";
    }
    query += "pg=1";
  }
  return {query,valuesForInput};
};

const getValuesBeforeAsString = (array, element, stopWords) => {
  const index = array.indexOf(element);

  if (index === -1) {
    // Element not found in the array
    return "";
  }

  const valuesBefore = [];
  for (let i = index - 1; i >= 0; i--) {
    const word = array[i];

    // Check if the word is in the stopWords array
    if (stopWords.includes(word.toLowerCase())) {
      // Stop if a stop word is encountered
      break;
    }

    // Capitalize the first letter of each word
    valuesBefore.unshift(word.charAt(0).toUpperCase() + word.slice(1));
  }

  return valuesBefore.join(" ");
};

export const urlRename = (currentURL, values,type,isUpdatingFields) => {
  // Use regular expressions to find and replace the dynamic parts
  let regexInKeywords = /\/in-keywords-([^/]+)/;
  let regexMinValue = /\/(\d+)-aed-min/;
  let regexBedrooms = /\/(\d+)-bedrooms-or-more/;
  let regexAreas = /\/in-areas-([^/]+)/;
  let regexAedMax = /\/(\d+)-aed-max/;
  let regexPropertyType = /\/propertyType-([^/]+)/;
  let regexCommunity = /\/community/;
  let regexBuy= /\/buy/;
  let regexRent= /\/rent/;
  let regexBedroomCount = /\/(\d+)-bedroom/;
  let updatedURL = "";
  let regexForSecondaryPropertyType = /\/([^/]+)-for-([^/]+)/;
  let regexStatus = /\/status-([^/]+)/;
  updatedURL = currentURL;
  if(type!="SECONDARY"){
    if(!updatedURL.includes("community")){
      if(!updatedURL.includes("residential")){
        updatedURL += "/properties/residential/sales"
      }
    }
  }
  
  
  // If the "in-keywords-" pattern is found in the URL, replace it with the new value
  if (values?.text) {
    let replacedValue = values?.text?.replace(/ /g, "-")?.toLowerCase();
    updatedURL = updatedURL.replace(regexAreas, (match, group) => {
      return `/in-keywords-${replacedValue}`;
    });
    updatedURL = updatedURL.replace(regexInKeywords, (match, group) => {
      return `/in-keywords-${replacedValue}`;
    });
    if (!updatedURL.includes("in-keywords")) {
      updatedURL += `/in-keywords-${replacedValue}`;
    }
  }else{
    updatedURL = updatedURL.replace(regexInKeywords, (match, group) => {
      return "";
    });
  }

  if (values?.status) {
    let replacedValue = values?.status?.replace(/ /g, "-")?.toLowerCase();
    updatedURL = updatedURL.replace(regexStatus, (match, group) => {
      return `/status-${replacedValue}`;
    });
    if (!updatedURL.includes("status")) {
      updatedURL += `/status-${replacedValue}`;
    }
  }

  if (values?.property_type) {
    let findoffering = findOfferingType(updatedURL)
      let offeringType = ""
      if(findoffering === "BY"){
        offeringType = "sale"
      }else{
        offeringType = "rent"

      }
    if(values?.property_type === "any"){
      
    updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
      return `/properties-for-${offeringType}`;
    });
    if (!updatedURL.includes("for")) {
      updatedURL += `/properties-for-${offeringType}`;
    }
    }else{
      let replacedValue = values?.property_type?.replace(/ /g, "-")?.toLowerCase();
      updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
        return `/${replacedValue}-for-${offeringType}`;
      });
      if (!updatedURL.includes("for")) {
        updatedURL += `/${replacedValue}-for-${offeringType}`;
      }
    }
    
  }

  if (values?.offer) {
    let findoffering = findOfferingType(updatedURL)
      let offeringType = ""
      offeringType = values?.offer === "buy" ? "sale" :"rent"

      if(findoffering === "BY"){
        updatedURL = updatedURL.replace(regexBuy, `/${values?.offer}`);
      }else{
        updatedURL = updatedURL.replace(regexRent, `/${values?.offer}`);
      }
    if(values?.property_type === "any" || !values?.property_type){
      
    updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
      return `/properties-for-${offeringType}`;
    });
    // if (!updatedURL.includes("for")) {
    //   updatedURL += `/properties-for-${offeringType}`;
    // }
    }else{
      let replacedValue = values?.property_type?.replace(/ /g, "-")?.toLowerCase();
      updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
        return `/${replacedValue}-for-${offeringType}`;
      });
      if (!updatedURL.includes("for")) {
        updatedURL += `/${replacedValue}-for-${offeringType}`;
      }
    }
    
  }

  // If the "300000-aed-min" pattern is found in the URL, replace it with the new value
  if (values?.minPrice) {
    updatedURL = updatedURL.replace(regexMinValue, (match, group) => {
      return `/${values?.minPrice}-aed-min`;
    });
    if (!currentURL.includes("-aed-min")) {
      updatedURL += `/${values?.minPrice}-aed-min`;
    }
  }

  if (values?.bed) {
    updatedURL = updatedURL.replace(regexBedrooms, (match, group) => {
      return `/${values?.bed}-bedrooms-or-more`;
    });
    if (!currentURL.includes("-bedrooms-or-more")) {
      updatedURL += `/${values?.bed}-bedrooms-or-more`;
    }
  }

  if (values?.bedroom) {
    updatedURL = updatedURL.replace(regexBedroomCount, (match, group) => {
      return `/${values?.bedroom}-bedroom`;
    });
    if (!currentURL.includes("-bedroom")) {
      updatedURL += `/${values?.bedroom}-bedroom`;
    }
  }


  updatedURL = updatedURL.replace(regexCommunity, "/residential");

  if (values?.maxPrice) {
    updatedURL = updatedURL.replace(regexAedMax, (match, group) => {
      return `/${values?.maxPrice}-aed-max`;
    });
    if (!currentURL.includes("-aed-max")) {
      updatedURL += `/${values?.maxPrice}-aed-max`;
    }
  }
  if (values?.type) {
    updatedURL = updatedURL.replace(regexPropertyType, (match, group) => {
      return `/propertyType-${values?.type.toLowerCase()}`;
    });
    if (!currentURL.includes("propertyType")) {
      updatedURL += `/propertyType-${values?.type.toLowerCase()}`;
    }
  }

  
  let newURl = removePageNumberFromURL(updatedURL)
  if(newURl?.modifiedURL && newURl?.pageNumber){
      if(isUpdatingFields){
        updatedURL = newURl?.modifiedURL
      }else{
      updatedURL = newURl?.modifiedURL + `/${newURl?.pageNumber}`

      }
  }
 
  return updatedURL ? updatedURL : false;
};

export const secondary_urlRename = (currentURL, values,type,isUpdatingFields) => {
  // Use regular expressions to find and replace the dynamic parts
  let regexInKeywords = /\/in-([^/]+)/;
  let regexMinValue = /minPrice=\d+/;
  let regexAedMax = /maxPrice=\d+/;

  let regexMinArea = /minArea=\d+/;
  let regexMaxArea = /maxArea=\d+/;

  let regexBedrooms = /\/(\d+)-bedrooms-or-more/;
  let regexAreas = /\/in-areas-([^/]+)/;
  let regexPropertyType = /propertyType=\d+/;
  let regexCommunity = /\/community/;
  let regexBuy= /\/buy/;
  let regexRent= /\/rent/;
  let regexBedroomCount = /bedroom=\d+/;
  let updatedURL = "";
  let regexForSecondaryPropertyType = /\/([^/]+)-for-([^/]+)/;
  let regexStatus = /status=\d+/;
  let regexSortOrder = /sort=\d+/;

  let queryExists = false

  updatedURL = currentURL;

    if (values?.property_type) {

      function containsBuyPath(str) {
        return str.includes("/buy/");
      }

      let offeringType = containsBuyPath(updatedURL) ? "sale" : "rent"

      if(values?.property_type === "any"){
        
      updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
        return `/properties-for-${offeringType}`;
      });
      if (!updatedURL.includes("for")) {
        updatedURL += `/properties-for-${offeringType}`;
      }
      }else{
        let replacedValue = values?.property_type?.replace(/ /g, "-")?.toLowerCase();
        updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
          return `/${replacedValue}-for-${offeringType}`;
        });
        if (!updatedURL.includes("for")) {
          updatedURL += `/${replacedValue}-for-${offeringType}`;
        }
      }
    }

  // if (values?.property_type) {
  //   let findoffering = findOfferingType(updatedURL)
  //     let offeringType = ""
  //     if(findoffering === "BY"){
  //       offeringType = "sale"
  //     }else{
  //       offeringType = "rent"

  //     }
  //   if(values?.property_type === "any"){
      
  //   updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
  //     return `/properties-for-${offeringType}`;
  //   });
  //   if (!updatedURL.includes("for")) {
  //     updatedURL += `/properties-for-${offeringType}`;
  //   }
  //   }else{
  //     let replacedValue = values?.property_type?.replace(/ /g, "-")?.toLowerCase();
  //     updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
  //       return `/${replacedValue}-for-${offeringType}`;
  //     });
  //     if (!updatedURL.includes("for")) {
  //       updatedURL += `/${replacedValue}-for-${offeringType}`;
  //     }
  //   }
    
  // }

  if (values?.offer) {
      let offeringType = values?.offer === "buy" ? "sale" :"rent"
      if( values?.offer === "buy"){
        updatedURL = updatedURL.replace('rent', 'buy')
      } else {
        updatedURL = updatedURL.replace('buy', 'rent')
      }
    if(values?.property_type === "any" || !values?.property_type){
      
    updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
      return `/properties-for-${offeringType}`;
    });
    }
  }

  if (values?.bed) {
    updatedURL = updatedURL.replace(regexBedrooms, (match, group) => {
      return `/${values?.bed}-bedrooms-or-more`;
    });
    if (!currentURL.includes("-bedrooms-or-more")) {
      updatedURL += `/${values?.bed}-bedrooms-or-more`;
    }
  }

  // If the "in-keywords-" pattern is found in the URL, replace it with the new value
  if (values?.text) {
    let replacedValue = values?.text?.replace(/ /g, "-")?.replace('(', '')?.replace(')', '')?.toLowerCase();
    updatedURL = updatedURL.replace(regexInKeywords, (match, group) => {
      return `/in-${replacedValue}`;
    });
    if (!updatedURL.includes("in-")) {
      updatedURL += `/in-${replacedValue}`;
    }
  }else{
    updatedURL = updatedURL.replace(regexInKeywords, (match, group) => {
      return "";
    });
  }

  if (values?.bedroom) {
    updatedURL = updatedURL.replace(regexBedroomCount, `bedroom=${values.bedroom}`);
    // If "bedroom=" is not found in the URL, append it with the new value
    if (!currentURL.includes("bedroom=")) {
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `bedroom=${values.bedroom}`;
      queryExists = true
    }
  }

  updatedURL = updatedURL.replace(regexCommunity, "/residential");

  // if (values?.type) {
  //   updatedURL = updatedURL.replace(regexPropertyType, (match, group) => {
  //     return `/propertyType-${values?.type.toLowerCase()}`;
  //   });
  //   if (!currentURL.includes("propertyType")) {
  //     updatedURL += `/propertyType-${values?.type.toLowerCase()}`;
  //   }
  // }

  if (values?.status) {
    let replacedValue = values?.status?.replace(/ /g, "-")?.toLowerCase();
    updatedURL = updatedURL.replace(regexStatus, `status=${replacedValue}`);
    if (!updatedURL.includes("status=")) {
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `status=${replacedValue}`;
      queryExists = true
    }
  }

  // If the "minPrice=" pattern is found in the URL, replace it with the new value
  if (values?.minPrice) {
    updatedURL = updatedURL.replace(regexMinValue, `minPrice=${values.minPrice}`);
    // If "minPrice=" is not found in the URL, append it with the new value
    if (!currentURL.includes("minPrice=")) {
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `minPrice=${values.minPrice}`;
      queryExists = true
    }
  }

  // If the "maxPrice=" pattern is found in the URL, replace it with the new value
  if (values?.maxPrice) {
    updatedURL = updatedURL.replace(regexAedMax, `maxPrice=${values.maxPrice}`);
    // If "maxPrice=" is not found in the URL, append it with the new value
    if (!currentURL.includes("maxPrice=")) {
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `maxPrice=${values.maxPrice}`;
      queryExists = true
    }
  }

    // If the "minArea=" pattern is found in the URL, replace it with the new value
    if (values?.minArea) {
      updatedURL = updatedURL.replace(regexMinArea, `minArea=${values.minArea}`);
      // If "minArea=" is not found in the URL, append it with the new value
      if (!currentURL.includes("minArea=")) {
        updatedURL += queryExists ? '&' : '?'
        updatedURL += `minArea=${values.minArea}`;
        queryExists = true
      }
    }
  
    // If the "maxArea=" pattern is found in the URL, replace it with the new value
    if (values?.maxArea) {
      updatedURL = updatedURL.replace(regexMaxArea, `maxArea=${values.maxArea}`);
      // If "maxArea=" is not found in the URL, append it with the new value
      if (!currentURL.includes("maxArea=")) {
        updatedURL += queryExists ? '&' : '?'
        updatedURL += `maxArea=${values.maxArea}`;
        queryExists = true
      }
    }

  if(values?.sortOrder){
    updatedURL = updatedURL.replace(regexSortOrder, `sort=${values.sortOrder}`)
    if(!currentURL.includes('sort=')){
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `sort=${values.sortOrder}`;
      queryExists = true
    }
  }

  let newURl = removePageNumberFromURL(updatedURL)
  if(newURl?.modifiedURL && newURl?.pageNumber){
      if(isUpdatingFields){
        updatedURL = newURl?.modifiedURL
      }else{
      updatedURL = newURl?.modifiedURL + `/${newURl?.pageNumber}`

      }
  }
 
  return updatedURL ? updatedURL : false;
};

export const offplan_urlRename = (currentURL, values, type, isUpdatingFields) => {
  // Use regular expressions to find and replace the dynamic parts
  let regexInKeywords = /keywords=\d+/;
  let regexMinValue = /minPrice=\d+/;
  let regexAedMax = /maxPrice=\d+/;
  let regexPropertyType = /propertyType=\d+/;
  let regexBedrooms = /bedrooms=\d+/;
  let regexAreas = /\/in-areas-([^/]+)/;
  let regexCommunity = /\/community/;
  let regexBuy= /\/buy/;
  let regexRent= /\/rent/;
  let regexBedroomCount = /\/(\d+)-bedroom/;
  let updatedURL = "";
  let regexForSecondaryPropertyType = /\/([^/]+)-for-([^/]+)/;
  let regexStatus = /\/status-([^/]+)/;
  let regexSortOrder = /sort=\d+/;
  let regexPosthandover = /posthandover=\d+/

  let queryExists = false

  updatedURL = currentURL;
  
  // If the "keywords=" pattern is found in the URL, replace it with the new value
  if (values?.text) {
    let replacedValue = values?.text?.replace(/ /g, "-")?.toLowerCase();
    updatedURL = updatedURL.replace(regexInKeywords, `keywords=${replacedValue}`);
    if (!updatedURL.includes("keywords=")) {
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `keywords=${replacedValue}`;
      queryExists = true
    }
  }else{
    updatedURL = updatedURL.replace(regexInKeywords, (match, group) => {
      return "";
    });
  }

  if (values?.status) {
    let replacedValue = values?.status?.replace(/ /g, "-")?.toLowerCase();
    updatedURL = updatedURL.replace(regexStatus, (match, group) => {
      return `/status-${replacedValue}`;
    });
    if (!updatedURL.includes("status")) {
      updatedURL += `/status-${replacedValue}`;
    }
  }

  if (values?.property_type) {
    let findoffering = findOfferingType(updatedURL)
      let offeringType = ""
      if(findoffering === "BY"){
        offeringType = "sale"
      }else{
        offeringType = "rent"

      }
    if(values?.property_type === "any"){
      
    updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
      return `/properties-for-${offeringType}`;
    });
    if (!updatedURL.includes("for")) {
      updatedURL += `/properties-for-${offeringType}`;
    }
    }else{
      let replacedValue = values?.property_type?.replace(/ /g, "-")?.toLowerCase();
      updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
        return `/${replacedValue}-for-${offeringType}`;
      });
      if (!updatedURL.includes("for")) {
        updatedURL += `/${replacedValue}-for-${offeringType}`;
      }
    }
    
  }

  if (values?.offer) {
    let findoffering = findOfferingType(updatedURL)
      let offeringType = ""
      offeringType = values?.offer === "buy" ? "sale" :"rent"

      if(findoffering === "BY"){
        updatedURL = updatedURL.replace(regexBuy, `/${values?.offer}`);
      }else{
        updatedURL = updatedURL.replace(regexRent, `/${values?.offer}`);
      }
    if(values?.property_type === "any" || !values?.property_type){
      
    updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
      return `/properties-for-${offeringType}`;
    });
    // if (!updatedURL.includes("for")) {
    //   updatedURL += `/properties-for-${offeringType}`;
    // }
    }else{
      let replacedValue = values?.property_type?.replace(/ /g, "-")?.toLowerCase();
      updatedURL = updatedURL.replace(regexForSecondaryPropertyType, (match, group) => {
        return `/${replacedValue}-for-${offeringType}`;
      });
      if (!updatedURL.includes("for")) {
        updatedURL += `/${replacedValue}-for-${offeringType}`;
      }
    }
    
  }

  if (values?.bedroom) {
    updatedURL = updatedURL.replace(regexBedroomCount, (match, group) => {
      return `/${values?.bedroom}-bedroom`;
    });
    if (!currentURL.includes("-bedroom")) {
      updatedURL += `/${values?.bedroom}-bedroom`;
    }
  }

  updatedURL = updatedURL.replace(regexCommunity, "/residential");

  // If the "bed=" pattern is found in the URL, replace it with the new value
  if (values?.bed) {
    updatedURL = updatedURL.replace(regexBedrooms, `bedrooms=${values.bed}`);
    // If "bed=" is not found in the URL, append it with the new value
    if (!currentURL.includes("bedrooms=")) {
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `bedrooms=${values.bed}`;
      queryExists = true
    }
  }

  // If the "propertyType=" pattern is found in the URL, replace it with the new value
  if (values?.type) {
    updatedURL = updatedURL.replace(regexPropertyType, `propertyType=${values.type}`);
    // If "propertyType=" is not found in the URL, append it with the new value
    if (!currentURL.includes("propertyType=")) {
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `propertyType=${values.type}`;
      queryExists = true
    }
  }

  // If the "minPrice=" pattern is found in the URL, replace it with the new value
  if (values?.minPrice) {
    updatedURL = updatedURL.replace(regexMinValue, `minPrice=${values.minPrice}`);
    // If "minPrice=" is not found in the URL, append it with the new value
    if (!currentURL.includes("minPrice=")) {
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `minPrice=${values.minPrice}`;
      queryExists = true
    }
  }

  // If the "maxPrice=" pattern is found in the URL, replace it with the new value
  if (values?.maxPrice) {
    updatedURL = updatedURL.replace(regexAedMax, `maxPrice=${values.maxPrice}`);
    // If "maxPrice=" is not found in the URL, append it with the new value
    if (!currentURL.includes("maxPrice=")) {
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `maxPrice=${values.maxPrice}`;
      queryExists = true
    }
  }

  if(values?.sortOrder){
    updatedURL = updatedURL.replace(regexSortOrder, `sort=${values.sortOrder}`)
    if(!currentURL.includes('sort=')){
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `sort=${values.sortOrder}`;
      queryExists = true
    }
  }

  if(values?.posthandover){
    updatedURL = updatedURL.replace(regexPosthandover, `posthandover=${values.posthandover}`)
    if(!currentURL.includes('posthandover=')){
      updatedURL += queryExists ? '&' : '?'
      updatedURL += `posthandover=${values.posthandover}`;
      queryExists = true
    }
  };
  
  let newURl = removePageNumberFromURL(updatedURL)
  if(newURl?.modifiedURL && newURl?.pageNumber){
      if(isUpdatingFields){
        updatedURL = newURl?.modifiedURL
      }else{
      updatedURL = newURl?.modifiedURL + `/${newURl?.pageNumber}`

      }
  }
  return updatedURL ? updatedURL : false;
};

function removePageNumberFromURL(url) {
  // Use a regular expression to match "/page-{number}" in the URL path
  const regex = /(\/page-\d+)(\/|$)/;

  // Try to match the pattern in the URL
  const match = url.match(regex);
  if (match) {
      // Extract the matched page number
      const pageNumber = match[1];

      // Replace the matched pattern with an empty string
      const modifiedURL = url.replace(regex, '$2');

      // Return both the modified URL and the extracted page number
      return { modifiedURL, pageNumber };
  } else {
      // Return the original URL if no match is found
      return { modifiedURL: url, pageNumber: null };
  }
}

export const calculateDownPayment = (price, percentage) => {
  return parseFloat((price * percentage / 100).toFixed(3));
};

export const calculatePercentage = (downPayment, propertyPrice) => {
  return parseFloat(((downPayment / propertyPrice) * 100).toFixed(3));
};

const encodeURL = (url) => {
  return url
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export const sitemapUrlGenerator = (value) => {
  let url = "";
  if (value.type === "OFFPLAN") {
    
  if(value.slug === 'cove') return
  // if(value.slug === 'project-name-1') return
    url = `offplan/${value.emirate_name}/${value.community_slug}/property/${value.slug}`;
  } else if (value.type === "BLOG") {
    url = `blog/${value.slug}`;
  }else if (value.type === "SECONDARY") {
    
    if(value.slug === 'villa-for-sale-dubai-tilal-al-ghaf-stage-8032972') return
    if(value.slug === 'villa-for-sale-dubai-tilal-al-ghaf-stage-8033232') return
    if(value.slug === 'townhouse-for-sale-dubai-damac-hills-2-stage-9431476') return

    let offeringType = value?.offering_type === "Sale"?"buy":"rent"
    url = `${offeringType}/${value.slug}`;
  } 
  else if(value.type === 'DEVELOPER') {

    if(value.slug === 'treppan-living') return
    if(value.slug === null) return
    if(value.slug === 'east-and-west-properties') return
    if(value.slug === 'lincoln-star-developments-1') return

    url = encodeURL('developers/' + value.slug)
  }
  else if(value.type === 'COMMUNITY') { 
    url = encodeURL('areas-and-communities/' + value.slug)
  }
  return url;
};

export const secondaryURLGenerator = (values, currentPathname) => {
  let regexPropertiesForSale = /properties-for-sale/g;
  let regexPropertyType = /^(.+)-for-sale/i;
  let regexBedrooms = /([\d]+)-bedroom/i;
  let regexStatus = /-status-([^/]+)/;
  let url = currentPathname;
  if (values?.status) {
    if (url.includes("-status")) {
      url = url.replace(regexStatus, (match, group) => {
        return `-status-${values?.status}`;
      });
    } else {
      url += `-status-${values?.status}`;
    }
  }
  if (values?.property_type) {
    if (url.includes("properties-for-sale")) {
      url = url.replace(
        regexPropertiesForSale,
        values?.property_type + "-for-sale"
      );
    } else {
      url = url.replace(regexPropertyType, (match, group) => {
        return `${values?.property_type}-for-sale`;
      });
    }
  }
  if (values?.bedroom) {
    if (url.includes("-bedroom")) {
      let valueSplitted = url.split("-");

      url = url.replace(regexBedrooms, (match, group) => {

        return `-${values?.bedroom}-bedroom`;
      });
    } else {
      url += +"-" + values?.bedroom + "-bedroom";
    }
  }
  return url;
};

export const findOfferingType = (pathname) => {
  let splitted = pathname.split("/");
  if (splitted[2] === "buy") {
    return "BY";
  } else {
    return "RT";
  }
};

export const valuesBeforeAKeyword = (url,type) => {

if(type === "for"){
  
    return match[1].trim();
} else {
    return null;
}
} 

export const  capitalizeWords = (inputString) => {
  // Split the input string into an array of words
  const words = inputString.split(' ');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  // Join the capitalized words back into a string
  const resultString = capitalizedWords.join(' ');

  return resultString;
}

export const checkIsResidential = (params) => {
  let isResidential = false
  for (let x in params) {
    let str = params[x];

    if(str.toLowerCase() === "residential"){
     isResidential = true
     break
    }else{
     isResidential = false
    }
  }
  return isResidential
}

export const subLinkPathnameActiveFinder = (sublinks,currentPath) => {
  
    if (sublinks?.length) {
      return sublinks.some((subLink) => subLink.path === currentPath);
    }
    return false;
}

export const searchInputQueryGenerator = (category,inputValues) => {
 let query = ""
}

export const addThreeMonthsToDate = (stringDate) => {

  // Convert the date string to a Date object
  let date = new Date(stringDate);

  // Add 3 months to the date
  date.setMonth(date.getMonth() + 3);

  // Format the date back to the desired string format
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  let day = String(date.getDate()).padStart(2, '0');

  let newDateString = `${year}-${month}-${day}`;
  return newDateString
}

export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const strapiRichTextToString = (obj) => {
  if(!obj) return null

  function extractTextFromChildren(children) {
    let text = '';
  
    children.forEach(child => {
      if (child.type === 'text') {
        text += child.text;  // Concatenate the text content
      } else if (child.type === 'link' && child.children) {
        // Recursively handle links and their children
        text += extractTextFromChildren(child.children);
      } else if (child.type === 'list-item' && child.children) {
        // Concatenate list item text with a space for spacing between items
        text += extractTextFromChildren(child.children) + ' '; 
      } else if (child.children) {
        // Handle other nested structures
        text += extractTextFromChildren(child.children);
      }
    });
  
    return text;
  }
  
  function extractTextFromFaqs(obj) {
    let allText = '';
  
    obj.forEach(faq => {
      if (faq.type === 'paragraph' || faq.type === 'heading' || faq.type === 'list' || faq.type === 'quote' || faq.type === 'code') {
        // Add space after paragraphs, headings, and handle list formatting
        allText += extractTextFromChildren(faq.children).trim() + (faq.type === 'list' ? ' ' : ' ');
      }
    });
  
    return allText.trim();  // Ensure no trailing spaces at the end
  }

  return extractTextFromFaqs(obj)
}
export const square_feet_to_square_meter = 0.092903;