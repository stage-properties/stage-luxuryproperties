"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';

// Third-Party
const Slider = dynamic(() => import ('rc-slider'), {
  ssr: true
});
import 'rc-slider/assets/index.css';
import { Tooltip } from "react-tooltip";
import QuestionIcon from "../../../../../assets/Icons/question.svg";

// ---- Updated UTILITIES IMPORT ----
import {
  calculateDownPayment,
  calculateMortgage,                // now uses correct formula
  calculatePercentage,
  calculateTotalLoanAmount,        
  convertMyCurrency,        // new function to get principal+interest
  formatNumberToArabic,
  numberFormat,
} from "@/app/[locale]/_utils/utils";

const DynamicContactForm = dynamic(() => import ('../ContactForm/ContactForm'), {
  ssr:false
});

const MortgageCalculator = ({exchangeRates}) => {
  const currency = useSelector((state) => state.currency.value);
  const t = useTranslations('mortgage_calculator');
  const t_common = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const direction = isRTL ? "rtl" : 'ltr';

  const [error, setError] = useState({});
  const [inputValues, setInputValues] = useState({
    propertyPrice: 1000000,
    downPayment: 200000,
    percentage: 20,
    interestRate: 3.75,  // interpreted as 3.75%
    year: 25,
  });
  // We'll store monthly payment in `result`
  const [result, setResult] = useState("4113"); 
  const [contactFormModal, setContactFormModal] = useState(false);

  useEffect(() => {
    if (inputValues) {
      validation();
      // Remember: calculateMortgage( price, annualInterestRate, years, downPayment )
      const monthlyPayment = calculateMortgage(
        Number(inputValues.propertyPrice),
        Number(inputValues.interestRate),
        Number(inputValues.year),
        Number(inputValues.downPayment)
      );
      setResult(monthlyPayment);
    }
  }, [inputValues]);
  
  // useEffect(() => {
  //   const _exchangeRates = exchangeRates?.data?.attributes
  //   const obj = {
  //     propertyPrice: convertMyCurrency({value: inputValues?.propertyPrice || 1000000, currency, ..._exchangeRates }),
  //     downPayment: convertMyCurrency({value:inputValues?.downPayment || 200000, currency, ..._exchangeRates}),
  //     percentage: inputValues?.percentage,
  //     interestRate: inputValues?.interestRate,
  //     year: inputValues?.year
  //   }

  //   console.log('currency', currency)
  //   console.log('obj', obj)

  //   setInputValues(obj)

  // }, [currency])

  const handleChangeStart = () => {};

  const sliderHandleChange = (value) => {
    handleChange("year", value);
  };

  const handleChangeComplete = () => {};

  const handleUpdate = (item) => {
    const { name, value } = item.target;
    if (name) {
      // Remove non-numeric characters except decimal
      const numericValue = value.replace(/[^0-9.]/g, "");
      // Ensure only one decimal point
      const sanitizedValue = numericValue.replace(/(\.\d*)\./g, "$1");
      handleChange(name, sanitizedValue);
    } else {
      handleChange(name, value);
    }
  };

  // Simple validation example
  const validation = () => {
    let validationStatus = true;
    let errors = {};

    if (Number(inputValues.propertyPrice) < 100000) {
      errors.propertyPrice = t("Minimum property price is AED 100,000");
      validationStatus = false;
    }

    if (Number(inputValues.percentage) < 15 || Number(inputValues.percentage) > 100) {
      errors.downPayment = t("The minimum down payment is 20% (or 15% for UAE nationals)");
      validationStatus = false;
    }

    if (Number(inputValues.interestRate) < 1 || Number(inputValues.interestRate) > 100) {
      errors.interestRate = t("The minimum interest rate is 1%");
      validationStatus = false;
    }

    setError(errors);
    return validationStatus;
  };

  const handleChange = (name, value) => {
    if (name === "percentage") {
      setInputValues((prev) => ({
        ...prev,
        percentage: value,
        downPayment: calculateDownPayment(prev.propertyPrice, value),
      }));
    } else if (name === "downPayment") {
      setInputValues((prev) => ({
        ...prev,
        downPayment: value,
        percentage: calculatePercentage(value, prev.propertyPrice),
      }));
    } else if (name === "propertyPrice") {
      // If the user cleared the input (value === "" or "0" if you prefer),
      // skip recalculating downPayment and percentage.
      if (!value) {
        // Just update propertyPrice, keep the old downPayment & percentage
        setInputValues((prev) => ({
          ...prev,
          propertyPrice: "", // or value if you prefer "0"
        }));
      } else {
        // Otherwise, recalculate downPayment & percentage as usual
        const downPaymentValue = calculateDownPayment(value, inputValues.percentage);
        const percentageValue = calculatePercentage(downPaymentValue, value);
    
        setInputValues((prev) => ({
          ...prev,
          propertyPrice: value,
          downPayment: downPaymentValue,
          percentage: percentageValue,
        }));
      }
    }
    else if (name === "year") {
      console.log('value', value)
      setInputValues((prev) => ({
        ...prev,
        year: value,
      }));
    }
  };

  return (
    <div className="mortgageCalculator" dir={direction}>
      {contactFormModal && (
        <DynamicContactForm
          setContactFormModal={setContactFormModal}
          extraValues={inputValues}
          type="mortgage-form"
        />
      )}
      <h1 className={`mainHeading gradientText ${isRTL ? 'ar' : ''}`} >
        {t("mortgage calculator")}
      </h1>
      <h2 className={`mainHeading gradientText ${isRTL ? 'ar' : ''}`}>
        {t("Planning to buy a home?")}
      </h2>
      <h3 className={`mainHeading gradientText ${isRTL ? 'ar' : ''}`}>
        {t("Our free mortgage calculator can help you estimate your monthly payments")}
      </h3>

      <div className="paragraphContainer">
        <div>
          <p className={`${isRTL ? 'ar' : ''}`}>
            {t("Get a FREE estimate of your possible loan amount from our trustworthy finance partners, then start picturing your dream home!")}
          </p>
        </div>    
      </div>

      <div className="calculatorContainer gradientBorder">
        {/* LEFT SIDE */}
        <div className="leftcontainer">
          {/* Property Price */}
          <div className="inputContainer">
            <div className="label">
              <label htmlFor="propertyPrice">{t("Property price")}</label>
            </div>
            <div className="fields">
              <div className="aedSign">
                <span>{t_common(currency.toLowerCase())}</span>
              </div>
              <div className="inputField doubleField">
                <input
                  type="number"
                  min={0}
                  id="propertyPrice"
                  name="propertyPrice"
                  value={inputValues.propertyPrice}
                  onChange={handleUpdate}
                />
              </div>
            </div>
            {error?.propertyPrice && (
              <span className="error">{error.propertyPrice}</span>
            )}
          </div>

          {/* Down Payment */}
          <div className="inputContainer">
            <div className="label">
              <label htmlFor="downPayment">{t("Down payment")}</label>
              <span
                data-tooltip-id="downPaymentTooltip"
                data-tooltip-content={t("A percentage of the property value paid up front")}
                className="icon"
              >
                <QuestionIcon />
              </span>
              <Tooltip
                id="downPaymentTooltip"
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  maxWidth: "100%",
                }}
              />
            </div>
            <div className="fields oneByTwo">
              <div className="aedSign">
                <span>{t_common(currency.toLowerCase())}</span>
              </div>

              <div className="inputField doubleField downPayment">
                <input
                  type="number"
                  min={0}
                  id="downPayment"
                  name="downPayment"
                  onChange={handleUpdate}
                  value={inputValues.downPayment}
                />
              </div>

              <div className="inputField ">
                <input
                  type="number"
                  min={0}
                  id="downPayment"
                  name="percentage"
                  onChange={handleUpdate}
                  value={inputValues.percentage}
                />
              </div>
              <div className="sign">
                <span>%</span>
              </div>
            </div>
            {error?.downPayment && (
              <span className="error">{error.downPayment}</span>
            )}
          </div>

          {/* Interest Rate */}
          <div className="inputContainer">
            <div className="label">
              <label htmlFor="interestRate">{t("Interest rate")}</label>
              <span
                className="icon"
                data-tooltip-id="interestTooltip"
                data-tooltip-content={t("The market average interest rate is")}
              >
                <QuestionIcon />
              </span>
              <Tooltip
                id="interestTooltip"
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  maxWidth: "100%",
                }}
              />
            </div>
            <div className="fields">
              <div className="inputField">
                <input
                  type="number"
                  min={0}
                  id="interestRate"
                  name="interestRate"
                  onWheel={(e) => e.target.blur()}
                  onChange={handleUpdate}
                  value={inputValues.interestRate}
                />
              </div>
              <div className="sign">
                <span>%</span>
              </div>
            </div>
            {error?.interestRate && (
              <span className="error">{error.interestRate}</span>
            )}
          </div>

          {/* Loan Length (Slider) */}
          <div className="rangeContainer">
            <div className="head">
              <label>{t("Length of loan")}</label>
              <span className="rangeValue">
                {isRTL ? formatNumberToArabic(inputValues.year) : inputValues.year}
              </span>
            </div>
            <div className="rangeSlider" style={{ marginTop: '1rem', width: '99.3%' }}>
              <Slider 
                min={1}
                max={25}
                value={Number(inputValues.year)}
                onChange={sliderHandleChange}
                onChangeComplete={handleChangeComplete}
                trackStyle={{ 
                  backgroundImage: "linear-gradient(262deg, #ac836d 28%, #f0cab2 70%)",
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,.4)',
                  height: 12 
                }}
                railStyle={{ 
                  backgroundColor: "#e6e6e6", 
                  height: 12 
                }}
                handleStyle={{
                  border: "7px solid white",
                  opacity: 1,
                  height: 30,
                  width: 30,
                  marginLeft: -10,
                  marginTop: -8.5,
                  backgroundColor: "#dadada",
                  boxShadow: '0 0 0 1px gray, 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,.4), inset 0 -1px 3px rgba(0,0,0,.4)'
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Results) */}
        <div className="rightContainer">
          <div className="resultContainer">
            <div className="top">
              <div className="resultSection">
                {/* Display monthly payment */}
                <h3 className={`result ${isRTL ? 'ar' : ''}`}>
                  {isRTL
                    ? `${formatNumberToArabic(result, true)} ${t_common(currency.toLowerCase())}`
                    : `${t_common(currency.toLowerCase())} ${numberFormat(result || 0)}`
                  }
                </h3>
                <span className="sub">{t("per month")}</span>
              </div>
              <p>{t("Estimated mortgage payment")}</p>
            </div>

            <div className="center">
              <div className="oneLine">
                <span>{t("Total loan amount")}</span>
                <span>
                  {/*
                    If you want total principal+interest over entire loan:
                    
                    1) Use calculateTotalLoanAmount
                       (propertyPrice, interestRate, year, downPayment)
                    
                    If you'd rather show just the principal (borrowed):
                    2) Use calculatePrincipalAmount(propertyPrice, downPayment)
                  */}
                  {isRTL
                    ? <>
                        {formatNumberToArabic(
                          calculateTotalLoanAmount(
                            Number(inputValues.propertyPrice),
                            Number(inputValues.interestRate),
                            Number(inputValues.year),
                            Number(inputValues.downPayment)
                          ),
                          true
                        )} {t_common(currency.toLowerCase())}
                      </>
                    : <>
                        {t_common(currency.toLowerCase())}{" "}
                        {numberFormat(
                          calculateTotalLoanAmount(
                            Number(inputValues.propertyPrice),
                            Number(inputValues.interestRate),
                            Number(inputValues.year),
                            Number(inputValues.downPayment)
                          )
                        )}
                      </>
                  }
                </span>
              </div>

              <div className="oneLine">
                <span>{t("Length of loan")}</span>
                <span>
                  {isRTL
                    ? formatNumberToArabic(inputValues.year)
                    : inputValues.year
                  } {isRTL ? t("year") : "years"}
                </span>
              </div>

              <div className="buttonContainer">
                <button
                  className="globalBtn"
                  onClick={() => setContactFormModal(true)}
                >
                  {t("Get in touch")}
                </button>
              </div>
            </div>
            <div className={`bottom ${isRTL ? 'ar' : ''}`}>
              <p>
                {t("All calculations are estimates and provided for informational purposes only")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;