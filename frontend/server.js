// Load .env if present
try {
  require('dotenv').config()
} catch (e) {
  // dotenv not installed; proceed without it
}

// Masked environment diagnostics
try {
  const u = process.env.GEMINI_API_URL ? process.env.GEMINI_API_URL : '(missing)'
  const k = process.env.GEMINI_API_KEY ? (process.env.GEMINI_API_KEY.slice(0,6) + '...') : '(missing)'
  console.log(`[startup] GEMINI_API_URL=${u}`)
  console.log(`[startup] GEMINI_API_KEY=${k}`)
} catch (e) {
  // ignore
}

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
let googleAuthClient = null
try {
  // lazy require so environments without this package still work
  const { GoogleAuth } = require('google-auth-library')
  googleAuthClient = new GoogleAuth()
} catch (e) {
  // google-auth-library not installed or not available
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store latest sensor data
let latestData = null;

// Webhook endpoint for Arduino Cloud
app.post('/webhook', (req, res) => {
  console.log('Received webhook data:', req.body);
  const sensorData = req.body;
  
  // Validate required fields
  const requiredFields = ['temperature', 'humidity', 'soilMoisture', 'rainfallPrediction', 'waterLevel', 'motorStatus'];
  const hasAllFields = requiredFields.every(field => sensorData.hasOwnProperty(field));
  
  if (!hasAllFields) {
    console.log('Missing required fields:', requiredFields.filter(field => !sensorData.hasOwnProperty(field)));
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Store and broadcast new data
  latestData = sensorData;
  console.log('Broadcasting to connected clients:', latestData);
  io.emit('sensorUpdate', sensorData);
  
  res.status(200).json({ status: 'OK' });
});

// Health/status endpoint
app.get('/status', (req, res) => {
  res.json({ ok: true, clients: io.engine.clientsCount });
});

// Latest data endpoint for quick verification
app.get('/latest', (req, res) => {
  if (!latestData) return res.status(404).json({ error: 'No data yet' });
  res.json(latestData);
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send latest data to newly connected clients
  if (latestData) {
    socket.emit('sensorUpdate', latestData);
  }
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Simple demo form endpoint to collect demo requests into a CSV file
const fs = require('fs');
const path = require('path');

app.post('/api/demo', (req, res) => {
  const { name, phone, location } = req.body || {};
  if (!name || !phone || !location) {
    return res.status(400).json({ error: 'Missing name, phone, or location' });
  }

  const csvPath = path.join(__dirname, 'demo_submissions.csv');
  const exists = fs.existsSync(csvPath);
  const row = `${new Date().toISOString()},"${(name+'').replace(/"/g,'""')}","${(phone+'').replace(/"/g,'""')}","${(location+'').replace(/"/g,'""')}"\n`;

  if (!exists) {
    const header = 'timestamp,name,phone,location\n';
    try {
      fs.writeFileSync(csvPath, header + row);
    } catch (err) {
      console.error('Failed to write CSV header:', err);
      return res.status(500).json({ error: 'Failed to save submission' });
    }
  } else {
    try {
      fs.appendFileSync(csvPath, row);
    } catch (err) {
      console.error('Failed to append CSV row:', err);
      return res.status(500).json({ error: 'Failed to save submission' });
    }
  }

  console.log('Saved demo submission:', { name, phone, location });
  res.json({ ok: true });
});

// AI chat proxy endpoint - forwards to a Gemini-compatible API URL set in env
app.post('/api/ai-chat', async (req, res) => {
  const apiUrl = process.env.GEMINI_API_URL
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiUrl || !apiKey) {
    // If no external AI configured, we'll still allow simulated responses via `mock:true` or `simulated:true`.
    const wantsSimulated = req.body && (req.body.mock || req.body.simulated)
    if (!wantsSimulated) {
      return res.status(501).json({ error: 'AI not configured. Set GEMINI_API_URL and GEMINI_API_KEY in the server environment.' })
    }
  }

  try {
    // Build a fuller prompt using provided siteContext (from frontend) and latest sensor snapshot
    const userPrompt = (req.body && req.body.prompt) ? req.body.prompt : ''
    const lang = (req.body && req.body.lang) ? req.body.lang : 'en'
    const site = (req.body && req.body.siteContext) ? req.body.siteContext : {}

    // If the frontend requested simulated mode (or legacy `mock`), respond with a local rule-based reply.
    const useSimulated = req.body && (req.body.simulated || req.body.mock)
    if (useSimulated) {
      try {
        const reply = generateSimulatedReply(userPrompt, lang, site, latestData)
        return res.json({ reply })
      } catch (e) {
        console.error('Simulated AI error', e)
        return res.status(500).json({ error: 'Simulated AI error' })
      }
    }

    let fullPrompt = `You are an assistant for the JalaTantra website. Answer user questions concisely and helpfully.`
    if (lang === 'kn') fullPrompt = `ನೀವು ಜಲತಂತ್ರ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಸಹಾಯಕರು. ಬಳಕೆದಾರರ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಂಕ್ಷಿಪ್ತ ಮತ್ತು ಸಹಾಯಕ ಉತ್ತರಗಳನ್ನು ನೀಡಿ.`

    // include site context fields if present
    if (site.title) fullPrompt += `\nWebsite title: ${site.title}`
    if (site.subtitle) fullPrompt += `\nSubtitle: ${site.subtitle}`
    if (site.aiScheduling) fullPrompt += `\nAI Scheduling: ${site.aiScheduling}`
    if (site.iotSensors) fullPrompt += `\nIoT Sensors: ${site.iotSensors}`
    if (site.remoteControl) fullPrompt += `\nRemote Control: ${site.remoteControl}`

    // include latest sensor snapshot from server memory (if available)
    if (latestData) {
      fullPrompt += `\nLatest sensor snapshot:`
      try {
        fullPrompt += `\nTemperature: ${latestData.temperature}`
        fullPrompt += `\nHumidity: ${latestData.humidity}`
        fullPrompt += `\nSoil Moisture: ${latestData.soilMoisture}`
        fullPrompt += `\nWater Level: ${latestData.waterLevel}`
        fullPrompt += `\nMotor Status: ${latestData.motorStatus}`
      } catch (e) {
        // ignore
      }
    }

    // append the user's prompt
    fullPrompt += `\nUser question: ${userPrompt}`

    // Prepare a set of candidate request shapes compatible with various generative APIs.
    const candidateBodies = [
      // Google generateContent-style: mimeType + prompt.messages
      {
        mimeType: 'text/plain',
        prompt: {
          messages: [
            { role: 'system', content: [{ type: 'text', text: 'You are an assistant for the JalaTantra website. Answer concisely.' }] },
            { role: 'user', content: [{ type: 'text', text: fullPrompt }] }
          ]
        },
        temperature: 0.2
      },
      // direct text field
      { text: fullPrompt },
      // content array with text objects
      { content: [{ type: 'text', text: fullPrompt }] },
      // Google GLM-style: prompt.text
      { prompt: { text: fullPrompt } },
      // Simple input wrapper
      { input: fullPrompt },
      // Instances array (Vertex-like)
      { instances: [{ input: fullPrompt }] },
      // Messages-style conversational wrapper
      { messages: [{ role: 'user', content: [{ type: 'text', text: fullPrompt }] }] },
      // legacy prompt as plain string
      { prompt: fullPrompt }
    ]

    // Diagnostic logging (truncated prompt)
    try {
      console.log(`[AI] Sending prompt (truncated 2000 chars):\n${fullPrompt.substring(0, 2000)}`)
      console.log(`[AI] Outbound URL: ${apiUrl}`)
    } catch (e) {
      // ignore
    }

    // Prepare auth: if the key looks like a Google API key (AIza...), send it as a ?key= query param.
    // Otherwise assume it's a Bearer token and use Authorization header.
    let outboundUrl = apiUrl
    const headers = { 'Content-Type': 'application/json' }
    try {
      // If the API key looks like a simple Google API key (AIza...), use ?key= param
      if (apiKey && typeof apiKey === 'string' && apiKey.startsWith('AIza')) {
        const sep = apiUrl.includes('?') ? '&' : '?'
        outboundUrl = apiUrl + sep + 'key=' + encodeURIComponent(apiKey)
        console.log('[AI] Using Google API key via query param (masked)')
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && googleAuthClient) {
        // Use service account credentials to obtain an OAuth2 access token
        try {
          const client = await googleAuthClient.getClient()
          const token = await client.getAccessToken()
          if (token && token.token) {
            headers['Authorization'] = `Bearer ${token.token}`
            console.log('[AI] Using OAuth2 access token from service account (masked)')
          }
        } catch (e) {
          console.error('[AI] Failed to obtain access token from service account', e)
        }
      } else if (apiKey) {
        // Assume it's already a bearer token
        headers['Authorization'] = `Bearer ${apiKey}`
        console.log('[AI] Using Authorization: Bearer (masked)')
      }
    } catch (e) {
      // ignore
    }

    // Try candidate bodies in order until one succeeds or we exhaust options
    let response = null
    let body = null
    let usedCandidate = null
    for (const candidate of candidateBodies) {
      try {
        console.log('[AI] Trying request shape:', Object.keys(candidate)[0])
        response = await fetch(outboundUrl, { method: 'POST', headers, body: JSON.stringify(candidate) })
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) body = await response.json()
        else body = await response.text()

        // If accepted, stop
        if (response.ok) {
          usedCandidate = candidate
          break
        }

        // If provider complained about unknown 'prompt', continue to next candidate
        const bodyStr = (typeof body === 'string') ? body : JSON.stringify(body)
        if (bodyStr && /Unknown name \"prompt\"|Cannot find field/.test(bodyStr)) {
          console.warn('[AI] Provider rejected payload shape, trying next candidate')
          continue
        }

        // Other non-OK: break and surface
        usedCandidate = candidate
        break
      } catch (e) {
        console.error('[AI] Request attempt failed', e)
      }
    }

    if (!response) {
      throw new Error('No response from AI provider')
    }

    if (!response.ok) {
      console.error(`[AI] Non-OK response from AI provider: ${response.status} ${response.statusText}`)
      console.error('[AI] Response body (truncated 2000 chars):', (typeof body === 'string') ? body.substring(0,2000) : JSON.stringify(body).substring(0,2000))
    } else {
      console.log('[AI] Request shape succeeded:', usedCandidate ? Object.keys(usedCandidate)[0] : 'unknown')
    }

    // Normalize reply text from common LLM shapes
    let replyText = ''
    if (typeof body === 'string') {
      replyText = body
    } else if (body && typeof body === 'object') {
      if (body.reply) replyText = body.reply
      else if (body.output && Array.isArray(body.output)) {
        // Google-style output -> look for output[].content[].text
        for (const out of body.output) {
          if (out && Array.isArray(out.content)) {
            for (const c of out.content) {
              if (c && c.text) replyText += (replyText ? '\n' : '') + c.text
            }
          }
        }
      } else if (body.candidates && Array.isArray(body.candidates) && body.candidates[0]) {
        if (body.candidates[0].content) replyText = body.candidates[0].content
        else if (body.candidates[0].message && body.candidates[0].message.content) replyText = body.candidates[0].message.content
      } else if (body.choices && Array.isArray(body.choices) && body.choices[0]) {
        const first = body.choices[0]
        if (first.text) replyText = first.text
        else if (first.message && first.message.content) replyText = first.message.content
      } else if (body.output_text) replyText = body.output_text
      else if (body.text) replyText = body.text
    }

    // Return a consistent JSON shape
    res.status(response.status)
    return res.json({ reply: replyText || '' })
  } catch (err) {
    console.error('AI proxy error', err)
    return res.status(500).json({ error: 'AI proxy error' })
  }
})

// Simple rule-based simulated AI responder used for local demos / when simulated:true (or legacy mock:true) is sent
function generateSimulatedReply(userText, lang = 'en', siteContext = {}, latestData = null) {
  const lower = (userText || '').toLowerCase()

  // Greeting
  if (/^\s*(hi|hello|hey|hey there|hiya)\b/.test(lower)) {
    return lang === 'kn' ? 'ಹೇಗಿದ್ದೀರಿ? ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' : 'Hey — how can I help you?'
  }

  // Ask about product
  if (/product|what is|what's|features|how it works|how do(es)? it work|jala|jaltantra|jalatantra|smart irrigation|ai|iot|schedule/.test(lower)) {
    const parts = []
    if (siteContext.title) parts.push(siteContext.title)
    if (siteContext.subtitle) parts.push(siteContext.subtitle)
    if (siteContext.aiScheduling) parts.push(`AI Scheduling: ${siteContext.aiScheduling}`)
    if (siteContext.iotSensors) parts.push(`Sensors: ${siteContext.iotSensors}`)
    if (siteContext.remoteControl) parts.push(`Remote control: ${siteContext.remoteControl}`)
    if (parts.length) return parts.join('\n')
    return lang === 'kn' ? 'ಜಲತಂತ್ರ ಒಂದು ಎಐ ಮತ್ತು ಐಒಟಿ ಆಧಾರಿತ ಸ್ಮಾರ್ಟ್ ಸಿಂಚನ ಸಿಸ್ಟಮ್. ಇದು ಮಣ್ಣಿನ ತೇವಮಾನ, ಹವಾಮಾನ ಮತ್ತು ಬೆಳೆ ಪ್ರಕಾರ ಆಧರಿಸಿ ಶೆಡ್ಯೂಲ್ ಶಿಫಾರಸುಗಳನ್ನು ನೀಡುತ್ತದೆ.' : 'JalaTantra is an AI+IoT smart irrigation system that optimizes watering using sensor data and automated valves. It reduces water use and increases yields.'
  }

  // Creators list
  if (/creator|who built|who made|team|creators|who are/.test(lower)) {
    const creators = [
      { name: 'Arjun V', role: 'Embedded & Hardware Engineer' },
      { name: 'Jeevan Jaikumar', role: 'Full-Stack Developer' },
      { name: 'Harsh Jangir', role: 'UI/UX Designer & Creative Lead' },
      { name: 'Shailesh M', role: 'Automation & Workflow Head' }
    ]
    return creators.map(c => `${c.name} — ${c.role}`).join('\n')
  }

  // Specific creator role lookup
  if (/who.*ui|ui\/?ux|ui ux|ui-ux|designer/.test(lower)) {
    return 'Harsh Jangir — UI/UX Designer & Creative Lead'
  }

  // Temperature request -> random between 26 and 28
  if (/temp|temperature|degree|°c|celsius/.test(lower)) {
    const val = (Math.random() * (28 - 26) + 26).toFixed(1)
    return `Temperature: ${val} °C`
  }

  // Water consumption queries (rice/wheat estimates)
  if (/water consumed|water per cycle|water per|water consumption|consumed per cycle|how much water|water for|per hectare|per ha|l\/ha|liters|litres|water usage|water needed/.test(lower)) {
    // check for crop mention
    if (lower.includes('rice')) {
      return `Rice: ${Math.round(800 + Math.random() * 400)} L/ha per cycle (typical)`
    }
    if (lower.includes('wheat')) {
      return `Wheat: ${Math.round(400 + Math.random() * 200)} L/ha per cycle (typical)`
    }
    // general: return both estimates
    const rice = Math.round(800 + Math.random() * 400)
    const wheat = Math.round(400 + Math.random() * 200)
    return `Estimated water per cycle:\nRice: ${rice} L/ha\nWheat: ${wheat} L/ha`
  }

  // Demo request
  if (/demo|contact|request/.test(lower)) {
    return lang === 'kn' ? 'ಡೆಮೋಕ್ಕಾಗಿ ಫಾರ್ಮ್ ಅನ್ನು ಭರ್ತಿ ಮಾಡಿ ಅಥವಾ powerhousegpt@gmail.com ಗೆ ಮೇಲ್ ಮಾಡಿ.' : 'To request a demo, fill the form on the page or email powerhousegpt@gmail.com.'
  }

  // Fallback
  return lang === 'kn' ? 'ಕ್ಷಮಿಸಿ, ಅದನ್ನು ನನಗೆ ಸ್ಪಷ್ಟವಾಗಿಲ್ಲ. ಇನ್ನೊಮ್ಮೆ ಕೇಳಿ.' : 'Sorry, I didn\'t understand that. Can you rephrase?'
}

// Health endpoint to validate AI provider connectivity and auth
app.get('/api/ai-health', async (req, res) => {
  const apiUrl = process.env.GEMINI_API_URL
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiUrl) return res.status(501).json({ error: 'GEMINI_API_URL not configured' })

  try {
    const testPrompt = 'Health check: respond with OK'
    let outboundUrl = apiUrl
    const headers = { 'Content-Type': 'application/json' }

    if (apiKey && typeof apiKey === 'string' && apiKey.startsWith('AIza')) {
      const sep = apiUrl.includes('?') ? '&' : '?'
      outboundUrl = apiUrl + sep + 'key=' + encodeURIComponent(apiKey)
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && googleAuthClient) {
      try {
        const client = await googleAuthClient.getClient()
        const token = await client.getAccessToken()
        if (token && token.token) headers['Authorization'] = `Bearer ${token.token}`
      } catch (e) {
        console.error('Health: failed to obtain access token', e)
      }
    } else if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    const bodyToSend = { prompt: testPrompt }
    const response = await fetch(outboundUrl, { method: 'POST', headers, body: JSON.stringify(bodyToSend) })
    const contentType = response.headers.get('content-type') || ''
    let body
    if (contentType.includes('application/json')) body = await response.json()
    else body = await response.text()

    return res.status(200).json({ status: response.status, ok: response.ok, body: (typeof body === 'string') ? body.substring(0,2000) : JSON.stringify(body).substring(0,2000) })
  } catch (err) {
    console.error('AI health check error', err)
    return res.status(500).json({ error: 'AI health check failed', details: (err && err.message) ? err.message : String(err) })
  }
})
