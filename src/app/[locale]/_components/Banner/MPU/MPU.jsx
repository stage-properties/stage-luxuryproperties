'use client'

import ContactForm from "@/app/[locale]/_components/ContactForm/ContactForm";
import { fetchAPI } from "@/app/[locale]/_utils/utils";
import React, { useState, useEffect } from 'react';

const MPU = ({ imageBannerClass, type }) => {
    const [banner, setBanner] = useState();
    const [showForm, setIsShowForm] = useState(false);

    const handleShowForm = (value) => {
        setIsShowForm(value);
    };

    useEffect(() => {
        const getBanner = async () => {
            const res = await fetchAPI(`/banner?type=${type}`, 'noCache');

            const data = res?.data
            const randomIndex = Math.floor(Math.random() * data.length);

            const title = data[randomIndex]?.attributes?.title;
            const projectInterested = data[randomIndex]?.attributes?.project_interested;
            const ctaButtonText = data[randomIndex]?.attributes?.cta_button_text;
            const formTitle = data[randomIndex]?.attributes?.form_title;
            const visualURL = data[randomIndex]?.attributes?.visual?.data?.attributes?.url;
            const visualAlternativeText = data[randomIndex]?.attributes?.visual?.data?.attributes?.alternativeText || title;
            const colorOfButton = data[randomIndex]?.attributes?.color_of_button
            const colorOfText = data[randomIndex]?.attributes?.color_of_text

            setBanner({
                title,
                projectInterested,
                ctaButtonText,
                formTitle,
                visualURL,
                visualAlternativeText,
                colorOfButton,
                colorOfText
            });
        };

        getBanner();
    }, []);

    return (
        <>
        {showForm && (
            <ContactForm 
            title={banner.formTitle}
            setContactFormModal={setIsShowForm}
            type="roadshow"
            projectName={banner.projectInterested}
            pageName={window.location.href}
            removeLanguage={true}
            isUK={false}
            closeOnClickOutside={false}
            />
        )}
        {banner && (
            <div className={`mpu ${imageBannerClass || ''}`} onClick={handleShowForm}>
                <img src={banner.visualURL} alt={banner.visualAlternativeText} />
                <button style={{color: banner.colorOfText, background: banner.colorOfButton}} className="mpuButton">
                    {banner.ctaButtonText || 'Learn More'}
                </button>
                {/* Added image positioned at the top right */}
                <img src="/ad.svg" alt="Add" className="adImage" style={{width: '42px'}} />
            </div>
        )}
        </>
    );
};

export default MPU;