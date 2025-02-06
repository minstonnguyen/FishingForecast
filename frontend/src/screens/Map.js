import React, { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import '../styles/Map.css';
import { useGoogleMaps } from "../GoogleMapContext";

const center = {
  lat: 37.7749, // Default latitude
  lng: -122.4194, // Default longitude
};

const Map = ({ selectedLocation }) => {
  const { isLoaded } = useGoogleMaps();

  const [mapClickLocation, setMapClickLocation] = useState(null);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMapClickLocation({ lat, lng });
    console.log("Selected Location:", { lat, lng });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerClassName="map-container"
        center={selectedLocation || center}
        zoom={10}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
        {mapClickLocation && <Marker position={mapClickLocation} />}
      </GoogleMap>
      {(selectedLocation || mapClickLocation) && (
        <div>
          <p className="coordinates">
            Latitude: {(selectedLocation || mapClickLocation).lat}
          </p>
          <p className="coordinates">
            Longitude: {(selectedLocation || mapClickLocation).lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default Map;