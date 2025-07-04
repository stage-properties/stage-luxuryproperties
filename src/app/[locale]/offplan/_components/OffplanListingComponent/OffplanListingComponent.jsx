import Pagination from "@/app/[locale]/_components/Pagination/Pagination";
import OffplanPropertyCard from "@/app/[locale]/_components/PropertyCard/OffplanPropertyCard";
import React from "react";

const OffplanListingComponent = ({offplanData}) => {
  return (
    <div className="offplanListingComponent">
      <div className="wrapper">
        <div className="mainContainer">
          <div className="listings">
            {
                offplanData?.data?.map((item) => (
                    <div className="item" key={item?.id}>
                    <OffplanPropertyCard data={item}/>
                  </div>
                ))
            }
          </div>
        </div>
        {
          offplanData?.meta?.pagination?.pageCount>1&&
        <Pagination pageDetails={offplanData?.meta?.pagination} searchParams={searchParams}/>
        }
      </div>
    </div>
  );
};

export default OffplanListingComponent;
