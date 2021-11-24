import React, { useEffect, useState } from "react";
import { Marker } from "@react-google-maps/api";
import { CustomMarkerOptions } from "../types/CustomMarkerOptions";


// const divStyle = {
//   background: "white",
//   fontSize: 7.5,
// }

type infoMarkerOptionsPropsType = {
  options: CustomMarkerOptions;
}

const CustomMarker = (optionsProps: infoMarkerOptionsPropsType) => {
  const {options} = optionsProps;
  return (
    <Marker
      position={options.location}
      label={options.label}
    />
  );
};

export default CustomMarker;