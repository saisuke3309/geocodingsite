export type CustomMarkerOptions = {
  address?: string;
  label?: google.maps.MarkerLabel;
  location: {
    lat: number;
    lng: number;
  };
  isShowMarker: boolean;
}

export default CustomMarkerOptions;