"use client";

import React, { useEffect } from 'react'
import AOS from "aos";

const AosInit = () => {
    useEffect(() => {
        AOS.init({
          offset: 0,
        });
      }, []);
  return (
 <></>
  )
}

export default AosInit