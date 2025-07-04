'use client';

import { useSelector } from "react-redux";
import SpotlightServer from "./SpotlightServer";

const SpotlightClient = (props) => {
  const currency = useSelector((state) => state.currency.value);
  const areaUnit = useSelector((state) => state.areaUnit.value);

  return <SpotlightServer {...props} currency={currency} areaUnit={areaUnit} />;
};

export default SpotlightClient;