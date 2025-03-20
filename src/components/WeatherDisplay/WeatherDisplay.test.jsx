import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherDisplay from './index';

describe('WeatherDisplay Component', () => {
    // Mock data for tests
    const mockWeatherData = {
        temperature: 20,
        humidity: 65,
        windspeed: 10,
        precipitation: 0.5,
        apparent_temperature: 22
    };

    const mockForecastData = [
        {
            time: '2024-02-20',
            temperature_2m_max: 22,
            temperature_2m_min: 15,
            precipitation_sum: 0
        },
        {
            time: '2024-02-21',
            temperature_2m_max: 23,
            temperature_2m_min: 16,
            precipitation_sum: 2.5
        },
        {
            time: '2024-02-22',
            temperature_2m_max: 21,
            temperature_2m_min: 14,
            precipitation_sum: 1.0
        }
    ];

    test('renders weather data correctly', () => {
        render(<WeatherDisplay weatherData={mockWeatherData} forecastData={[]} />);

        expect(screen.getByText('20°C')).toBeInTheDocument();
        expect(screen.getByText('65%')).toBeInTheDocument();
        expect(screen.getByText('10 km/h')).toBeInTheDocument();
        expect(screen.getByText('0.5 mm')).toBeInTheDocument();
    });

    test('shows no data message when weather data is null', () => {
        render(<WeatherDisplay weatherData={null} forecastData={[]} />);
        expect(screen.getByText(/Select a city to see weather information/i)).toBeInTheDocument();
    });

    test('formats forecast dates correctly', () => {
        render(<WeatherDisplay weatherData={mockWeatherData} forecastData={mockForecastData} />);

        const date = new Date('2024-02-20');
        expect(screen.getByText(date.toLocaleDateString('en-US', { weekday: 'short' }))).toBeInTheDocument();
    });

    test('handles empty forecast data gracefully', () => {
        render(<WeatherDisplay weatherData={mockWeatherData} forecastData={[]} />);
        expect(screen.queryByTestId('forecast-container')).not.toBeInTheDocument();
    });

    test('displays precipitation information correctly', () => {
        render(<WeatherDisplay weatherData={mockWeatherData} forecastData={mockForecastData} />);

        mockForecastData.forEach(day => {
            expect(screen.getByText(new RegExp(`${day.precipitation_sum} mm`))).toBeInTheDocument();
        });
    });

    test('applies correct CSS classes for weather conditions', () => {
        render(<WeatherDisplay weatherData={mockWeatherData} forecastData={mockForecastData} />);

        expect(screen.getByTestId('weather-display')).toHaveClass('weather-display');
        expect(screen.getByTestId('current-weather')).toHaveClass('current-weather');
    });

    test('handles extreme weather values appropriately', () => {
        const extremeData = {
            temperature: 45,
            humidity: 100,
            windspeed: 120,
            precipitation: 300,
            apparent_temperature: 50
        };

        render(<WeatherDisplay weatherData={extremeData} forecastData={[]} />);
        expect(screen.getByText(/45°C/)).toBeInTheDocument();
        expect(screen.getByText(/100%/)).toBeInTheDocument();
    });

    test('updates display when weather data changes', () => {
        const { rerender } = render(<WeatherDisplay weatherData={mockWeatherData} forecastData={[]} />);
        expect(screen.getByText(/20°C/)).toBeInTheDocument();

        const newData = { ...mockWeatherData, temperature: 25 };
        rerender(<WeatherDisplay weatherData={newData} forecastData={[]} />);
        expect(screen.getByText(/25°C/)).toBeInTheDocument();
    });
}); 