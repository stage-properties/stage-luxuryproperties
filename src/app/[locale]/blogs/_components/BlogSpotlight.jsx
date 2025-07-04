import React from 'react'
import Image from "next/image";
import GradientLine from '@/app/[locale]/_components/GradientLine/GradientLine';

const BlogSpotlight = () => {
  return (
    <div className='blogSpotlight'>
        <div className="imageContainer">
            <Image src="/blog_bg.jpeg"
                fill
                alt='Blog bg'
            />
                <div className="gradient"></div>
            <div className="info">
                <div className="wrapper">
                    <h1 className="mainHeading">BLOGS</h1>
                   <GradientLine width="50%"/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BlogSpotlight