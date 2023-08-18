import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import styles from "./map.module.scss";
import axios from "axios";
import { KantorData } from "@shared/interfaces";

function  Map({ selectedMarker }: { selectedMarker?: KantorData }) {
  const center = selectedMarker
    ? { lat: selectedMarker.lat, lng: selectedMarker.lng }
    : { lat: 54.465336805884164, lng: 17.02574142924235 };
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  })

  const [markers, setMarkers] = useState<KantorData[]>([]);

  useEffect(() => {
    // Jeśli selectedMarker nie istnieje, pobierz dane z bazy danych
    if (!selectedMarker) {
      async function fetchData() {
        try {
          const response = await axios.get("/api/kantor-data");
          setMarkers(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchData();
    }
  }, [selectedMarker]);

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
    markers.forEach((marker) => {
      new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: map,
        title: marker.company_name,
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
          {selectedMarker && (
            <Marker
              position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
              title={selectedMarker.company_name}
            />
          )}
          {markers.map((marker, key) => (
            <Marker key={key} position={{ lat: marker.lat, lng: marker.lng }} />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default React.memo(Map)
