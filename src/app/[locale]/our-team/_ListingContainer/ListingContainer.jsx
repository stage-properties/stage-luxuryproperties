"use client";

import React, { useState } from "react";
import DownArrow from "../../../../../assets/Icons/arrowDown.svg";
import Image from "next/image";
import CarouselListing from "./CarouselListing";
import { getTeamData } from "@/app/[locale]/_commonService/network";
import LandscapeTeamCard from "@/app/[locale]/_components/TeamCard.jsx/LandscapeTeamCard";
import { useTranslations, useLocale } from 'next-intl';

const ListingContainer = ({ heading, data, type, APIinfo, apiType }) => {

  const locale = useLocale()
  const t = useTranslations('our_team');

  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  const [teamType, setTeamType] = useState(type);
  const [teamData, setTeamData] = useState(data);
  const [page, setPage] = useState(1);
  
  const viewMorehandler = async () => {
    setPage((prev) => prev + 1);
    const pageCount = `page=${page + 1}`;
    const teamDataResponse = await getTeamData(apiType, `${pageCount}`, 6);
    setTeamData([...teamData, ...teamDataResponse?.data]);
  };

  return (
    <div className="spTeamContainer">
      <div className="wrapper">
        <h2 className="heading">{heading}</h2>

        <div className="teamListing">
          {teamType === "MANAGEMENT" &&
            teamData
              ?.filter((item) => item.id === "186" || item.id === "185")
              ?.sort((a, b) => a.id - b.id)
              ?.map((item) => (
                <div key={item?.id} className={`item ${isRTL ? 'ar' : ''}`}>
                  <LandscapeTeamCard data={item} locale={locale} />
                </div>
              ))}
          {teamType === "MANAGEMENT" &&
            teamData
              ?.filter((item) => item.id !== "186" && item.id !== "185")
              .map((item) => (
                <div key={item?.id} className={`item ${isRTL ? 'ar' : ''}`}>
                  <LandscapeTeamCard data={item} locale={locale} />
                </div>
              ))}

          {teamType !== "MANAGEMENT" &&
            teamData
              ?.filter((item) => item.id !== "186" && item.id !== "185")
              .map((item) => (
                <div key={item?.id} className={`item ${isRTL ? 'ar' : ''}`}>
                  <LandscapeTeamCard data={item} locale={locale} />
                </div>
              ))}
        </div>
        <CarouselListing
          teamType={teamType}
          setTeamData={setTeamData}
          teamData={teamData}
          APIinfo={APIinfo}
          apiType={apiType}
          locale={locale}
        />

        <div className="gradientSection">
          {page < APIinfo?.pagination?.pageCount && (
            <button className="viewMore" onClick={() => viewMorehandler()}>
              <span className="text">{t("VIEW MORE")}</span>
              <span className="icon">
                <DownArrow />
              </span>
            </button>
          )}
        </div>
        <div className="gradientLine">
          <Image src="/gradientLine.png" fill={true} alt="GradientLine" />
        </div>
      </div>
    </div>
  );
};

export default ListingContainer;
