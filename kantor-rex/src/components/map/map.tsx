import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import styles from "./map.module.scss";
import axios from "axios";
import { MarkerData } from "../interfaces";

const center = { lat: 54.465336805884164, lng: 17.02574142924235 };

function  Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  })

  const [markers, setMarkers] = useState<MarkerData[]>([]);

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
        title: marker.name,
      });
    });
  };
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className={styles.root}>
      <div className={styles.map}>
        <GoogleMap
          zoom={13}
          center={center}
          mapContainerClassName={styles.map_container}
          options={mapOptions}
          onLoad={onLoad}
        >
          {markers.map((marker, key) => (
            <Marker key={key} position={{ lat: marker.lat, lng: marker.lng }} />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default React.memo(Map)
