import React, { useState, useRef } from "react";
import '../styles/FishingForecast.css';
import Maps from './Map';
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../GoogleMapContext";
import {addLoaderStyles, createLoader} from "../components/Loader"
const FishingForecast = () => {

  const [searchLocation, setSearchLocation] = useState(null);
  const autocompleteRef = useRef(null);
  const { isLoaded } = useGoogleMaps();
  // Load Google Maps API (including Places API)
  
  const onButtonPressed = () => {
    addLoaderStyles();
    const loader = createLoader();
    const container = document.getElementById("wrapper");
    if (!container)
    {
      return;
    }
    container.appendChild(loader);
  }
  const onPlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        setSearchLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="wrapper" id="wrapper">
        <h1 className="hook">Let's plan a fishing trip. Where to?</h1>
        <div className="search-wrapper">
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={onPlaceSelect}
          >
            <input
              type="text"
              className="search-input"
              placeholder="Search for a location..."
            />
          </Autocomplete>
        </div>
        <Maps selectedLocation={searchLocation}></Maps>
        <div className="button-wrapper">
          <button onClick={onButtonPressed}>
              Get Fishing Forecast
          </button> 
        </div>
        
      </div>
    </div>
  );
};

export default FishingForecast;