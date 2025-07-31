# from fastapi import APIRouter
# import pickle
# import requests
# import numpy as np
# from typing import List
# from datetime import datetime

# router = APIRouter()

# # Load trained RandomForest model
# with open("rf_model.pkl", "rb") as f:
#     model = pickle.load(f)

# # Model metrics (mocked)
# model_metrics = [
#     {"name": "RandomForest", "accuracy": 0.88, "mae": 3.1, "rmse": 4.7}
# ]

# # Open-Meteo API configs
# LAT, LON = 27.7, 85.3  # Kathmandu
# OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
# WEATHER_PARAMS = ["temperature_2m", "relative_humidity_2m", "windspeed_10m", "surface_pressure"]

# def fetch_live_weather():
#     """Fetch current live weather data from Open-Meteo."""
#     params = {
#         "latitude": LAT,
#         "longitude": LON,
#         "current": ",".join(WEATHER_PARAMS)
#     }
#     response = requests.get(OPEN_METEO_URL, params=params)
#     response.raise_for_status()
#     data = response.json()["current"]
#     return data

# def build_feature_vector(weather_data):
#     """
#     Build feature vector expected by the model.
#     Example: [pm2.5_placeholder, temperature, humidity, windspeed, pressure]
#     """
#     pm25_placeholder = 50.0  # You can replace with real pm2.5 if available
#     return np.array([
#         pm25_placeholder,
#         weather_data["temperature_2m"],
#         weather_data["relative_humidity_2m"],
#         weather_data["windspeed_10m"],
#         weather_data["surface_pressure"]
#     ]).reshape(1, -1)

# @router.get("/current")
# def get_current_data():
#     """Get current weather data and dummy air quality."""
#     data = fetch_live_weather()
    
#     pm25 = 55.0
#     status = "Moderate"
#     return {
#         "airQuality": {
#             "pm25": pm25,
#             "status": status
#         },
#         "weather": {
#             "temperature": data["temperature_2m"],
#             "humidity": data["relative_humidity_2m"],
#             "windSpeed": data["windspeed_10m"],
#             "pressure": data["surface_pressure"]
#         }
#     }


# @router.get("/forecast")
# def get_forecast():
#     """Get 24h forecast from Open-Meteo."""
#     params = {
#         "latitude": LAT,
#         "longitude": LON,
#         "hourly": ",".join(WEATHER_PARAMS),
#         "forecast_days": 1
#     }
#     response = requests.get(OPEN_METEO_URL, params=params)
#     response.raise_for_status()
#     data = response.json()
#     return data["hourly"]

# @router.get("/models")
# def get_models():
#     """Return model metrics."""
#     return model_metrics

# @router.get("/predict/single")
# def predict_single():
#     """Predict single PM2.5 value."""
#     weather = fetch_live_weather()
#     X = build_feature_vector(weather)
#     y_pred = model.predict(X)
#     return {"pm25_prediction": float(y_pred[0])}

# @router.get("/predict/multi")
# def predict_multi():
#     """
#     Mock: predict next 24h PM2.5.
#     Since RandomForest is not sequence model, we simulate with repeated prediction.
#     """
#     weather = fetch_live_weather()
#     X = build_feature_vector(weather)
#     single_pred = model.predict(X)[0]
#     predictions = [float(single_pred + np.random.randn() * 2) for _ in range(24)]
#     timestamps = [
#         (datetime.utcnow().isoformat())
#         for _ in range(24)
#     ]
#     return {"predictions": list(zip(timestamps, predictions))}



from fastapi import APIRouter
import pickle
import requests
import numpy as np
from typing import List
from datetime import datetime
import random

router = APIRouter()

# Load trained RandomForest model
with open("rf_model.pkl", "rb") as f:
    model = pickle.load(f)

# Model metrics (mocked)
model_metrics = [
    {"name": "RandomForest", "accuracy": 0.88, "mae": 3.1, "rmse": 4.7}
]

# Open-Meteo API configs
LAT, LON = 27.7, 85.3  # Kathmandu
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
WEATHER_PARAMS = ["temperature_2m", "relative_humidity_2m", "windspeed_10m", "surface_pressure"]

def fetch_live_weather():
    """Fetch current live weather data from Open-Meteo."""
    params = {
        "latitude": LAT,
        "longitude": LON,
        "current": ",".join(WEATHER_PARAMS)
    }
    response = requests.get(OPEN_METEO_URL, params=params)
    response.raise_for_status()
    data = response.json()["current"]
    return data

def build_feature_vector(weather_data):
    pm25_placeholder = 50.0  # optional
    # create dummy values for the missing 10 features
    dummy_features = [0.0] * 10
    return np.array([
        pm25_placeholder,
        weather_data["temperature_2m"],
        weather_data["relative_humidity_2m"],
        weather_data["windspeed_10m"],
        weather_data["surface_pressure"],
        *dummy_features
    ]).reshape(1, -1)


@router.get("/current")
def get_current_data():
    """
    Get current weather and predict PM2.5 using trained model.
    """
    weather = fetch_live_weather()

    # Add small random fluctuation to simulate real-time changes
    weather["temperature_2m"] += random.uniform(-0.5, 0.5)
    weather["relative_humidity_2m"] += random.uniform(-2, 2)
    weather["windspeed_10m"] += random.uniform(-0.3, 0.3)
    weather["surface_pressure"] += random.uniform(-0.8, 0.8)

    X = build_feature_vector(weather)  # Build feature vector for model
    y_pred = model.predict(X)
    pm25 = round(float(y_pred[0]) + random.uniform(-2, 2), 2)  # Round to 2 decimal places

    # Determine status based on pm25
    if pm25 <= 12.0:
        status = "Good"
    elif pm25 <= 35.4:
        status = "Moderate"
    elif pm25 <= 55.4:
        status = "Unhealthy for Sensitive Groups"
    elif pm25 <= 150.4:
        status = "Unhealthy"
    elif pm25 <= 250.4:
        status = "Very Unhealthy"
    else:
        status = "Hazardous"

    return {
        "airQuality": {
            "pm25": pm25,
            "status": status
        },
        "weather": {
            "temperature": round(weather["temperature_2m"], 2),
            "humidity": round(weather["relative_humidity_2m"], 2),
            "windSpeed": round(weather["windspeed_10m"], 2),
            "pressure": round(weather["surface_pressure"], 2)
        }
    }

@router.get("/forecast")
def get_forecast():
    """Get 24h forecast from Open-Meteo."""
    params = {
        "latitude": LAT,
        "longitude": LON,
        "hourly": ",".join(WEATHER_PARAMS),
        "forecast_days": 1
    }
    response = requests.get(OPEN_METEO_URL, params=params)
    response.raise_for_status()
    data = response.json()
    return data["hourly"]


@router.get("/models")
def get_models():
    """Return model metrics."""
    return model_metrics

@router.get("/predict/single")
def predict_single():
    """Predict single PM2.5 value."""
    weather = fetch_live_weather()
    X = build_feature_vector(weather)
    y_pred = model.predict(X)
    return {"pm25_prediction": float(y_pred[0])}

@router.get("/predict/multi")
def predict_multi():
    """
    Mock: predict next 24h PM2.5.
    Since RandomForest is not sequence model, we simulate with repeated prediction.
    """
    weather = fetch_live_weather()
    X = build_feature_vector(weather)
    single_pred = model.predict(X)[0]
    predictions = [float(single_pred + np.random.randn() * 2) for _ in range(24)]
    timestamps = [
        (datetime.utcnow().isoformat())
        for _ in range(24)
    ]
    return {"predictions": list(zip(timestamps, predictions))}
