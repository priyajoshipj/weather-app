# Weather App

A modern React weather application that allows users to search for any city and view the current weather and a 5-day forecast. Built with React, Vite, and the Open-Meteo API.




https://github.com/user-attachments/assets/357924bb-b6b0-4fa2-a9ae-a18852a3cc69




## Features

- 🌍 **City Search:** Autocomplete city search with instant suggestions.
- ☀️ **Current Weather:** Displays temperature, humidity, wind speed, and precipitation.
- 📅 **5-Day Forecast:** Clean, responsive card layout for upcoming weather.
- ⚡ **Fast & Modern:** Built with Vite for instant reloads and fast builds.
- 🎨 **Responsive UI:** Looks great on desktop and mobile.
- 🧪 **Unit Tested:** Includes tests with Jest and React Testing Library.

## Technologies Used

- **React** (UI library)
- **Vite** (build tool)
- **Open-Meteo API** (weather data)
- **Axios** (API requests)
- **Jest** & **React Testing Library** (testing)
- **CSS** (custom, modular styles)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### 4. Build for production

```bash
npm run build
```

### 5. Run tests

```bash
npm test
```

## Project Structure

```
src/
  components/
    SearchBox.jsx
    SearchBox/styles.css
    WeatherDisplay/
  App.jsx
  index.css
  main.jsx
  utils.js
```

## Customization

- **API:** Uses [Open-Meteo](https://open-meteo.com/) for weather and geocoding.
- **Styling:** All main styles are in `src/components/SearchBox/styles.css` and `src/index.css`.
- **Testing:** Tests are in `src/components/SearchBox/SearchBox.test.jsx`.

## License

MIT


