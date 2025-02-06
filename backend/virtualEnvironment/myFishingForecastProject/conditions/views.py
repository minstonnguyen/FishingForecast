from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import openmeteo_requests
import requests_cache
import pandas as pd
import matplotlib.pyplot as plt
from retry_requests import retry
from io import BytesIO
import base64

plt.switch_backend('Agg')

def conditions(request):
    return HttpResponse("Hello World!")


#http://127.0.0.1:8000/getSwellData/?latitude=36.95553959503128&longitude=-122.0183745086243 test
@csrf_exempt
def getSwellData(request):
    cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)

    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')

    if not latitude or not longitude:
        return JsonResponse({'error': 'Latitude and Longitude are required'}, status=400)
    
    url = "https://marine-api.open-meteo.com/v1/marine"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": ["swell_wave_height", "swell_wave_period"],
        "length_unit": "imperial",
        "wind_speed_unit": "mph",
        "timezone": "America/Los_Angeles"
    }
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]

    hourly = response.Hourly()
    
    swellWaveHeightHourly = hourly.Variables(0).ValuesAsNumpy()
    swellWavePeriodHourly = hourly.Variables(1).ValuesAsNumpy()

    hourly_data = {
    "date": pd.date_range(
        start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
        end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=hourly.Interval()),
        inclusive="left"
        )
    }

    # Adding data columns
    hourly_data["swell_wave_height_hourly"] = swellWaveHeightHourly
    hourly_data["swell_wave_period_hourly"] = swellWavePeriodHourly

    # Convert to DataFrame
    hourly_dataframe = pd.DataFrame(data=hourly_data)
    
    
    fig, ax1 = plt.subplots(figsize=(10, 6))
    
    ax1.plot(hourly_dataframe["date"], hourly_dataframe["swell_wave_height_hourly"], color="blue", marker="o", label="Swell Wave Height(ft)")
    ax1.set_xlabel("Time(Hourly)", fontsize=12)
    ax1.set_ylabel("Swell Wave Height(ft)", fontsize=12)
    ax1.tick_params(axis="y", labelcolor="blue")
    ax1.grid=True
    
    ax2 = ax1.twinx()
    ax2.plot(hourly_dataframe["date"], hourly_dataframe["swell_wave_period_hourly"], color="green", marker="o", label="Swell Wave Period(s)")
    ax2.set_ylabel("Swell Wave Period(s)", fontsize=12)
    ax2.tick_params(axis="y", labelcolor="green")
    
    plt.title("Swell Wave Data", fontsize=16)
    fig.tight_layout()

    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    plt.close(fig)
    buffer.seek(0)
    imageBase64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    hourly_dataframe["swell_wave_image"] = imageBase64
    
    return JsonResponse(hourly_dataframe.to_dict(orient="list"))


def getWeatherData(request):
    cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)

    # Make sure all required weather variables are listed here
    # The order of variables in hourly or daily is important to assign them correctly below

    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')

    if not latitude or not longitude:
        return JsonResponse({'error': 'Latitude and Longitude are required'}, status=400)
    
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": ["temperature_2m", "precipitation_probability", "cloud_cover", "wind_speed_10m"],
        "temperature_unit": "fahrenheit",
        "wind_speed_unit": "mph",
        "precipitation_unit": "inch"
    }
    responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]
    # Process hourly data. The order of variables needs to be the same as requested.
    hourly = response.Hourly()
    hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
    hourly_precipitation_probability = hourly.Variables(1).ValuesAsNumpy()
    hourly_cloud_cover = hourly.Variables(2).ValuesAsNumpy()
    hourly_wind_speed_10m = hourly.Variables(3).ValuesAsNumpy()

    hourly_data = {"date": pd.date_range(
        start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
        end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
        freq = pd.Timedelta(seconds = hourly.Interval()),
        inclusive = "left"
    )}

    hourly_data["temperature_2m"] = hourly_temperature_2m
    hourly_data["precipitation_probability"] = hourly_precipitation_probability
    hourly_data["cloud_cover"] = hourly_cloud_cover
    hourly_data["wind_speed_10m"] = hourly_wind_speed_10m

    hourly_dataframe = pd.DataFrame(data = hourly_data)
    
    # Plotting
    fig, ax1 = plt.subplots(figsize=(10, 6))

    # Plot temperature on the primary y-axis
    ax1.plot(hourly_dataframe["date"], hourly_dataframe["temperature_2m"], color="blue", marker="o", label="Temperature (°F)")
    ax1.set_xlabel("Time (Hourly)", fontsize=12)
    ax1.set_ylabel("Temperature (°F)", fontsize=12)
    ax1.tick_params(axis="y", labelcolor="blue")
    ax1.grid(True)

    # Create a secondary y-axis for precipitation probability
    ax2 = ax1.twinx()
    ax2.plot(hourly_dataframe["date"], hourly_dataframe["precipitation_probability"], color="green", marker="o", label="Precipitation Probability (%)")
    ax2.set_ylabel("Precipitation Probability (%)", fontsize=12)
    ax2.tick_params(axis="y", labelcolor="green")

    # Create a tertiary y-axis for cloud cover
    ax3 = ax1.twinx()
    ax3.spines["right"].set_position(("axes", 1.1))  # Adjust the position of the third axis
    ax3.plot(hourly_dataframe["date"], hourly_dataframe["cloud_cover"], color="red", marker="o", label="Cloud Cover (%)")
    ax3.set_ylabel("Cloud Cover (%)", fontsize=12)
    ax3.tick_params(axis="y", labelcolor="red")

    # Create a quaternary y-axis for wind speed
    ax4 = ax1.twinx()
    ax4.spines["right"].set_position(("axes", 1.2))  # Adjust the position of the fourth axis
    ax4.plot(hourly_dataframe["date"], hourly_dataframe["wind_speed_10m"], color="purple", marker="o", label="Wind Speed (mph)")
    ax4.set_ylabel("Wind Speed (mph)", fontsize=12)
    ax4.tick_params(axis="y", labelcolor="purple")

    # Title and layout
    plt.title("Hourly Weather Data", fontsize=16)
    fig.tight_layout()

    # Combine legends from all axes
    lines, labels = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    lines3, labels3 = ax3.get_legend_handles_labels()
    lines4, labels4 = ax4.get_legend_handles_labels()
    ax1.legend(lines + lines2 + lines3 + lines4, labels + labels2 + labels3 + labels4, loc="upper left")

    # Save the plot to a buffer
    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    plt.close(fig)
    buffer.seek(0)

    # Encode the image to base64
    imageBase64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    # Add the image to the DataFrame
    hourly_dataframe["weather_plot_image"] = imageBase64

    # Return the DataFrame as a JSON response
    return JsonResponse(hourly_dataframe.to_dict(orient="list"))