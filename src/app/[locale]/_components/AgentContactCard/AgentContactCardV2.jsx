"use client";
import React, { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { hubspotFormAPI } from "../SubscribeNewsletter/service";
import ErrorIcon from "../../../../../assets/Icons/error.svg";
import { useTranslations, useLocale } from 'next-intl';
import dynamic from "next/dynamic";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

const AgentContactCardV2 = ({ contactText, propertyData, type }) => {
  const [value, setValue] = useState()
  const t = useTranslations('single_secondary');
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const [inputValues, setInputValues] = useState();
  const [error, setError] = useState();
  const handleUpdate = (item) => {
    const { name, value } = item?.target;
    handleChange(name, value);
  };

  const handleChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const validation = () => {
    let validationStatus = true;
    let errors = {};
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!inputValues?.fullname) {
      errors.fullname = "Name is required!";
      validationStatus = false;
    }

    // Check that a phone number is entered and is valid
    if (!inputValues?.mobilephone) {
      errors.mobilephone = "Phone number is required!";
      validationStatus = false;
    } else if (!isValidPhoneNumber(inputValues.mobilephone)) {
      errors.mobilephone = "Enter a valid phone number!";
      validationStatus = false;
    }

    if (!inputValues?.email) {
      errors.email = "Email is required!";
      validationStatus = false;
    } else if (!inputValues?.email?.match(emailRegex)) {
      errors.email = "Enter a valid email!";
      validationStatus = false;
    }
    setError(errors);
    return validationStatus;
  };

  const updateHubspotForm = async () => {
    let pageInfo = {
      pageUri: window.location.href,
      pageName: propertyData?.attributes?.slug,
      project_name: propertyData?.attributes?.property_ref_no + " " + propertyData?.attributes?.property_name ,
    };

    // console.log('inputValues', inputValues)
    // console.log('type', type)
    // console.log('pageInfo', pageInfo)
    // return

    const result = await hubspotFormAPI(inputValues, type, pageInfo);
    if (result?.status === 200) {
      setInputValues(null);
      setValue(null)
      Swal.fire({
        title: "Success",
        text: result?.data?.inlineMessage,
        icon: "success",
        confirmButtonText: "Ok",
        background: "var(--primary-bg-color)",
        color: "var(--text-color)",
      });
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const validateStatus = validation();
    if (validateStatus) {
      updateHubspotForm();
    }
  };



  return (
    <div className="agentContactCardV2">
      <div className="top">
        <div className="left">
          {!propertyData?.attributes?.stage_team?.data?.attributes?.image?.data?.attributes?.url ? (
            <div className="imageContainer placeHolder">
              <Image
                src={"/spLogo.webp"}
                fill={true}
                alt="Agent_photo"
              />
            </div>
          ) : (
            <div className="imageContainer">
              <Image
                src={propertyData?.attributes?.stage_team?.data?.attributes?.image?.data?.attributes?.url}
                fill={true}
                alt="Agent_photo"
              />
            </div>
          )}
        </div>

        <div className="right">
          <h2 className="name">{propertyData?.attributes?.agent_name}</h2>
          {
            propertyData?.attributes?.stage_team?.data?.id&&
          <h6 className="title">{t("Property consultant")}</h6>
          }
        </div>
      </div>
      <div className="bottom">
        <div
          className={
            error?.fullname ? "error inputContainer" : "inputContainer"
          }
        >
          <input
            className={error?.fullname ? "error" : "inputField"}
            type="text"
            name="fullname"
            placeholder={t('name')}
            value={inputValues?.fullname || ""}
            onChange={(item) => handleUpdate(item)}
          />
          {error?.fullname && (
            <span className="errorIcon">
              <ErrorIcon />
            </span>
          )}
        </div>
        <div className={
                  error?.email ? "error inputContainer" : "inputContainer"
                }>
          <input
            className={error?.email ? "error" : "inputField"}
            type="email"
            name="email"
            placeholder={t('email')}
            value={inputValues?.email || ""}
            onChange={(item) => handleUpdate(item)}
          />
          {error?.email && (
            <span className="errorIcon">
              <ErrorIcon />
            </span>
          )}
        </div>
        <div className="inputContainer">
          <textarea
            name="message"
            id=""
            cols="20"
            rows="5"
            placeholder={t("message")}
            value={inputValues?.message || ""}
            onChange={(item) => handleUpdate(item)}
          ></textarea>
        </div>
        <div style={{position: 'relative'}}>
          <PhoneInput
            type="tel"
            dir={direction}
            placeholder="Phone"
            value={value}
            onChange={(val) => {
              setValue(val);
              handleChange("mobilephone", val); // Ensure inputValues.mobilephone is set
            }}
            name="mobilephone"
            style={{marginBottom: '1rem'}}
            defaultCountry="AE"
            countryCallingCodeEditable={false}
            rules={{ required: true }}
            international
            className={`${error?.mobilephone ? 'error' : ''}`}
          />
          {error?.mobilephone && (
            <span className="errorIcon">
              <ErrorIcon />
            </span>
          )}
        </div>
        <div className={`buttonContainer ${isRTL ? 'ar' : ''}`}>
          <button onClick={(e) => submitForm(e)}>{t('send_message')}</button>
        </div>
      </div>
    </div>
  );
};

export default AgentContactCardV2;
