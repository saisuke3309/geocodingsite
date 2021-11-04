import React, { useEffect, useState } from "react";
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import { markTimeline } from "console";

const csvPath = "../csv/list.csv";

/**
 * Mapに使用するプロパティ
 */
 interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  options: google.maps.MapOptions;
}

interface LocationProps {
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  isShowMarker: boolean;
}

/**
 * MapのPropsの初期値
 */
 const containerStyle = {
  height: "100vh",
  width: "100%",
}

const initialMapProps: MapProps = {
  center: {
    lat: 38.240567493884434,
    lng: 140.36396563273115,
  },
  zoom: 18,
  options: {
    styles: [{
      featureType: "all",
      elementType: "labels",
      stylers: [
        { "visibility": "off" }
      ],
    }]
  },
};

const initLocationProps : LocationProps = {
  address: "山形市松波4-5-12",
  location : {
    lat: 0,
    lng: 0,
  },
  isShowMarker: false
}


/**
 * APIキー
 */
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';

const GeocodingMap = () => {
  const [mapProps, setMapProps] = useState<MapProps>(initialMapProps);
  const [locProps, setLocProps] = useState<LocationProps>(initLocationProps);
  const [size, setSize] = useState<undefined | google.maps.Size>(undefined);
 
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  }

  const readCSVFile = () => {
    return;
  }

  const geocoding = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({address: initLocationProps.address}, (results, status) => {
      if (status === 'OK' && results != null) {
        var locationProps : LocationProps = {
          address: initLocationProps.address,
          location: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          },
          isShowMarker: true
        }
        setLocProps(locationProps);
      }
    });
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button onClick={() => geocoding()}>ボタン</button>
      <LoadScript googleMapsApiKey={API_KEY} onLoad={() => createOffsetSize()}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapProps.center}
          zoom={mapProps.zoom}
          options={mapProps.options}>
          {locProps.isShowMarker && <Marker position={locProps.location}/>}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GeocodingMap;