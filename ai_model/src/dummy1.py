import os
import argparse
import joblib
import pandas as pd
import requests
import time
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# ==========================
# CONFIG VARIABLES
# ==========================
with open("config.json") as f:
    config = json.load(f)

CLIENT_ID = config["client_id"]
CLIENT_SECRET = config["client_secret"]
THING_ID = config["thing_id"]
PROPERTY_ID = config["property_id"]
WEATHER_API_KEY = config["weather_api_key"]
LOCATION = config["location"]

CSV_FILE_PATH = "weather.csv"
MODEL_FILE_PATH = "rain_predictor_model.joblib"

# ==========================
# Arduino IoT Cloud OAuth
# ==========================
def get_access_token():
    url = "https://api2.arduino.cc/iot/v1/clients/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "audience": "https://api2.arduino.cc/iot"
    }
    r = requests.post(url, headers=headers, data=data)
    if r.status_code == 200:
        return r.json()["access_token"]
    else:
        print("❌ Failed to fetch token:", r.text)
        return None

# ==========================
# Update Arduino Cloud
# ==========================
def update_arduino_cloud(value):
    token = get_access_token()
    if token is None:
        return

    url = f"https://api2.arduino.cc/iot/v2/things/{THING_ID}/properties/{PROPERTY_ID}/publish"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {"value": bool(value)}

    r = requests.put(url, headers=headers, json=payload)
    if r.status_code == 200:
        print(f"✅ Sent rain_pred={value} to Arduino IoT Cloud")
    else:
        print(f"❌ Failed to send data:", r.text)

# ==========================
# Real-time weather (optional)
# ==========================
def get_real_time_weather_data(api_key, location):
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={location}"
    try:
        r = requests.get(url)
        if r.status_code == 200:
            data = r.json()
            return {
                "last_day_temp_max": data["current"]["temp_c"],
                "last_day_temp_min": data["current"]["temp_c"],  # temp min not in API, using current temp
                "last_day_rain": 1 if data["current"]["precip_mm"] > 0 else 0
            }
        else:
            print("❌ Weather API error:", r.text)
            return None
    except Exception as e:
        print("❌ Weather API failed:", e)
        return None

# ==========================
# Train Model
# ==========================
def train_model():
    if not os.path.exists(CSV_FILE_PATH):
        print(f"❌ CSV file not found at {CSV_FILE_PATH}")
        return

    df = pd.read_csv(CSV_FILE_PATH)

    # Create target variable
    df['did_it_rain'] = (df['precipitation_sum'] > 0).astype(int)

    # Create lagged features for prediction (previous day)
    df['last_day_temp_max'] = df['temperature_2m_max'].shift(1)
    df['last_day_temp_min'] = df['temperature_2m_min'].shift(1)
    df['last_day_rain'] = df['did_it_rain'].shift(1)
    df.dropna(inplace=True)

    X = df[['last_day_temp_max', 'last_day_temp_min', 'last_day_rain']]
    y = df['did_it_rain']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    os.makedirs("model", exist_ok=True)
    joblib.dump(model, MODEL_FILE_PATH)
    print(f"✅ Model trained & saved at {MODEL_FILE_PATH}")

# ==========================
# Predict Today & Update Cloud (dummy always 1)
# ==========================
def predict_today():
    # Always send 1 (no rain) regardless of model or API
    prediction = 1
    print("🌤️ Dummy prediction: rain_pred = 1")
    
    # Send prediction to Arduino IoT Cloud
    update_arduino_cloud(prediction)


# ==========================
# Continuous loop for 12-hour updates
# ==========================
def run_continuously():
    while True:
        print("⏱️ Running prediction and updating Arduino Cloud...")
        predict_today()
        print("🛌 Sleeping for 12 hours...")
        time.sleep(12 * 60 * 60)  # 12 hours in seconds

# ==========================
# Main CLI
# ==========================
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", action="store_true", help="Train the rainfall prediction model")
    parser.add_argument("--predict", action="store_true", help="Predict today's rain and update Arduino IoT Cloud")
    parser.add_argument("--continuous", action="store_true", help="Run prediction every 12 hours continuously")
    args = parser.parse_args()

    if args.train:
        train_model()
    elif args.predict:
        predict_today()
    elif args.continuous:
        run_continuously()
    else:
        print("⚠️ Use --train, --predict, or --continuous")
