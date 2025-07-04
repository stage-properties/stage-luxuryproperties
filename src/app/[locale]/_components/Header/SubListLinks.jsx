import React from 'react'
import { Link } from '@/i18n/routing';

const SubListLinks = ({subLinkPath,subLinkLabel}) => {
  return (
    
    <li className='subLink'>
    <Link className='subLinkItem' href={subLinkPath}>{subLinkLabel}</Link>
    </li>

  )
}

export default SubListLinks