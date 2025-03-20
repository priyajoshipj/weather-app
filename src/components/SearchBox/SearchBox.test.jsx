import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from './index';
import * as api from '../../utils/api';

// Mock the api module
jest.mock('../../utils/api', () => ({
    getLocationData: jest.fn()
}));

describe('SearchBox Component', () => {
    const mockLocations = [
        { id: 1, name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
        { id: 2, name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        api.getLocationData.mockImplementation(() => Promise.resolve(mockLocations));
    });

    test('renders search input', () => {
        render(<SearchBox onSelectLocation={() => { }} />);
        expect(screen.getByPlaceholderText('Search city...')).toBeInTheDocument();
    });

    test('updates input value when user types', async () => {
        render(<SearchBox onSelectLocation={() => { }} />);
        const input = screen.getByPlaceholderText('Search city...');
        await userEvent.type(input, 'London');
        expect(input.value).toBe('London');
    });

    test('displays suggestions after successful API response', async () => {
        render(<SearchBox onSelectLocation={() => { }} />);
        const input = screen.getByPlaceholderText('Search city...');

        await userEvent.type(input, 'London');

        await waitFor(() => {
            const suggestions = screen.getAllByRole('listitem');
            expect(suggestions).toHaveLength(2);
            expect(suggestions[0]).toHaveTextContent('London, United Kingdom');
            expect(suggestions[1]).toHaveTextContent('Paris, France');
        });
    });

    test('handles API error gracefully', async () => {
        api.getLocationData.mockImplementation(() => Promise.reject(new Error('API Error')));

        render(<SearchBox onSelectLocation={() => { }} />);
        const input = screen.getByPlaceholderText('Search city...');

        await userEvent.type(input, 'London');

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch locations')).toBeInTheDocument();
        });
    });
});