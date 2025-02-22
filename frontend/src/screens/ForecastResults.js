import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/ForecastResults.css";

const ForecastResults = () => {
  const location = useLocation();
  const { swellData, moonData, weatherData } = location.state || {};
  const swellImage = swellData?.swell_wave_image?.[0];
  // Function to render table rows for the swellData
  const renderTableRows = (data) => {
    return data?.date?.map((date, index) => (
      <tr key={index}>
        <td>{date}</td>
        <td>{data.swell_wave_height_hourly ? data.swell_wave_height_hourly[index] : "N/A"}</td>
        <td>{data.swell_wave_period_hourly ? data.swell_wave_period_hourly[index] : "N/A"}</td>
      </tr>
    ));
  };

  return (
    <div className="forecast-results-wrapper">
      <h2 className="forecast-text">Forecast Results</h2>
      <div className="forecast-results-container">
        <div className="left-side-container">
          {swellData && weatherData ? (
            <div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Wave Height</th>
                      <th>Wave Period</th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows(swellData)}</tbody>
                </table>
              </div>

              <h3>Weather Data:</h3>
              <pre>{JSON.stringify(weatherData, null, 2)}</pre>

              <h3>Moon Data:</h3>
              <pre>{JSON.stringify(moonData, null, 2)}</pre>
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </div>

        <div className="right-side-container">
          <div className="images-container">
            {swellImage && <img src={`data:image/png;base64,${swellImage}`} alt="Swell Graph" />}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastResults;
