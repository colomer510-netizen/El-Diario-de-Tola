"use client";

import { useState, useEffect } from "react";

// Tola, Rivas, Nicaragua
const LAT = 11.442;
const LON = -86.035;

export function WeatherWidget() {
  const [temp, setTemp] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&timezone=America/Managua`
        );
        const data = await res.json();
        if (data && data.current_weather) {
          setTemp(Math.round(data.current_weather.temperature));
          setWeatherCode(data.current_weather.weathercode);
        }
      } catch (error) {
        console.error("No se pudo obtener el clima de Tola", error);
      }
    }
    
    // Fetch initial weather
    fetchWeather();
    // Update every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (temp === null) return null; // No mostrar nada mientras carga

  // Simple interpretador de weather codes de WMO
  let icon = "🌤️";
  if (weatherCode === 0 || weatherCode === 1) icon = "☀️"; // Despejado
  else if (weatherCode === 2) icon = "⛅"; // Poco nublado
  else if (weatherCode === 3) icon = "☁️"; // Nublado
  else if (weatherCode !== null && weatherCode >= 50 && weatherCode <= 69) icon = "🌧️"; // Lluvia
  else if (weatherCode !== null && weatherCode >= 95) icon = "⛈️"; // Tormenta

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f0f0f0]/60 rounded-full text-xs font-sans text-[#444] font-medium tooltip-container relative group cursor-pointer transition-colors hover:bg-[#e5e5e5]">
      <span className="text-base leading-none">{icon}</span>
      <span>{temp}°C</span>
      
      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        Clima en tiempo real (Tola, Rivas)
      </div>
    </div>
  );
}
