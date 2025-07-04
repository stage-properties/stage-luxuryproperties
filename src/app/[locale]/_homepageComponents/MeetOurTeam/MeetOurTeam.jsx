'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getTeamData } from "./service";
import ActionControllers from "./components/ActionControllers";
import { useTranslations, useLocale } from 'next-intl';
import ContactForm from "../../_components/ContactForm/ContactForm";
import TeamCarousel from "./TeamCarousel";

const MeetOurTeam = () => {
  const t = useTranslations('common');
  const locale = useLocale()

  const isRTL = locale === 'ar'

  const [page,setPage] = useState(1)
  const [teamData,setTeamData] = useState()
  const [teamApiInfo,setTeamApiInfo] = useState()
  const [contactFormModal,setContactFormModal] = useState(false)

  useEffect(()=>{
    fetchTeam()
  },[])


  const fetchTeam = async() => {
    const response = await getTeamData()
    setTeamApiInfo(response?.meta)
    setTeamData(response?.data)
  }

  const handleContactFormModal = (flag) => {
    setContactFormModal(flag)
  }

  return (
    <div className="meetOurTeamSection">
      {
        contactFormModal &&
      <ContactForm setContactFormModal={setContactFormModal}  type='contact-form'/>
      }
      <div className="imageContainerBg">
        <Image src="/team_section_bg.jpeg" fill={true} alt="Our-story-bg" />
        <div className="gradient"></div>
        <div className="contentContainer">
          <div className="wrapper">
          <div className="leftContainer">
            <h2 className={`mainHeading gradientText ${isRTL ? 'ar' : ''}`}>{t('meet_our_team')}</h2>
            <p className={`description ${isRTL ? 'ar' : ''}`}>
              {t('get_to_know_our_team_of_passionate_real_estate_professionals_who')}
            </p>
            <ActionControllers hideOnResponsive={true} handleContactFormModal={handleContactFormModal}/>
          </div>
          <div className="rightContainer">
            <TeamCarousel teamData={teamData} />
            <div className="navController">
              <h6>{t('meet_our_team')}</h6>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetOurTeam;
