# Tailwind Dashboard (Minimal)

This is a minimal React + Vite scaffold that uses Tailwind CSS to render a simple dashboard UI with 6 cards showing placeholder sensor data.

Quick start (Windows PowerShell):

```powershell
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

Files of interest:
- `src/App.jsx` - Dashboard UI with 6 cards
- `src/index.css` - Tailwind imports
- `index.html` - Vite entry

Notes:
- This project uses Tailwind CSS; install dependencies with `npm install` before running.
- All data is dummy/placeholder in `src/App.jsx`.
 
Configuring real-time data from Arduino Cloud
 - The app can poll your Arduino Cloud endpoint every 5 seconds. Set these environment variables in a `.env` file at the project root:

```
VITE_IOT_URL="https://your-arduino-cloud-endpoint"
VITE_IOT_API_KEY="optional_api_key_if_required"
```

 - Restart the dev server after adding `.env`. The dashboard will map common JSON fields like `temperature`, `humidity`, `soilMoisture`, `rainfallPrediction`, `waterLevel`, and `motorStatus` (it also accepts common alternates such as `temp`, `soil`, `rainFlag`, `water`, `motorOn`).

Simulate mode (offline development)
- The dashboard includes a `Simulate` mode (button in the header) that generates random values every 5s. Use this when your Arduino Cloud is unavailable or for UI testing. Toggle back to `Live` to resume polling your endpoint.

MQTT (real-time) support
- The app can connect to an MQTT broker over WebSocket for real-time updates. Set these environment variables in `.env`:

```
VITE_MQTT_URL="wss://your-mqtt-broker:port"   # must be ws:// or wss:// for browser
VITE_MQTT_TOPIC="your/topic/here"

Authentication (Arduino IoT Cloud)
- Arduino IoT Cloud MQTT requires username and a device secret as the password. Set these env vars if needed:

```
VITE_MQTT_USERNAME="your_arduino_username"
VITE_MQTT_PASSWORD="your_device_secret"
VITE_IOT_CLIENT_ID="<client_id_from_arduino>"      # optional, the clientId to use
VITE_IOT_CLIENT_SECRET="<client_secret>"           # optional
```

You can find the device secret in your Thing's Device settings in the Arduino IoT Cloud. Use the username you log in with as `VITE_MQTT_USERNAME`.

OAuth token (client_credentials)
- If your Arduino setup requires OAuth client_credentials to obtain an access token for HTTP polling, set the token endpoint and client credentials in `.env`:

```
VITE_OAUTH_TOKEN_URL="https://your-oauth-provider/token"
VITE_IOT_CLIENT_ID="your_client_id"
VITE_IOT_CLIENT_SECRET="your_client_secret"
```

The app will request a token using client_credentials, cache it, and attach it as a Bearer token to `VITE_IOT_URL` requests.
```

If `VITE_MQTT_URL` and `VITE_MQTT_TOPIC` are set and the dashboard is in `Live` mode, the app will subscribe to the topic and update on incoming JSON messages. Message payloads should be JSON with keys like `temperature`, `humidity`, `soilMoisture`, `rainfallPrediction`, `waterLevel`, `motorStatus`.
