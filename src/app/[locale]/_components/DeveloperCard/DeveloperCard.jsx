import { Link } from "@/i18n/routing";
import { formatNumberToArabic } from "../../_utils/utils";
import { getTranslations } from 'next-intl/server';

const DeveloperCard = async ({ locale, title, logo, url, numberOfProjects, style = {}, key, alternativeText }) => {

    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : 'ltr'

    const t = await getTranslations({locale, namespace: 'developer_card'});
    
    return (
        <div className="_developerCard gradientBorder" style={{...style}} key={key}>
            <div className="_left">
                <img className="_logo" src={logo ? logo?.attributes?.url : "/stage-default.png"} alt={alternativeText || title} />
            </div>
            <div className="_right">
                <div className="_content">
                    <span className="_title">{title}</span>
                    {isRTL ? 
                    <span className="_projects"><img className="_image" src="/projects.svg" /> {formatNumberToArabic(numberOfProjects)} {t('Project')}</span>
                    :
                    <span className="_projects"><img className="_image" src="/projects.svg" />{numberOfProjects} Project{numberOfProjects > 1 && "s"}</span>
                }
                </div>
                <div className="_view_more">
                    <Link className="_view_all_projects" href={url}>{numberOfProjects > 1 ? t('view all projects') : t('view project')} <img className={`_view_all_projects_image ${isRTL ? 'ar' : ''}`} src="/_seperator_white.svg" /></Link>
                </div>
            </div>
        </div>
    );
}

export default DeveloperCard;
