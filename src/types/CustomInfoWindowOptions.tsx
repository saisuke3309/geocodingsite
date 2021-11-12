export type CustomInfoWindowOptions = {
  objectName: string;
  location: {
    lat: number;
    lng: number;
  };
  locationLabel?:string;
  isShowWindow: boolean;
}

export default CustomInfoWindowOptions;