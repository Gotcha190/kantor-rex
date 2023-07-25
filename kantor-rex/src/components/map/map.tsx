import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import styles from "./map.module.scss";
import classNames from "classnames";
import axios from "axios";

export interface MapProps {
  className?: string;
}
interface MarkerData {
  id: number;
  lat: number;
  lng: number;
  title: string;
}

const center = { lat: 54.465336805884164, lng: 17.02574142924235 };
const defaultMarkers: MarkerData[] = [
  {id: 1, lat: 64.45232, lng: 17.04403, title: "Akademik"},
  {id: 2, lat: 54.46118, lng: 25.04829, title: "Uczelnia"},
];

function  Map({ className }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  })

  const [markers, setMarkers] = useState<MarkerData[]>(defaultMarkers);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/kantor-data"); // Wywołanie endpointu na serwerze Node.js
        setMarkers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []); 

  
  // Ukrycie punktów zainteresowania (POI)
  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }], 
      },
    ],
  };

  const onLoad = (map: any) => {
    // Ładuje markery na mapę z danych pobranych z bazy danych lub domyślnych danych.
    markers.forEach((marker) => {
      new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: map,
        title: marker.title,
      });
    });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.map}>
        <GoogleMap
          zoom={13}
          center={center}
          mapContainerClassName={classNames(styles.map_container, className)}
          options={mapOptions}
          onLoad={onLoad}
        >
          {markers.map((marker) => (
            <Marker key={marker.id} position={{ lat: marker.lat, lng: marker.lng }} />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default React.memo(Map)
