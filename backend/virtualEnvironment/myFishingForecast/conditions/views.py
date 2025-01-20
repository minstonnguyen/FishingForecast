from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry


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
	"daily": ["swell_wave_height_max", "swell_wave_period_max"],
	"length_unit": "imperial",
	"wind_speed_unit": "mph",
	"timezone": "America/Los_Angeles"
    }
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]

    daily = response.Daily()
    
    dailySwellWaveHeightMax = daily.Variables(0).ValuesAsNumpy()
    dailySwellWavePeriodMax = daily.Variables(1).ValuesAsNumpy()

    daily_data = {
    "date": pd.date_range(
        start=pd.to_datetime(daily.Time(), unit="s", utc=True),
        end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=daily.Interval()),
        inclusive="left"
        )
    }

    # Adding data columns
    daily_data["swell_wave_height_max"] = dailySwellWaveHeightMax
    daily_data["swell_wave_period_max"] = dailySwellWavePeriodMax

    # Convert to DataFrame
    daily_dataframe = pd.DataFrame(data=daily_data)
    
    return JsonResponse(daily_dataframe.to_dict(orient="list"))
# Create your views here.
