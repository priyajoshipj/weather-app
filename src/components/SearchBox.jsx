import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../store';
import { getApiResponseResult } from '../utils.js';

function SearchBox(props) {
  const [searchValue, setSearchValue] = useState('');
  const [locationData, setLocationData] = useState([]);
  const [weatherData, setWeatherData] = useState(null); // Store weather data
  const [forecastData, setForecastData] = useState([]); // Store 5-day forecast data
  const [isFocused, setIsFocused] = useState(false);
  const data = useContext(StoreContext);

  // Get location data from the API based on the search value
  const getLocation = async () => {
    if (searchValue.trim() === '') {
      setLocationData([]);
      return;
    }
    const result = await getApiResponseResult(searchValue);
    if (result) {
      setLocationData(result);
    }
  };

  // Effect for debouncing the API call on searchValue change
  useEffect(() => {
    const timer = setTimeout(() => {
      getLocation();
    }, 500); // Debounce to avoid making too many API requests

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  // Fetch weather data from Open-Meteo API based on latitude and longitude
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );
      const data = await response.json();
      if (data) {
        setWeatherData(data.current); // Set current weather data
        setForecastData(data.daily); // Set 5-day forecast data
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Handle location selection and fetch weather data
  const handleSelectLocation = (location) => {
    setSearchValue(`${location.name}, ${location.country}`);
    setLocationData([]); // Clear suggestions after selection

    // Fetch weather data using selected location's lat and lon
    fetchWeatherData(location.latitude, location.longitude);
  };

  // Render the location suggestions list
  const renderLocationList = () => {
    if (locationData.length === 0 || !isFocused) return null;

    return (
      <ul className="list-box">
        {locationData.map((location) => (
          <li
            key={location.id}
            onClick={() => handleSelectLocation(location)}
            className="list-item"
          >
            {location.name} - {location.country}
          </li>
        ))}
      </ul>
    );
  };

  // Render the current weather display
  const renderCurrentWeather = () => {
    if (!weatherData) return null;

    return (
      <div className="weather-info">
        <h3>Current Weather</h3>
        <div>
          Temperature: {weatherData.temperature_2m}°C (Feels like:{' '}
          {weatherData.apparent_temperature}°C)
        </div>
        <div>Humidity: {weatherData.relative_humidity_2m}%</div>
        <div>Wind Speed: {weatherData.wind_speed_10m} m/s</div>
        <div>Precipitation: {weatherData.precipitation} mm</div>
      </div>
    );
  };

  // Render the 5-day forecast
  const renderForecast = () => {
    if (forecastData.length === 0) return null;

    return (
      <div className="forecast">
        <h3>5-Day Forecast</h3>
        <div className="forecast-items">
          {forecastData.map((day, index) => (
            <div className="forecast-item" key={index}>
              <div>{new Date(day.timestamp * 1000).toLocaleDateString()}</div>
              <div>High: {day.temperature_2m_max}°C</div>
              <div>Low: {day.temperature_2m_min}°C</div>
              <div>Precipitation: {day.precipitation_sum} mm</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="search-box-container">
      <input
        type="text"
        placeholder="Search city..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsFocused(true)} // Show suggestions when the input is focused
        onBlur={() => setIsFocused(false)} // Hide suggestions when the input is blurred
      />
      {renderLocationList()}
      {renderCurrentWeather()}
      {renderForecast()}
    </div>
  );
}

export default SearchBox;
