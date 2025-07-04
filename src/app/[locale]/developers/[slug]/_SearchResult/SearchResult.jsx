import OffplanPropertyCard from "@/app/[locale]/_components/PropertyCard/OffplanPropertyCard";
import Banner from '@/app/[locale]/_components/Banner/Banner'

const SearchResult = ({searchData, locale}) => {

    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : 'ltr'

    const renderPropertiesWithBanner = () => {
        const elements = []
        searchData?.data?.forEach((item, index) => {
            elements.push(
                <div className={`item ar`} key={item?.id}>
                    <OffplanPropertyCard data={item} />
                </div>
            )
            // After every 3 items (except if it is the last group), insert the special element
            if ((index + 1) % 3 === 0 && index !== searchData.data.length - 1) {
                elements.push(<Banner type={'MPU'} key={`banny-${index}`} />)
            }
        })
        return elements
    }

    // Determine additional grid class based on the number of items.
    const listingsClass =
    searchData?.data?.length >= 4 ? "listings center" : "listings center grid-three";
    
    return (
        <div className="searchResults" id="searchResults" dir={direction}>
            <div className="mainContainer">
                <div className="leftContainer">
                    <div className={listingsClass}>
                        {renderPropertiesWithBanner()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchResult