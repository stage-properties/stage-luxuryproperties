"use client";
import React, { useState } from "react";

const DescriptionReadMoreBtn = () => {
    const [isReadMore,SetIsReadMore] = useState(false)
    const readMoreHandler = () => {
        let descriptionContainer = document.getElementById("descriptionContainer")
        if(isReadMore){
            descriptionContainer.classList.add("contract")
            descriptionContainer.scrollIntoView()

        }else{
            descriptionContainer.classList.remove("contract")
        }
        
       SetIsReadMore(!isReadMore)
    }
  return (
    <div className={isReadMore?"moreSection disableGradient":"moreSection"}>
      <button className="readMore gradientBorder" onClick={readMoreHandler}>
        <span>{isReadMore?"Read Less":"Read More"}</span>
      </button>
    </div>
  );
};

export default DescriptionReadMoreBtn;
