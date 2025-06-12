import React from 'react';
import './styles.css';

const WeatherDisplay = ({ weatherData, forecastData }) => {
    if (!weatherData) {
        return null;
    }

    return (
        <div className="weather-display" data-testid="weather-display">
            <div className="current-weather" data-testid="current-weather">
                <h2>Current Weather</h2>
                <div className="weather-details">
                    <div className="detail">
                        <h3>Temperature</h3>
                        <p>{weatherData.temperature}°C</p>
                        <p className="feels-like">Feels like: {weatherData.apparent_temperature}°C</p>
                    </div>
                    <div className="detail">
                        <h3>Humidity</h3>
                        <p>{weatherData.humidity || '--'}%</p>
                    </div>
                    <div className="detail">
                        <h3>Wind Speed</h3>
                        <p>{weatherData.windspeed || '--'} km/h</p>
                    </div>
                    <div className="detail">
                        <h3>Precipitation</h3>
                        <p>{weatherData.precipitation || '--'} mm</p>
                    </div>
                </div>
            </div>

            {forecastData?.length > 0 && (
                <div className="forecast" data-testid="forecast-container">
                    <h2>5-Day Forecast</h2>
                    <div className="forecast-container">
                        {forecastData.map((day) => (
                            <div key={day.time} className="forecast-day">
                                <h3>{new Date(day.time).toLocaleDateString('en-US', { weekday: 'short' })}</h3>
                                <p>High: {day.temperature_2m_max}°C</p>
                                <p>Low: {day.temperature_2m_min}°C</p>
                                <p>Precipitation: {day.precipitation_sum} mm</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherDisplay; 