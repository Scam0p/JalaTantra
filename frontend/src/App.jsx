import React, { useState, useEffect, useRef } from 'react'

const DashboardCard = ({ title, value, children, progress, statusColor }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {statusColor && <span className={`text-sm font-semibold ${statusColor}`}>{value}</span>}
      </div>
      {!statusColor && (
        <div className="mt-4">
          <div className="text-3xl font-bold text-gray-100">{value}</div>
          {typeof progress === 'number' && (
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{progress}%</div>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  )
}

export default function App() {
  // initial realistic values
  const [data, setData] = useState({
    temperature: 28,
    humidity: 70,
    soilMoisture: 55,
    rainfallPrediction: 1, // 1 => Rain Expected
    waterLevel: 75,
    motorStatus: true,
  })

  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

    const randomStep = (maxStep = 2) => (Math.random() * 2 - 1) * maxStep

    const tick = () => {
      setData(prev => {
        // small random-walk changes
        const temperature = clamp(Math.round((prev.temperature + randomStep(0.6)) * 10) / 10, 15, 40)
        const humidity = Math.round(clamp(prev.humidity + randomStep(3), 20, 100))
        const soilMoisture = Math.round(clamp(prev.soilMoisture + randomStep(3), 0, 100))
        // rainfall: occasional flips, low probability
        const rainfallPrediction = Math.random() < 0.05 ? 1 - prev.rainfallPrediction : prev.rainfallPrediction
        // water level drains slowly or is refilled occasionally
        const waterLevel = Math.round(clamp(prev.waterLevel + randomStep(2), 0, 100))
        // motor toggles rarely, based on water level or small random chance
        const motorStatus = (waterLevel < 30) ? true : (Math.random() < 0.02 ? !prev.motorStatus : prev.motorStatus)

        return { temperature, humidity, soilMoisture, rainfallPrediction, waterLevel, motorStatus }
      })
    }

    const id = setInterval(() => {
      if (mounted.current) tick()
    }, 2500)

    return () => {
      mounted.current = false
      clearInterval(id)
    }
  }, [])

  const displayTemp = v => `${v}°C`
  const displayPct = v => `${v}%`

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">JalaTantra Dashboard</h1>
          <p className="text-sm text-gray-400">Overview of sensor readings (placeholder data)</p>
        </header>

        <main>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Temperature" value={displayTemp(data.temperature)} />

            <DashboardCard title="Humidity" value={displayPct(data.humidity)} progress={data.humidity} />

            <DashboardCard title="Soil Moisture" value={displayPct(data.soilMoisture)} progress={data.soilMoisture} />

            <DashboardCard
              title="Rainfall Prediction"
              value={data.rainfallPrediction === 1 ? 'Rain Expected' : 'No Rain'}
            />

            <DashboardCard title="Water Level" value={displayPct(data.waterLevel)} progress={data.waterLevel} />

            <DashboardCard
              title="Motor Status"
              value={data.motorStatus ? 'ON' : 'OFF'}
              statusColor={data.motorStatus ? 'text-green-400' : 'text-red-400'}
            />
          </section>
        </main>
      </div>
    </div>
  )
}
