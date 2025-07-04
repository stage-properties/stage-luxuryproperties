"use client";
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {useTranslations} from 'next-intl';

const SecondaryLocation = (props) => {
  const t = useTranslations('single_secondary');

  const mapContainerStyle = {
    height: "600px",
    width: "100%",
  };

  const center = {
    lat: props?.propertyData?.attributes?.location_points?.coordinates.lat,
    lng: props?.propertyData?.attributes?.location_points?.coordinates.lng,
  };

  if(!center.lat || !center.lng) return null

  return (
    <div className="locationInfo gradientBorder">
      <div className="wrapper">
        <h2 className="heading">{t('location')}</h2>
        <div className="mapContainer">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={center}>
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default SecondaryLocation;