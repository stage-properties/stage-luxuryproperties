import React from 'react'
import { Link } from '@/i18n/routing';
import RightArrow from "../../../../../assets/Icons/rightArrow.svg";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';

const BlogCard = ({data}) => {
  const title = data?.attributes?.blog_title
  const alternativeText = data?.attributes?.featured_image?.data?.attributes?.alternativeText

  const t = useTranslations('blog_card');
  const locale = useLocale()

  const isRTL = locale === 'ar'
  const direction = isRTL ? 'rtl' : 'ltr'

  return (
    <div id='blogCard' title={data?.attributes?.blog_title}>
       <Link href={`/blog/${data?.attributes?.slug}`}>
       <div className="imageContainer">
        <Image
          src={data?.attributes?.featured_image?.data?.attributes?.url}
          fill={true}
          alt={alternativeText || title}
          sizes=""
        />
      </div>
      <div className="detailsContainer">
        <h2 className={`title ${isRTL ? 'ar' : ''}`}>{data?.attributes?.blog_title}</h2>
        <div className="extraInfo">
          <div className="top">
          </div>
          <div className="bottom">
            <div className="oneLine">
             
              <h6 className="text">
                {t("READ MORE")}
                <span className="icon">
                  <RightArrow />
                </span>
              </h6>
            </div>
          </div>
        </div>
      </div>
      </Link>

    </div>
  )
}

export default BlogCard