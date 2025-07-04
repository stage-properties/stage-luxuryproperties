'use client'

import Link from 'next/link';
import React from "react";
import RightArrow from "../../../../../../assets/Icons/rightArrow.svg";
import { useTranslations } from 'next-intl';

const ViewAllButton = ({ buttonContainerStyle }) => {
  const t = useTranslations('common');

  return (
    <div className="buttonContainer" style={buttonContainerStyle}>
      <Link href="/blogs" className="globalBtn" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        {t('view_all_blogs')}
        <span className="icon">
          <RightArrow style={{width: '20px', height: '20px'}} />
        </span>
      </Link>
    </div>
  );
};

export default ViewAllButton;