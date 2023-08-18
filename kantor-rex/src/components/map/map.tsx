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

  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
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
        >
          {selectedMarker && (
            <Marker
              position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
              title={selectedMarker.company_name}
            />
          )}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.company_name}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default React.memo(Map)
