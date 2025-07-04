"use client"
import ContactForm from "@/app/[locale]/_components/ContactForm/ContactForm";
import { numberFormat } from "@/app/[locale]/_utils/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const FloorPlan = ({floorPlan,title}) => {
  const [activeTab,setActiveTab] = useState(0)
  const [activeData,setActiveData] = useState({})
  const [contactFormModal,setContactFormModal] = useState(false)
 useEffect(()=>{
  setActiveData(floorPlan&&floorPlan[0])
 },[])



 const tabHandleClick = (item,index) =>{
  setActiveTab(index)
  setActiveData(item)
 }
  return (
    <div className="floorPlanSection">
      {
        contactFormModal&&
      <ContactForm title='Get the floor plan' setContactFormModal={setContactFormModal}/>
      }
      <div className="leftContainer">
        <h1 className="mainHeading">Floor Plans of {title}</h1>
        <ul className="tabs">
          {
            floorPlan?.map((item,index)=>(
              <li key={item?.id} className={`tab ${index===activeTab ?"active":""}`} onClick={()=>tabHandleClick(item,index)}>
              <span>{item?.bedroom} BR</span>
            </li>
            ))
          }
         
        </ul>
        <ul className="foorInfo">
          <li className="list">
            <div className="left">
              <span className="label">Type</span>
            </div>
            <div className="right">
              <span className="value">{activeData?.type}</span>
            </div>
          </li>
          <li className="list">
            <div className="left">
              <span className="label">Total Area</span>
            </div>
            <div className="right">
              <span className="value">{numberFormat(activeData?.area)} sq.ft.</span>
            </div>
          </li>
          <li className="list">
            <div className="left">
              <span className="label">Starting Price</span>
            </div>
            <div className="right">
              <span className="value">AED {numberFormat(activeData?.starting_price)}</span>
            </div>
          </li>
        </ul>
        <div className="buttonContainer">
          <button className="globalBtn" onClick={()=>setContactFormModal(true)}>Get All Floor Plans</button>
        </div>
      </div>
      <div className="rightContainer gradientBorder">
        <div className="imageContainer">
            <Image 
                src={'/floor.webp'}
                fill
                alt="FloorPlan"
            />
        </div>
      </div>
    </div>
  );
};

export default FloorPlan;
