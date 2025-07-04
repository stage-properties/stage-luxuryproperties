import React from 'react'
import SecondarySearch from './components/secondarySearch/SecondarySearch'
import SecondaryResults from './components/secondaryResults/SecondaryResults'
import { fetchMinMaxAreas, fetchSecondaryProperties } from '@/app/[locale]/(dubai)/[offeringType]/service'
import { secondary_secondaryQueryGeneratorAndWordChecker, secondaryQueryGeneratorAndWordChecker } from '@/app/[locale]/_utils/utils'
import { fetchMinMaxPrices } from '@/app/[locale]/(dubai)/[offeringType]/service'
import SortBy from './components/SortBy/SortBy'

const SecondaryCommonPage = async ({params, searchParams, locale}) => {

    // const query = secondaryQueryGeneratorAndWordChecker(params)
    const query = secondary_secondaryQueryGeneratorAndWordChecker(params, searchParams)
    const secondaryProperties = await fetchSecondaryProperties(query?.query + `&locale=en`)

    // in order to fetch minMaxPrices we need to preper the params
    const {offeringType, 'param-1': param1} = params
    const _offeringType = offeringType === 'buy' ? 'sale' : 'rent'
    const minMaxPrices = await fetchMinMaxPrices({offeringType: _offeringType, categoryName: param1})
    const minMaxAreas = await fetchMinMaxAreas({offeringType: _offeringType, categoryName: param1})
    const configuration = minMaxPrices?.configuration

    // BUY: searchType=scndry&&offer=sale&ctg=residential&&pg=1
    // RENT: searchType=scndry&&offer=rent&ctg=residential&&pg=1
    // COMMERCIAL BUY: searchType=scndry&&offer=sale&ctg=commercial&&pg=1
    // COMMERCIAL RENT: 'searchType=scndry&&offer=rent&ctg=commercial&&pg=1'

  return (
    <div className='secondaryCommonPage'>
      <SortBy params={params} searchParams={searchParams} />
      <SecondarySearch params={params} searchParams={searchParams} minMaxPrices={minMaxPrices} minMaxAreas={minMaxAreas} configuration={configuration} secondaryProperties={secondaryProperties} />
      <SecondaryResults secondaryProperties={secondaryProperties} params={params} searchParams={searchParams} />
    </div>
  )
}

export default SecondaryCommonPage