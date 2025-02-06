import React, { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// Create the context
const GoogleMapsContext = createContext();

// Custom hook to use the Google Maps context
export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};

// Context provider component
export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY, // Replace with your API key
    libraries: ['places', 'maps'], // Load both Places and Maps libraries
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};