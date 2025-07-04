'use client'
import AgentContactCard from "@/app/[locale]/_components/AgentContactCard/AgentContactCard";
import React from "react";

const AgentStickyContainer = ({contactText,formRef,pageType}) => {
   
  return (
    // position>900&&
    <div className="stickyContainer">
      {/* <h1 className="heading">WE ARE AVAILABLE</h1> */}
      <AgentContactCard formRef={formRef} contactText={contactText} pageType={pageType} />
    </div>
  );
};

export default AgentStickyContainer;
