import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { formatNumberToArabic } from '../../_utils/utils';

const CommunitiesAndAreasCard = async ({ locale, title, logo, url, numberOfProjects, alternativeText, style = {}, key, description, showNumberOfProjects = true, className = '' }) => {

    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : 'ltr'
    
    const t = await getTranslations({locale, namespace: 'areas_and_communities'});

    const findStringToProjects = (numberOfProjects) => {
        const numberOfProjectsLocale = locale === 'ar' ? formatNumberToArabic(numberOfProjects) : numberOfProjects
        if(numberOfProjects === 1){
            return `${numberOfProjectsLocale} ${t('Project')}`
        } else if(numberOfProjects === 2){
            return `${t('two-projects')}`
        } else  return `${numberOfProjectsLocale} ${t('Projects')}`
    }

    const findStringToProjectsNoNumber = (numberOfProjects) => {
        if(numberOfProjects === 0){
            return t('read more')
        }
        else if(numberOfProjects === 1){
            return t('view project')
        } else if(numberOfProjects === 2){
            return t('view-two-projects')
        } else  return t('view all projects')
    }
    
    return (
        <div className={`communitiesAndAreasCard gradientBorder ${className}`} style={{...style}} key={key} dir={direction}>
            <div className="_top">
                <img className="_logo" src={logo ? logo.attributes.url : "/stage-default.png"} alt={alternativeText || title} />
            </div>
            <div className="_bottom">
                <div className="_content">
                    <span className="_title">{title}</span>
                    <p className="_description">{description}</p>
                    {showNumberOfProjects && (
                        isRTL ? 
                        <span className="_projects"><img className={`_image ${isRTL ? 'ar' : ''}`} src="/projects.svg" />{findStringToProjects(numberOfProjects)}</span>                        
                        :
                        <span className="_projects"><img className={`_image ${isRTL ? 'ar' : ''}`} src="/projects.svg" />{numberOfProjects} Project{numberOfProjects > 1 && 's'}</span>
                        )}
                </div>
                <div className="_view_more">
                    <Link className="_view_all_projects" href={url}>{findStringToProjectsNoNumber(numberOfProjects)} <img className={`_view_all_projects_image ${isRTL ? 'ar' : ''}`} src="/_seperator_white.svg" /></Link>
                </div>
            </div>
        </div>
    );
}

export default CommunitiesAndAreasCard;
