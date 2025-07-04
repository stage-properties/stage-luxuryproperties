import React from "react";
import Mainpage from "../_component/Mainpage";
import { notFound } from "next/navigation";

const handle404 = (params) => {

  if(params?.offeringType?.toLowerCase() !== 'rent' && params?.offeringType?.toLowerCase() !== 'buy') notFound()
  if(params['params-1'].toLowerCase() !== 'commercial' && params['params-1'].toLowerCase() !== 'residential' ) notFound()

}

const page = ({params, searchParams}) => {

  handle404(params)

  return (
    <Mainpage params={params} searchParams={searchParams} />
  );
};

export default page;
