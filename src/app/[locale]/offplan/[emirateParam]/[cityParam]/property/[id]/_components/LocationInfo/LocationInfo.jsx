"use client";
import React, {useState} from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import ContactForm from "@/app/[locale]/_components/ContactForm/ContactForm";
import { useTranslations, useLocale } from 'next-intl';

const LocationInfo = ({offplanData, projectName, pageName}) => {
  const t = useTranslations('offplan_single');
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const [contactFormModal, setContactFormModal] = useState(false);

  const location_description = offplanData?.attributes?.location_description
  const facilities_near_location = offplanData?.attributes?.facilities_near_location
  const time_to_downtown_dubai = offplanData?.attributes?.time_to_downtown_dubai
  const time_to_dubai_marina = offplanData?.attributes?.time_to_dubai_marina
  const time_to_dxb_airport = offplanData?.attributes?.time_to_dxb_airport
  const time_to_dwc_airport = offplanData?.attributes?.time_to_dwc_airport

  const mapContainerStyle = {
    height: "600px",
    width: "100%",
  };

  const center = {
    lat: offplanData?.attributes?.coordinates?.coordinates.lat,
    lng: offplanData?.attributes?.coordinates?.coordinates.lng,
  };

  const isFacilitiesNearLocation = facilities_near_location?.[0]?.type === 'list'

  return (
    <div className="locationInfo gradientBorder" dir={direction}>
      {contactFormModal && (
        <ContactForm setContactFormModal={setContactFormModal} type='listing-form' projectName={projectName} pageName={pageName} />
      )}
      <div className="wrapper">
        <h2 className={`mainHeading ${isRTL ? 'ar' : ''}`}>{t('Location')}</h2>
        <div className="mapContainer">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={center}>
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </div>
        {location_description && (<p className="location_description">{location_description}</p>)}
        <div className="destinations_container">
          <div className={`destinations_container_parent ${location_description ? '' : 'removeMarginTop'}`}>
            {isFacilitiesNearLocation && (<p className="facilities_near_location">{t('Within about 15 minutes, there is a wide array of social facilities to be found, including:')}</p>)}
            {isFacilitiesNearLocation && facilities_near_location && (<BlocksRenderer content={facilities_near_location} />)}
            <div className={`globalBtnContainer ${isFacilitiesNearLocation ? '' : 'removeMarginTop'}`}>
              <button className="globalBtn fullWidth" onClick={() => setContactFormModal(true)}>{t("Book a project site visit")}</ button>
            </div>
          </div>
          {(parseInt(time_to_downtown_dubai) || parseInt(time_to_dubai_marina) || parseInt(time_to_dwc_airport) || parseInt(time_to_dxb_airport)) && (<div className="destinations">
            <div className="parent">
              {parseInt(time_to_downtown_dubai) ? (<div className="destinations_item">
                <img src='/tower.svg' alt="duration" width={52} /> 
                {isRTL ? 
                  <p className="value">{time_to_downtown_dubai} {time_to_downtown_dubai > 1 ? t('minutes') : t('minute')}</p> : 
                  <p className="value">{time_to_downtown_dubai} minute{time_to_downtown_dubai > 1 ? 's' : ''}</p>
                }
                <p className="label">{t("to Downtown Dubai")}</p>
              </div>) : null}
              {parseInt(time_to_dubai_marina) ? (<div className="destinations_item">
                <img src='/boat.svg' alt="duration" width={52} /> 
                {isRTL ? 
                  <p className="value">{time_to_dubai_marina} {time_to_dubai_marina > 1 ? t('minutes') : t('minute')}</p> : 
                  <p className="value">{time_to_dubai_marina} minute{time_to_dubai_marina > 1 ? 's' : ''}</p>
                }
                <p className="label">{t("to Dubai Marina")}</p>
              </div>) : null}
            </div>
            <div className="parent">
              {parseInt(time_to_dxb_airport) ? (<div className="destinations_item">
                <img src='/plane.svg' alt="duration" width={52} /> 
                {isRTL ? 
                  <p className="value">{time_to_dxb_airport} {time_to_dxb_airport > 1 ? t('minutes') : t('minute')}</p> : 
                  <p className="value">{time_to_dxb_airport} minute{time_to_dxb_airport > 1 ? 's' : ''}</p>
                }
                <p className="label">{t("to DXB Airport")}</p>
              </div>) : null}
              {parseInt(time_to_dwc_airport) ? (<div className="destinations_item">
                <img src='/plane.svg' alt="duration" width={52}/> 
                {isRTL ? 
                  <p className="value">{time_to_dwc_airport} {time_to_dwc_airport > 1 ? t('minutes') : t('minute')}</p> : 
                  <p className="value">{time_to_dwc_airport} minute{time_to_dwc_airport > 1 ? 's' : ''}</p>
                }
                <p className="label">{t("to DWC Airport")}</p>
              </div>) : null} 
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;