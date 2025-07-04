'use client'

import { Link } from '@/i18n/routing';

const AboutDeveloper = ({ developer }) => {
    
    const developer_name = developer?.data?.attributes?.developer_name
    const developer_description = developer?.data?.attributes?.developer_description
    const developer_logo_url = developer?.data?.attributes?.developer_logo?.data?.attributes?.url
    const developer_logo_alternativeText = developer?.data?.attributes?.developer_logo?.data?.attributes?.alternativeText
    const developer_slug = developer?.data?.attributes?.slug

    return (
        <div className="landing_aboutDeveloper">
            <div className="landing_wrapper">
                <div className="landing_parent landing_imageParent">
                    <img className="landing_developer_image" src={developer_logo_url} alt={developer_logo_alternativeText} />
                </div>
                <div className="landing_parent">
                    <div className='landing_container'>
                        <h2 className="landing_mainHeading">About The Developer - {developer_name}</h2>
                        <p className="landing_developer_description">{developer_description}</p>
                        <Link className='globalBtn generalButton' href={`/developers/${developer_slug}`}>View all developer projects</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutDeveloper;