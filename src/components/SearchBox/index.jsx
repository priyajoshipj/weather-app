import React, { useState, useEffect, useCallback } from 'react';
import './styles.css';
import { getLocationData } from '../../utils/api';

const SearchBox = ({ onSelectLocation }) => {
    const [searchValue, setSearchValue] = useState('');
    const [locationData, setLocationData] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLocations = useCallback(async (value) => {
        if (!value?.trim() || value.trim().length < 2) {
            setLocationData([]);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const results = await getLocationData(value);

            if (Array.isArray(results)) {
                setLocationData(results);
            } else {
                setLocationData([]);
                setError('No results found');
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            setError('Failed to fetch locations');
            setLocationData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchLocations(searchValue);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchValue, fetchLocations]);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        setIsFocused(true);
        console.warn("value>>>>", value);
        if (!value.trim()) {
            setLocationData([]);
            setError(null);
        }
    };

    const handleSelectLocation = (location) => {
        setSearchValue(`${location.name}, ${location.country}`);
        setLocationData([]);
        setIsFocused(false);
        setError(null);
        onSelectLocation(location);
    };

    return (
        <div className="search-box">
            <input
                type="text"
                value={searchValue}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setTimeout(() => setIsFocused(false), 200);
                }}
                placeholder="Search city..."
                className="search-input"
                autoComplete="off"
            />
            {isLoading && (
                <div className="loading">Loading...</div>
            )}
            {error && (
                <div className="error">{error}</div>
            )}
            {!isLoading && !error && isFocused && locationData?.length > 0 && (
                <ul className="suggestions">
                    {locationData.map((location) => (
                        <li
                            key={`${location.id}-${location.latitude}-${location.longitude}`}
                            onClick={() => handleSelectLocation(location)}
                            className="suggestion-item"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {location.name}, {location.country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBox; 