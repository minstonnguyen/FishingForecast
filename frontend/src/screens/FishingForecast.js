import React, { useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import '../styles/FishingForecast.css';
import Maps from './Map';
import ForecastResults from "./ForecastResults";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../GoogleMapContext";
import {addLoaderStyles, createLoader} from "../components/Loader"
const FishingForecast = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const autocompleteRef = useRef(null);
  const { isLoaded } = useGoogleMaps();
  var isFetchingConditionData = false;
  // Load Google Maps API (including Places API)
  
  const onButtonPressed = () => {
    if (!searchLocation)
    {
      alert("Please select location first!");
      return;
    }
    addLoaderStyles();
    const loader = createLoader();
    const container = document.getElementById("wrapper");
    if (!container)
    {
      return;
    }
    if (!isFetchingConditionData)
    {
      container.appendChild(loader);
      isFetchingConditionData = true;
      getFishingForecast();
    }
  }

  const getFishingForecast = async() => {
    const {lat, lng} = searchLocation;
    const baseURL = "http://127.0.0.1:8000";
    try{
      const[swellResponse, moonResponse, weatherResponse] = await Promise.all([
        fetch(`${baseURL}/getSwellData/?latitude=${lat}&longitude=${lng}`),
        fetch(`${baseURL}/getMoonData/?latitude=${lat}&longitude=${lng}`),
        fetch(`${baseURL}/getWeatherData/?latitude=${lat}&longitude=${lng}`)
      ]);
      if (swellResponse.ok && moonResponse.ok && weatherResponse.ok) {
        const [swellData, moonData, weatherData] = await Promise.all([
          swellResponse.json(),
          moonResponse.json(),
          weatherResponse.json(),
        ]);
        
        setForecastData({swellData, moonData, weatherData});
        navigate("/forecastresults", { state: { swellData, moonData, weatherData } });
      }
      else {
        alert("One of the requests failed.");
      }
      
    }
    catch (error){
      alert(error);
    }
    finally{
      isFetchingConditionData = false;
    }


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
        <Maps selectedLocation={searchLocation} onLocationSelect={setSearchLocation}></Maps>
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