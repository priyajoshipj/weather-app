import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../store';
import { getApiResponseResult } from '../utils.js';

function SearchBox(props) {
  const [searchValue, setSearchValue] = useState('');
  const [locationData, setLocationData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const data = useContext(StoreContext);

  // Get location data from the API based on the search value
  const getLocation = async () => {
    if (searchValue.trim() === '') {
      setLocationData([]);
      return;
    }
    try {
      console.log('Fetching location for:', searchValue);
      const result = await getApiResponseResult(searchValue);
      console.log('API Response:', result);
      if (result && Array.isArray(result)) {
        setLocationData(result);
      } else {
        setLocationData([]);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      setError('Failed to fetch location data');
    }
  };

  // Effect for debouncing the API call on searchValue change
  useEffect(() => {
    const timer = setTimeout(() => {
      getLocation();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  // Fetch weather data from Open-Meteo API based on latitude and longitude
  const fetchWeatherData = async (lat, lon) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }

      const data = await response.json();
      if (data) {
        setWeatherData(data.current);
        setForecastData(data.daily);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location selection and fetch weather data
  const handleSelectLocation = (location) => {
    console.log('handleSelectLocation called with:', location);
    if (!location || !location.latitude || !location.longitude) {
      console.error('Invalid location data:', location);
      setError('Invalid location data');
      return;
    }

    setSearchValue(`${location.name}, ${location.country}`);
    setLocationData([]);
    fetchWeatherData(location.latitude, location.longitude);
  };

  // Render the location suggestions list
  const renderLocationList = () => {
    console.log('Rendering location list. Data:', locationData);
    console.log('isFocused:', isFocused);

    if (locationData.length === 0 || !isFocused) return null;

    return (
      <ul className="list-box">
        {locationData.map((location) => {
          console.log('Rendering location item:', location);
          return (
            <li
              key={`${location.id}-${location.latitude}-${location.longitude}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Location clicked:', location);
                handleSelectLocation(location);
              }}
              className="list-item"
              style={{
                cursor: 'pointer',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '5px',
                backgroundColor: '#fff',
                transition: 'background-color 0.2s'
              }}
            >
              {location.name}, {location.country}
            </li>
          );
        })}
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
    if (!forecastData || !forecastData.time || forecastData.time.length === 0) return null;

    return (
      <div className="forecast">
        <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>5-Day Forecast</h3>


        {forecastData.time.map((date, index) => (
          <div className="forecast-item" key={date}>
            <div>{new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div>High: {forecastData.temperature_2m_max[index]}°C</div>
            <div>Low: {forecastData.temperature_2m_min[index]}°C</div>
            <div>Precipitation: {forecastData.precipitation_sum[index]} mm</div>
          </div>
        ))}


      </div>
    );
  };

  return (
    <div className="search-box-container">
      <input
        type="text"
        placeholder="Select a city to see weather information...."
        value={searchValue}
        onChange={(e) => {
          console.log('Input changed:', e.target.value);
          setSearchValue(e.target.value);
        }}
        onFocus={() => {
          console.log('Input focused');
          setIsFocused(true);
        }}
        onBlur={() => {
          console.log('Input blurred');
          // Add a small delay to allow click events to fire
          setTimeout(() => setIsFocused(false), 200);
        }}
      />
      {error && <div className="error">{error}</div>}
      {isLoading && <div className="loading">Loading weather data...</div>}
      {renderLocationList()}
      {renderCurrentWeather()}
      {renderForecast()}
    </div>
  );
}

export default SearchBox;
