import React, { useState } from 'react';
import SearchBox from './components/SearchBox';
import WeatherDisplay from './components/WeatherDisplay';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  const handleSelectLocation = async (location) => {
    try {
      const { latitude, longitude } = location;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );
      const data = await response.json();

      setWeatherData({
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windspeed: data.current.wind_speed_10m
      });

      setForecastData(
        data.daily.time.map((time, index) => ({
          time,
          temperature_2m_max: data.daily.temperature_2m_max[index],
          temperature_2m_min: data.daily.temperature_2m_min[index]
        }))
      );
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="app">
      <h1>Weather App</h1>
      <SearchBox onSelectLocation={handleSelectLocation} />
      <WeatherDisplay weatherData={weatherData} forecastData={forecastData} />
    </div>
  );
};

export default App;
