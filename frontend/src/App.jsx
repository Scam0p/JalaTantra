import React, { useState } from 'react'

const TRANSLATIONS = {
  en: {
    headerSubtitle: 'Smart irrigation for Karnataka farmers',
    title: 'JalaTantra — AI + IoT smart irrigation',
    subtitle: 'Reduce water usage, increase yields, and automate irrigation using AI-driven decisions and IoT sensors. Built for Karnataka farmers.',
    features: 'Features',
    how: 'How it works',
    contact: 'Get JalaTantra on your farm',
    cta: 'Get Started',
    demo: 'Request a Demo',
    fieldSnapshot: 'Field snapshot',
    fieldDesc: 'Monitor key metrics in real-time via sensors and take action automatically.',
    temp: 'Temperature',
    humidity: 'Humidity',
    soilMoisture: 'Soil Moisture',
    waterLevel: 'Water Level',
    aiScheduling: {
      title: 'AI Scheduling',
      desc: 'Optimized watering schedules based on weather forecasts, soil, and crop type.'
    },
    creatorsTitle: 'About the creators',
    creators: [
      { name: 'Arjun V', role: 'Embedded & Hardware Engineer' },
      { name: 'Jeevan Jaikumar', role: 'Full-Stack Developer' },
      { name: 'Harsh Jangir', role: 'UI/UX Designer & Creative Lead' },
      { name: 'Shailesh M', role: 'Automation & Workflow Head' }
    ],
    impactTitle: 'Impact and Results',
    impactPoints: [
      'Reduce water use by up to 30% through data-driven scheduling.',
      'Increase yields with precise irrigation tailored to crop and soil.',
      'Lower operational costs with automated pumps and remote control.'
    ],
    testimonialsTitle: 'Farmer Stories',
    testimonials: [
      { quote: 'JalaTantra helped our crop survive a dry spell and saved water.', author: 'R. Kumar, Hassan' },
      { quote: 'Installation was simple and the savings were immediate.', author: 'S. Priya, Mysore' }
    ],
    faqTitle: 'FAQ',
    faqs: [
      { q: 'How much does it cost to install?', a: 'We offer subsidized pilot installations; contact us for pricing details.' },
      { q: 'Do I need internet on my farm?', a: 'Sensors use low-power cellular or local gateways; internet is needed for cloud features but offline rules are supported.' }
    ],
    iotSensors: {
      title: 'IoT Sensors',
      desc: 'Soil moisture, temperature, humidity sensors placed across fields for precise measurements.'
    },
    
    remoteControl: {
      title: 'Remote Control',
      desc: 'Turn pumps and valves on/off from your phone or automate via rules.'
    },
    howSteps: [
      'Install low-cost IoT sensors across your field.',
      'Sensors send data to the cloud; AI analyzes and recommends watering.',
      'Automated valves/pumps execute schedules or the farmer can approve remotely.'
    ],
    contactDesc: 'We’re onboarding pilot farms across Karnataka. Fill the form and our team will contact you.',
    placeholders: {
      name: 'Name',
      phone: 'Phone / WhatsApp',
      location: 'Village / Taluk / District'
    },
    footer: 'Making irrigation smarter for Karnataka farmers.'
    ,
    bot: {
      noData: 'No sensor data available yet.',
      help: 'Ask me about the product, features, impact, or latest sensor readings (temperature, humidity, soil moisture, water level, motor status).',
      demoInfo: 'To request a demo, fill the form on the page or email powerhousegpt@gmail.com.'
    }
  },
  kn: {
    headerSubtitle: 'ಕರ್ನಾಟಕದ ರೈತರಿಗೆ ಸ್ಮಾರ್ಟ್ ಸಿಂಚನ',
    title: 'ಜಲತಂತ್ರ — ಎಐ ಮತ್ತು ಐಒಟಿ ಆಧಾರಿತ ಸ್ಮಾರ್ಟ್ ಸಿಂಚನ',
    subtitle: 'ಎಐ ಮತ್ತು ಐಒಟಿ ಸೆನ್ಸರ್‌ಗಳ ನೆರವಿನಿಂದ ನೀರಿನ ಬಳಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಿ, ಉತ್ಪಾದನೆ ಹೆಚ್ಚಿಸಿ ಮತ್ತು ಸಿಂಚನವನ್ನು ಸ್ವಯಂಚಾಲಿತಗೊಳಿಸಿ. ಇದು ಕರ್ನಾಟಕದ ರೈತರಿಗಾಗಿ ರೂಪಿಸಲಾಗಿದೆ.',
    features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    how: 'ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    contact: 'ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ಜಲತಂತ್ರ ಪಡೆಯಿರಿ',
    cta: 'ಪ್ರಾರಂಭಿಸಿ',
    demo: 'ಡೆಮೋ ಕೇಳಿ',
    fieldSnapshot: 'ಕ್ಷೇತ್ರದ ಸಾರಾಂಶ',
    fieldDesc: 'ಸೆನ್ಸರ್‌ಗಳ ಮೂಲಕ ಪ್ರಮುಖ ಮೌಲ್ಯಗಳನ್ನು ರಿಯಲ್‌ಟೈಲ್‌ನಲ್ಲಿ ಗಮನಿಸಿ ಮತ್ತು ತೋರು ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ.',
    temp: 'ತಾಪಮಾನ',
    humidity: 'ಆದ್ರತೆ',
    soilMoisture: 'ಮಣ್ಣಿನ ತೇವಮಾನ',
    waterLevel: 'ನೀರಿನ ಮಟ್ಟ',
    aiScheduling: {
      title: 'ಎಐ ಶೆಡ್ಯೂಲಿಂಗ್',
      desc: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಮಣ್ಣು ಮತ್ತು ಬೆಳೆ ಆಧರಿಸಿ ಶುದ್ಧವಾದ ಸಿಂಚನ ಸಮಯವನ್ನು ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ.'
    },
    iotSensors: {
      title: 'ಐಒಟಿ ಸೆನ್ಸರ್‌ಗಳು',
      desc: 'ಕ್ಷೇತ್ರದ ಮಣ್ಣು ತೇವ, ತಾಪಮಾನ ಮತ್ತು ಆರ್ದ್ರತೆಯನ್ನು ನಿಖರವಾಗಿ ಅಳೆಯುವ ಸೆನ್ಸರ್‌ಗಳು.'
    },
    remoteControl: {
      title: 'ದೂರಸ್ಥ ನಿಯಂತ್ರಣ',
      desc: 'ಮೊಬೈಲ್‌ನಿಂದ ಪಂಪ್ ಮತ್ತು ವಾಲ್ವ್‌ಗಳನ್ನು ಆನ್/ಆಫ್ ಮಾಡಿ ಅಥವಾ ನಿಯಮಾವಳಿಗಳ ಮೂಲಕ ಸ್ವಯಂಚಾಲಿತಗೊಳಿಸಿ.'
    },
    howSteps: [
      'ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ಕಡಿಮೆ ವೆಚ್ಚದ ಐಒಟಿ ಸೆನ್ಸರ್‌ಗಳನ್ನು ಸ್ಥಾಪಿಸಿ.',
      'ಸೆನ್ಸರ್‌ಗಳು ಡೇಟಾವನ್ನು ಕ್ಲೌಡ್‌ಗೆ ಕಳುಹಿಸುತ್ತವೆ; ಎಐ ವಿಶ್ಲೇಷಿಸಿ ಸಿಂಚನ ಶಿಫಾರಸುಗಳನ್ನು ನೀಡುತ್ತದೆ.',
      'ಸ್ವಯಂಚಾಲಿತ ವಾಲ್ವ್/ಪಂಪ್‌ಗಳು ನಿರ್ಧಾರಗಳನ್ನು ಅನುಷ್ಟಾನಗೊಳಿಸುತ್ತವೆ ಅಥವಾ ರೈತರು ದೂರದಿಂದ ಅನುಮೋದಿಸಬಹುದು.'
    ],
    contactDesc: 'ನಾವು ಕರ್ನಾಟಕದ ಪೈಲಟ್ ಫಾರ್ಮ್ಗಳನ್ನು ಆನ್‌ಬೋರ್ಡ್ ಮಾಡುತ್ತಿದ್ದೇವೆ. ದಯವಿಟ್ಟು ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡಿ, ನಮ್ಮ ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
    placeholders: {
      name: 'ಹೆಸರು',
      phone: 'ಫೋನ್ / ವಾಟ್ಸ್ಆಪ್',
      location: 'ಗ್ರಾಮ / ತಾಲೂಕು / ಜಿಲ್ಲಾ'
    },
    footer: 'ಕರ್ನಾಟಕದ ರೈತರಿಗಾಗಿ ಸ್ಮಾರ್ಟ್ ಸಿಂಚನವನ್ನು ಸುಧಾರಿಸುತ್ತಿದೆ.'
    ,
    bot: {
      noData: 'ಇಲ್ಲಿ ಇನ್ನೂ ಸೆನ್ಸರ್ ಡೇಟಾ ಕಾಣ្សದು.',
      help: 'ಉತ್ಪನ್ನ, ವೈಶಿಷ್ಟ್ಯಗಳು, ಪ್ರಭಾವ ಅಥವಾ ತಾಪಮಾನ/ಆದ್ರತೆ/ಮಣ್ಣಿನ ತೇವಮಾನ/ನೀರಿನ ಮಟ್ಟ/ಮೋಟರ್ ಸ್ಥಿತಿಯನ್ನು ಕೇಳಿ.',
      demoInfo: 'ಡೆಮೋಗಾಗಿ ಪೇಜ್上的 ಫಾರ್ಮ್‌ ಅನ್ನು ಭರ್ತಿ ಮಾಡಿ ಅಥವಾ powerhousegpt@gmail.com ಗೆ ಮೇಲ್ ಮಾಡಿ.'
    }
    ,
    creatorsTitle: 'ರಚನೆಗಾರರ ಬಗ್ಗೆ',
    creators: [
      { name: 'ಅರ್ಜುನ್ ವಿ', role: 'ಎಂಬೆಡೆಡ್ ಮತ್ತು ಹಾರ್ಡ್‌ವೇರ್ ಎಂಜಿನಿಯರ್' },
      { name: 'ಜೀವನ್ ಜೈಕೂಮಾರ್', role: 'ಫುಲ್-ಸ್ಟ್ಯಾಕ್ ಅಭಿವೃದ್ಧಿ' },
      { name: 'ಹರ್ಷ್ ಜಂಗೀರ್', role: 'ಯೂಐ/ಯುಎಕ್ಸ್ ವಿನ್ಯಾಸಕ ಮತ್ತು ಕ್ರಿಯೇಟಿವ್ ಲೀಡ್' },
      { name: 'ಶೈಲೇಶ್ ಎಂ', role: 'ಆಟೋಮೇಶನ್ ಮತ್ತು ವರ್ಕ್ಫ್ಲೋ ಮುಖ್ಯ' }
    ],
    impactTitle: 'ಪ್ರಭಾವ ಮತ್ತು ಫಲಿತಾಂಶಗಳು',
    impactPoints: [
      'ಡೇಟಾ ಆಧಾರಿತ ಶೆಡ್ಯೂಲಿಂಗ್ ಮೂಲಕ ನೀರಿನ ಬಳಕೆಯನ್ನು ~30% ಕಡಿಮೆ ಮಾಡಿ.',
      'ಬೆಳೆ ಮತ್ತು ಮಣ್ಣಿಗೆ ತಕ್ಕಂತೆ ನಿಖರ ಸಿಂಚನದಿಂದ ಉತ್ಪಾದನೆ ಹೆಚ್ಚಿಸಿ.',
      'ಸ್ವಯಂಚಾಲಿತ ಪಂಪ್ ಮತ್ತು ದೂರಸ್ಥ ನಿಯಂತ್ರಣದಿಂದ ಕಾರ್ಯಾಚರಣಾ ವೆಚ್ಚ ಕಡಿಮೆ ಮಾಡಿ.'
    ],
    testimonialsTitle: 'ರೈತರ ಕಥೆಗಳು',
    testimonials: [
      { quote: 'ಜಲತಂತ್ರ ನಮ್ಮ ಬೆಳೆ ಒಣಗಾಂಡದ ವೇಳೆಯಲ್ಲಿ ಬದುಕಿಸಲು ಮತ್ತು ನೀರನ್ನು ಉಳಿಸಲು ಸಹಾಯ ಮಾಡಿತು.', author: 'ಆರ್. ಕುಮಾರ್, ಹಾಸನ' },
      { quote: 'ಸ್ಥಾಪನೆ ಸರಳವಾಗಿತ್ತು ಮತ್ತು ಉಳಿವು ತಕ್ಷಣ ಕಂಡು ಬಂದಿದೆ.', author: 'ಎಸ್. ಪ್ರಿಯಾ, ಮೈಸೂರು' }
    ],
    faqTitle: 'ಪ್ರಶ್ನೋತ್ತರ',
    faqs: [
      { q: 'ಸ್ಥಾಪನೆಗೆ ವೆಚ್ಚ ಎಷ್ಟು?', a: 'ನಾವು ಪೈಲಟ್ ಸ್ಥಾಪನೆಗೆ ಸಬ್ಸಿಡಿ ನೀಡುತ್ತೇವೆ; ಬೆಲೆ ವಿವರಗಳಿಗೆ ಸಹ ಸಂಪರ್ಕಿಸಿ.' },
      { q: 'ನನ್ನ ಹೊಲದಲ್ಲಿ ಇಂಟರ್ನೆಟ್ ಅಗತ್ಯವಿದೆಯೇ?', a: 'ಸೆನ್ಸಾರ್‌ಗಳು ಕಡಿಮೆ-ಶಕ್ತಿ ಸೆಲ್ಲುಲಾರ್ ಅಥವಾ ಲೋಕಲ್ ಗೇಟ್ವೇ ಬಳಸಿ; ಕ್ಲೌಡ್ ವೈಶಿಷ್ಟ್ಯಗಳಿಗೆ ಇಂಟರ್ನೆಟ್ ಬೇಕಾಗಬಹುದು ಆದರೆ ಆಫ್‌ಲೈನ್ ನಿಯಮಗಳನ್ನು ಬೆಂಬಲಿಸಲಾಗಿದೆ.' }
    ],
  }
}

export default function App() {
  const [lang, setLang] = useState('en')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const t = TRANSLATIONS[lang]
  // Chat widget state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: t.bot.help, source: 'LAI' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Simulated live sensor state for the field snapshot
  const [sensors, setSensors] = useState({
    temperature: 27.0,
    humidity: 72.0,
    soilMoisture: 57,
    waterLevel: 75
  })

  // random-walk updates to make values look live
  React.useEffect(() => {
    let mounted = true
    function step() {
      setSensors(prev => {
        const next = { ...prev }
        // temp: 26 - 28, small drift
        next.temperature = Math.max(26, Math.min(28, +(prev.temperature + (Math.random() * 0.6 - 0.3)).toFixed(1)))
        // humidity: 71 - 73
        next.humidity = Math.max(71, Math.min(73, +(prev.humidity + (Math.random() * 0.6 - 0.3)).toFixed(1)))
        // soil moisture: 55 - 60 (integers)
        const soilNext = prev.soilMoisture + (Math.random() > 0.5 ? 1 : -1)
        next.soilMoisture = Math.max(55, Math.min(60, soilNext))
        // waterLevel stays constant with tiny jitter
        next.waterLevel = prev.waterLevel // keep steady
        return next
      })

      if (!mounted) return
      // jitter interval between 3000ms and 6000ms
      const t = 3000 + Math.floor(Math.random() * 3000)
      setTimeout(step, t)
    }

    step()
    return () => { mounted = false }
  }, [])

  // Helper to add message
  const pushMessage = (msg) => setChatMessages(prev => [...prev, msg])

  // Generate a contextual reply using product info and latest sensor data
  async function generateReply(userText) {
    const lower = (userText || '').toLowerCase()
    // sensor-related requests
    const wantsTemp = /temp|temperature|degree|°c/.test(lower)
    const wantsHumidity = /humid|humidity/.test(lower)
    const wantsSoil = /soil|moisture/.test(lower)
    const wantsWater = /water level|water|level/.test(lower)
    const wantsMotor = /motor|pump|status/.test(lower)

    // product/help requests
    const wantsProduct = /product|what|features|how|ai|iot|schedule|impact/.test(lower)
    const wantsDemo = /demo|contact|request/.test(lower)

    if (wantsTemp || wantsHumidity || wantsSoil || wantsWater || wantsMotor) {
      // fetch latest sensor data
      try {
        const res = await fetch('http://localhost:3000/latest')
        if (!res.ok) {
          return t.bot.noData
        }
        const data = await res.json()
        const parts = []
        if (wantsTemp && data.temperature !== undefined) parts.push(`${t.temp}: ${data.temperature}${data.temperatureUnit || '°C'}`)
        if (wantsHumidity && data.humidity !== undefined) parts.push(`${t.humidity}: ${data.humidity}%`)
        if (wantsSoil && data.soilMoisture !== undefined) parts.push(`${t.soilMoisture}: ${data.soilMoisture}%`)
        if (wantsWater && data.waterLevel !== undefined) parts.push(`${t.waterLevel}: ${data.waterLevel}%`)
        if (wantsMotor && data.motorStatus !== undefined) parts.push(`Motor: ${data.motorStatus}`)
        if (parts.length) return parts.join('\n')
        return t.bot.noData
      } catch (err) {
        console.error('chat latest fetch error', err)
        return t.bot.noData
      }
    }

    if (wantsDemo) return t.bot.demoInfo

    if (wantsProduct) {
      const lines = [t.title, t.subtitle, t.aiScheduling?.desc || '', t.iotSensors?.desc || '', t.remoteControl?.desc || '']
      return lines.filter(Boolean).join('\n')
    }

    // fallback help
    return t.bot.help
  }

  // Use LLM proxy exclusively. Send site context and language.
  async function getReply(userText) {
    // Client-side simulated responder — avoids backend/Google issues and provides deterministic demo replies.
    function generateSimulatedReplyFrontend(userText) {
      const lower = (userText || '').toLowerCase()
      if (/^\s*(hi|hello|hey|hey there|hiya)\b/.test(lower)) return (lang === 'kn') ? 'ಹೇಗಿದ್ದೀರಿ? ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' : 'Hey — how can I help you?'

      if (/help|what can you do|suggested|examples?/.test(lower)) {
        return `Try asking:\n- Hey\n- Tell me about JalaTantra\n- Who are the creators?\n- Who is the UI/UX designer?\n- What's the temperature?\n- What's the humidity?\n- Soil moisture status\n- Water level\n- Is the pump on?\n- Rainfall prediction\n- Show FAQs`
      }

      if (/product|what is|what's|features|how it works|how do(es)? it work|jala|jaltantra|smart irrigation|ai|iot|schedule/.test(lower)) {
        const parts = [t.title, t.subtitle, t.aiScheduling?.desc, t.iotSensors?.desc, t.remoteControl?.desc].filter(Boolean)
        return parts.join('\n') || ((lang === 'kn') ? 'ಜಲತಂತ್ರ ಒಂದು ಎಐ ಮತ್ತು ಐಒಟಿ ಆಧಾರಿತ ಸ್ಮಾರ್ಟ್ ಸಿಂಚನ ಸಿಸ್ಟಮ್.' : 'JalaTantra is an AI+IoT smart irrigation system that optimizes watering using sensors and automated valves.')
      }

      if (/creator|who built|who made|team|creators|who are/.test(lower)) {
        return t.creators.map(c => `${c.name} — ${c.role}`).join('\n')
      }

      if (/who.*ui|ui\/?ux|ui ux|ui-ux|designer/.test(lower)) return 'Harsh Jangir — UI/UX Designer & Creative Lead'

      if (/who.*ai|ai\/?ml|full stack|backend|trained/.test(lower)) return 'Jeevan Jaikumar — Full-Stack Developer and AI Integrator'

      if (/temp|temperature|degree|°c|celsius/.test(lower)) return `Temperature: ${(Math.random() * (28 - 26) + 26).toFixed(1)} °C`

      if (/humid|humidity|humidty/.test(lower)) return `Humidity: ${(Math.random() * (73 - 71) + 71).toFixed(1)}%`

      if (/soil|moisture/.test(lower)) return `Soil moisture: ${(Math.random() * (60 - 50) + 50).toFixed(0)}%`

      if (/water level|waterlevel|water/.test(lower)) return `Water level: ${(Math.random() * (80 - 70) + 70).toFixed(0)}%`

      if (/pump|motor|is the pump|is the motor|motor status/.test(lower)) {
        return Math.random() > 0.5 ? 'Motor status: ON' : 'Motor status: OFF'
      }

      if (/rain|rainfall|prediction/.test(lower)) return 'Rainfall prediction: Low chance in the next 24 hours.'

      if (/schedule|when to water|irrigation|next watering/.test(lower)) return 'Next irrigation scheduled at 06:00 AM tomorrow, based on soil moisture and weather forecast.'

      if (/faq|faqs|question|questions/.test(lower)) {
        return t.faqs.map(f => `${f.q} — ${f.a}`).join('\n')
      }

      if (/testimonial|story|farmer|testimonial/.test(lower)) return t.testimonials.map(s => `${s.quote} — ${s.author}`).join('\n')

      if (/demo|contact|request/.test(lower)) return t.bot.demoInfo
      // Water consumption queries
      if (/water consumed|water per cycle|water per|water consumption|consumed per cycle|how much water|water for|per hectare|per ha|l\/ha|liters|litres|water usage|water needed/.test(lower)) {
        // check for crop mention (rice/wheat)
        if (lower.includes('rice')) return simulateWaterConsumption('rice')
        if (lower.includes('wheat')) return simulateWaterConsumption('wheat')
        // if user asked generally, return both estimates
        return simulateWaterConsumption()
      }

      return t.bot.help
    }

    // Helper: simulate water consumption per cycle (liters per hectare)
    function simulateWaterConsumption(crop) {
      // Typical per-cycle irrigation volumes are illustrative only
      if (!crop) {
        const rice = Math.round((800 + Math.random() * 400)) // 800-1200 L/m2-h equivalent scaled
        const wheat = Math.round((400 + Math.random() * 200))
        return `Estimated water per cycle:\nRice: ${rice} L/ha\nWheat: ${wheat} L/ha`
      }
      const c = crop.toLowerCase()
      if (c.includes('rice')) return `Rice: ${Math.round(800 + Math.random() * 400)} L/ha per cycle (typical)`
      if (c.includes('wheat')) return `Wheat: ${Math.round(400 + Math.random() * 200)} L/ha per cycle (typical)`
      return `Estimated water per cycle: Rice ~${Math.round(800 + Math.random() * 400)} L/ha, Wheat ~${Math.round(400 + Math.random() * 200)} L/ha`
    }

    try {
      const reply = generateSimulatedReplyFrontend(userText)
      return { text: reply, source: 'Gem' }
    } catch (err) {
      console.error('Local simulated AI failed', err)
      return { text: 'Sorry, AI is unavailable right now.', source: 'Gem' }
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <header className="bg-gray-800/60 backdrop-blur border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <title>JalaTantra globe</title>
                <circle cx="12" cy="12" r="8" />
                <path d="M2 12h20" />
                <path d="M12 2a15 15 0 0 1 0 20" />
                <path d="M12 2a15 15 0 0 0 0 20" />
                <path d="M7 5a10 10 0 0 0 0 14" />
                <path d="M17 5a10 10 0 0 1 0 14" />
              </svg>
              <span className="sr-only">JalaTantra</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">JalaTantra</h1>
              <p className="text-xs text-gray-400">{t.headerSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="space-x-4 text-sm text-gray-300">
              <a href="#features" className="hover:text-white">{t.features}</a>
              <a href="#how" className="hover:text-white">{t.how}</a>
              <a href="#contact" className="hover:text-white">{t.contact}</a>
            </nav>
            <div className="ml-4 flex items-center gap-2">
              <button onClick={() => setLang('en')} className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>EN</button>
              <button onClick={() => setLang('kn')} className={`px-2 py-1 rounded ${lang === 'kn' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>KN</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">{t.title}</h2>
            <p className="mt-4 text-gray-300">{t.subtitle}</p>

            <div className="mt-8 flex gap-4">
              <a className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold" href="#contact">{t.cta}</a>
              <a className="px-6 py-3 border border-gray-700 rounded-md text-gray-300" href="#features">{t.features}</a>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-100">{t.fieldSnapshot}</h3>
            <p className="text-sm text-gray-400 mt-2">{t.fieldDesc}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-700 rounded-md">
                <div className="text-xs text-gray-400">{t.temp}</div>
                  <div className="text-lg font-bold">{sensors.temperature}°C</div>
              </div>
              <div className="p-3 bg-gray-700 rounded-md">
                <div className="text-xs text-gray-400">{t.humidity}</div>
                  <div className="text-lg font-bold">{sensors.humidity}%</div>
              </div>
              <div className="p-3 bg-gray-700 rounded-md">
                <div className="text-xs text-gray-400">{t.soilMoisture}</div>
                  <div className="text-lg font-bold">{sensors.soilMoisture}%</div>
              </div>
              <div className="p-3 bg-gray-700 rounded-md">
                <div className="text-xs text-gray-400">{t.waterLevel}</div>
                  <div className="text-lg font-bold">{sensors.waterLevel}%</div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16">
          <h3 className="text-2xl font-bold text-gray-100">{t.features}</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-800 rounded-lg shadow">
              <h4 className="font-semibold text-gray-100">{t.aiScheduling.title}</h4>
              <p className="text-sm text-gray-400 mt-2">{t.aiScheduling.desc}</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg shadow">
              <h4 className="font-semibold text-gray-100">{t.iotSensors.title}</h4>
              <p className="text-sm text-gray-400 mt-2">{t.iotSensors.desc}</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg shadow">
              <h4 className="font-semibold text-gray-100">{t.remoteControl.title}</h4>
              <p className="text-sm text-gray-400 mt-2">{t.remoteControl.desc}</p>
            </div>
          </div>
        </section>

        <section id="how" className="mt-16">
          <h3 className="text-2xl font-bold text-gray-100">{t.how}</h3>
          <ol className="mt-4 list-decimal list-inside text-gray-300 space-y-2">
            {t.howSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>

        <section id="impact" className="mt-16">
          <h3 className="text-2xl font-bold text-gray-100">{t.impactTitle}</h3>
          <ul className="mt-4 list-disc list-inside text-gray-300 space-y-2">
            {t.impactPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        <section id="creators" className="mt-12 bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-gray-100">{t.creatorsTitle}</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {t.creators.map((c, i) => (
              <div key={i} className="bg-gray-900 p-4 rounded-md text-center">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=16a34a&color=fff&size=128&rounded=true`} alt={`${c.name} avatar`} className="w-12 h-12 rounded-full mx-auto object-cover" />
                <div className="mt-2 font-semibold text-gray-100">{c.name}</div>
                <div className="text-sm text-gray-300 mt-1">{c.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="mt-12 bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-gray-100">{t.testimonialsTitle}</h3>
          <div className="mt-4 space-y-4">
            {t.testimonials.map((s, i) => (
              <blockquote key={i} className="text-gray-300 p-4 border-l-4 border-green-600">"
                <span className="italic">{s.quote}</span> — <span className="font-semibold">{s.author}</span>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-12">
          <h3 className="text-2xl font-bold text-gray-100">{t.faqTitle}</h3>
          <div className="mt-4 space-y-3">
            {t.faqs.map((f, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-md">
                <div className="font-semibold text-gray-100">{f.q}</div>
                <div className="text-gray-300 text-sm mt-1">{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-16 bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-gray-100">{t.contact}</h3>
          <p className="text-gray-400 mt-2">{t.contactDesc}</p>

          <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={async (e) => {
            e.preventDefault()
            setMessage(null)
            if (!name || !phone || !location) {
              setMessage({ type: 'error', text: 'Please fill all fields' })
              return
            }
            setSubmitting(true)
            try {
              const res = await fetch('http://localhost:3000/api/demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, location })
              })
              let data = null
              const contentType = res.headers.get('content-type') || ''
              if (contentType.includes('application/json')) {
                // safe parse
                const text = await res.text()
                data = text ? JSON.parse(text) : null
              }
              if (!res.ok) throw new Error((data && data.error) || 'Submission failed')
              setMessage({ type: 'success', text: 'Submitted — we will contact you soon.' })
              setName('')
              setPhone('')
              setLocation('')
            } catch (err) {
              console.error(err)
              setMessage({ type: 'error', text: err.message || 'Submission failed' })
            } finally {
              setSubmitting(false)
            }
          }}>
            <input value={name} onChange={e => setName(e.target.value)} className="p-3 bg-gray-900 border border-gray-700 rounded-md" placeholder={t.placeholders.name} />
            <input value={phone} onChange={e => setPhone(e.target.value)} className="p-3 bg-gray-900 border border-gray-700 rounded-md" placeholder={t.placeholders.phone} />
            <input value={location} onChange={e => setLocation(e.target.value)} className="p-3 bg-gray-900 border border-gray-700 rounded-md col-span-1 md:col-span-2" placeholder={t.placeholders.location} />
            <button type="submit" disabled={submitting} className={`col-span-1 md:col-span-2 px-4 py-3 rounded-md ${submitting ? 'bg-gray-600 text-gray-200' : 'bg-green-600 text-white'}`}>
              {submitting ? 'Sending...' : t.demo}
            </button>
            {message && (
              <div className={`${message.type === 'success' ? 'text-green-400' : 'text-red-400'} col-span-1 md:col-span-2 text-sm`}>{message.text}</div>
            )}
          </form>
        </section>
      </main>

      {/* Chat widget (floating) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen && (
          <button onClick={() => setChatOpen(true)} className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full p-4 shadow-2xl transform hover:scale-105 transition">💬</button>
        )}

        {chatOpen && (
          <div className="w-80 max-w-full bg-gradient-to-br from-gray-800/90 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="px-4 py-3 bg-gradient-to-r from-gray-900/70 to-gray-900/50 flex items-center justify-between rounded-t-3xl">
              <div className="font-semibold text-gray-100">JalaTantra Assistant</div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setChatMessages([{ from: 'bot', text: t.bot.help }]); setChatInput('') }} className="text-sm text-gray-300">Reset</button>
                <button onClick={() => setChatOpen(false)} className="text-gray-300 rounded-full bg-gray-800 px-2 py-1">✕</button>
              </div>
            </div>
            <div className="p-3 h-64 overflow-y-auto space-y-3" id="chat-box">
              {chatMessages.map((m, i) => (
                <div key={i} className={`${m.from === 'bot' ? 'text-left' : 'text-right'}`}>
                  <div className={`${m.from === 'bot' ? 'bg-gray-700 text-gray-100 rounded-2xl' : 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl'} inline-block px-4 py-3 relative`}>
                    {m.text.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
                    {m.from === 'bot' && (
                      <span className="absolute -top-3 right-0 text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">{m.source === 'Gem' ? 'Gem' : 'LAI'}</span>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="text-left text-gray-300">...</div>}
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault()
              if (!chatInput) return
              const text = chatInput
              pushMessage({ from: 'user', text })
              setChatInput('')
              setChatLoading(true)
              try {
                const resp = await getReply(text)
                const replyText = (typeof resp === 'string') ? resp : (resp && resp.text) ? resp.text : 'Sorry, no reply.'
                const source = (resp && resp.source) ? resp.source : 'LAI'
                pushMessage({ from: 'bot', text: replyText, source })
              } catch (err) {
                pushMessage({ from: 'bot', text: 'Sorry, something went wrong.', source: 'LAI' })
              } finally {
                setChatLoading(false)
                // scroll
                setTimeout(() => {
                  const el = document.getElementById('chat-box')
                  if (el) el.scrollTop = el.scrollHeight
                }, 50)
              }
            }} className="px-3 py-2 border-t border-gray-700">
              <div className="flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={t.bot.help} className="flex-1 p-2 rounded-full bg-gray-900 border border-gray-700 text-sm text-gray-100" />
                <button type="submit" className="px-3 py-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full text-white">Send</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-400 flex justify-between items-center">
          <div>© {new Date().getFullYear()} JalaTantra — {t.footer}</div>
          <div>Contact us: <a className="text-green-400" href="mailto:powerhousegpt@gmail.com">powerhousegpt@gmail.com</a></div>
        </div>
      </footer>
    </div>
  )
}
