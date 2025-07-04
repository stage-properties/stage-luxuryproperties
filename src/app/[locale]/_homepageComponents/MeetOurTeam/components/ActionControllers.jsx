'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const ActionControllers = ({ handleContactFormModal, hideOnResponsive }) => {
  const t = useTranslations('common')

  return (
    <div className={`actionControllers ${hideOnResponsive ? "hideOnResponsive" : ""}`}>
      <div className="buttonContainer" style={{width: 'unset'}}>
        <Link href="/our-team" style={{display: 'block', textAlign: 'center'}} className="globalBtn">
          {t('meet_our_team')}
        </Link>
      </div>
    </div>
  )
}

export default ActionControllers