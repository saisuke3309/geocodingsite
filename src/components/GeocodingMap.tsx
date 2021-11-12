import React, { useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { GoogleMap,  LoadScript, Marker } from "@react-google-maps/api";
import { readFileAsText, mapCSVToArray } from './helpers';
import { mapArrayToNisyotenItem, NisyotenItem } from "../types/NisyotenItem";
import CustomMarkerOptions from "../types/CustomMarkerOptions";
import CustomMarker from "./CustomMarker";
import CustomInfoWindowOptions from "../types/CustomInfoWindowOptions";
import CustomInfoWindow from "./CustomInfoWindow";

/**
 * Mapに使用するプロパティ
 */
 interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  options?: google.maps.MapOptions;
}

class LocationProps {
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  label?: string;
  isShowMarker: boolean;

  constructor(){
    this.address = '';
    this.location = {
      lat: 0,
      lng: 0,
    }
    this.isShowMarker = false;
  }
}

/**
 * MapのPropsの初期値
 */
 const containerStyle = {
  height: "100vh",
  width: "100%",
}

const initialMap: MapProps = {
  center: {
    lat: 38.240567493884434,
    lng: 140.36396563273115,
  },
  zoom: 12,
  // options: {
  //   styles: [{
  //     featureType: "all",
  //     elementType: "labels",
  //     stylers: [
  //       { "visibility": "off" }
  //     ],
  //   }]
  // },
};

const initLocation : CustomMarkerOptions = {
  label :{
    text: "",
  },
  address: "",
  location : {
    lat: 0,
    lng: 0,
  },
  isShowMarker: false,
}

const initWindowOptions: CustomInfoWindowOptions = {
  objectName : "",
  location : {
    lat: 0,
    lng: 0,
  },
  locationLabel: "",
  isShowWindow: false,
}

const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * APIキー
 */
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';

var ninsyotenList = new Array<NisyotenItem>();

const GeocodingMap = () => {
  const [mapProps, setMapProps] = useState<MapProps>(initialMap);
  const [locProps, setLocProps] = useState<CustomMarkerOptions>(initLocation);
  const [windowProps, setWindowProps] = useState<CustomInfoWindowOptions>(initWindowOptions);
  const [size, setSize] = useState<undefined | google.maps.Size>(undefined);
  const [csvFile, setCsvFile] = useState<Blob>(new Blob());
  const [ninsyotenListState, setNinsyotenListState] = useState<NisyotenItem[]>([]);
  const [isShwowPins, setIsShowPins] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [nowCount, setNowCount] = useState(0);
  const [geocodeTarget, setGeocodeTarget] = useState("");
 
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  }

  /**
   * テキストボックスに入力した住所でジオコーディング
   */
  const geocodingTest = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({address: geocodeTarget}, (results, status) => {
      if (status === 'OK' && results != null) {
        var markerOption : CustomMarkerOptions = {
          address: geocodeTarget,
          location: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          },
          label: {
            text: '',
          },
          isShowMarker: true,
        }
        setLocProps(markerOption);

        var windowOption: CustomInfoWindowOptions = {
          objectName: geocodeTarget,
          location: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          },
          locationLabel: results[0].geometry.location.lat() + "," + results[0].geometry.location.lng(),
          isShowWindow: true,
        }
        setWindowProps(windowOption);

        var mapSettings : MapProps = {
          center: {
            lat: markerOption.location.lat,
            lng: markerOption.location.lng,
          },
          zoom: 18,
        }
        setMapProps(mapSettings);
      }
    });
  }

  /***
   * CSVファイルを読読み込み、配列ninsyotenListに変換する
   */
  const readCSV = async () => {
    try {
      const csv = await readFileAsText(csvFile);
      const arr = mapCSVToArray(csv);
      ninsyotenList = mapArrayToNisyotenItem(arr);
    } catch (error) {
      alert(error);
    }
  }

  /**
   * 住所情報を入力し、緯度経度に変換する
   * @param address 住所
   */
  const geocoding = async(address: string) : Promise<LocationProps> => {
    return new Promise<LocationProps>((resolve, reject) => {

      const geocoder = new window.google.maps.Geocoder();
      var location : LocationProps = {
        address: address,
        location: {
          lat: 0,
          lng: 0
        },
        isShowMarker: false
      }
  
      geocoder.geocode({address: address}, (results, status) => {
  
        if (status === 'OK' && results != null) {
          location  = {
            address: address,
            location: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            isShowMarker: true
          }
          resolve(location);
        }
        else {
          reject(location);
        }
      });
    });
  }

  /**
   * 住所情報リストをジオコーディングし、緯度経度に変換する
   */
  const geocodingAddressList = async() => {
    setTotalCount(ninsyotenList.length);
    for (var i = 0; i < ninsyotenList.length; i++) {      
      setNowCount(i+1);
      var loc = await geocoding(ninsyotenList[i].shisetsuAddress1);
      if (loc) {
        ninsyotenList[i].locationlat = loc.location.lat;
        ninsyotenList[i].locationlng = loc.location.lng;
      }

      await _sleep(1000);
    }
    setNinsyotenListState(ninsyotenList);
  }

  /**
   * 読み込んだファイルをジオコーディングし、緯度経度に変換する
   */
  const mappingFromCsv = async() => {
    // 一連の処理で値を受け渡す場合は、戻り値で受け取って処理するか、グローバル変数に入れる
    // Stateは非同期処理なので、Stateへの格納が終わる前に次の処理に行ってしまう
    await readCSV();
    await geocodingAddressList();
    setIsShowPins(true);
  }

  /**
   * inputタグに入力されたファイルを読み込み、バイナリデータcsvFileで保持
   * @param event inputタグのonChangeイベント
   * @returns なし
   */
  const getFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return;
    }
    const file = event.target.files[0];
    if (file === null) {
      return;
    }
    let imgTag = document.getElementById("")
    setCsvFile(file);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div>
        <p>CSVファイルを選択してください。</p>
        <input type="file" accept="text/csv" onChange={getFile} />
        <button onClick={() => mappingFromCsv()}>CSVを読み込んでマッピング</button>
        <span>{nowCount}/{totalCount}</span>
      </div>
      <div>
        <CSVLink data={ninsyotenListState}>ダウンロード</CSVLink>
      </div>
      <br/>
      <div>
        <input type="text" onChange={e => setGeocodeTarget(e.target.value)}/>
        <button onClick={() => geocodingTest()}>Geocodingを試す</button>
      </div>
      <LoadScript googleMapsApiKey={API_KEY} onLoad={() => createOffsetSize()}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapProps.center}
          zoom={mapProps.zoom}
          options={mapProps.options}>
          {locProps.isShowMarker && <CustomMarker options={locProps} />}
          {windowProps.isShowWindow && <CustomInfoWindow options={windowProps}/>}
          {isShwowPins &&  ninsyotenListState.map((ninsyoten, index) => (
            <Marker
              key={index}
              label={ninsyoten.shisetsuName}
              position={new google.maps.LatLng(ninsyoten.locationlat, ninsyoten.locationlng)}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GeocodingMap;