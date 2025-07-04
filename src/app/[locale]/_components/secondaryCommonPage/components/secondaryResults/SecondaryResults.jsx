import NoData from '@/app/[locale]/_components/NoData/NoData'
import Pagination from '@/app/[locale]/_components/Pagination/Pagination'
import PropertyCard from '@/app/[locale]/_components/PropertyCard/PropertyCard'
import { fetchAPI } from '@/app/[locale]/_utils/utils'
import React from 'react'
import Banner from '@/app/[locale]/_components/Banner/Banner'

const SecondaryResults = async ({ secondaryProperties, params, searchParams }) => {
  const { locale } = params

  const isRTL = locale === 'ar'

  params.offeringType = params.offeringType === 'buy' ? 'sale' : 'rent'
  const _query = `searchType=scndry&&offer=${params.offeringType}&ctg=${params['param-1']}&&pg=1`

  const renderPropertiesWithBanner = () => {
    const elements = []
    secondaryProperties.data.forEach((item, index) => {
      // Render the property card
      elements.push(
        <div className="item" key={item?.id}>
          <PropertyCard
            data={item}
            configuration={secondaryProperties?.configuration}
          />
        </div>
      )
      // After every 3 items (except if it is the last group), insert the special element
      if ((index + 1) % 3 === 0 && index !== secondaryProperties.data.length - 1) {
        elements.push(<Banner type={'MPU'} key={`banny-${index}`} />)
      }
    })
    return elements
  }

  return (
    <div
      className="wrapper secondarySearchResults"
      style={{ width: 'calc(94.5% + 30px)' }}
      id="searchResults"
      dir={isRTL? 'rtl' : 'ltr'}
    >
      {secondaryProperties?.data?.length ? (
        <>
          <div className="properties">
            {/* Banner image with a centered button */}
            <Banner type={'HP'} />
            {/* Property cards with interleaved banner element every 2 items */}
            {renderPropertiesWithBanner()}
          </div>
          <Pagination
            pageDetails={secondaryProperties?.meta?.pagination}
            searchParams={searchParams}
            params={params}
          />
        </>
      ) : (
        <NoData query={_query} locale={locale} />
      )}
    </div>
  )
}

export default SecondaryResults