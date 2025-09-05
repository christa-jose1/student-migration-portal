import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  name: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (searchCity) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
        )
        .then((response) => setWeather(response.data))
        .catch((error) => console.error("Error fetching weather:", error));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            )
            .then((response) => setWeather(response.data))
            .catch((error) => console.error("Error fetching weather:", error));
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, [searchCity]);

  const handleSearch = () => {
    setSearchCity(city);
  };

  return (
    <div className="p-4 bg-blue-100 rounded-xl shadow-md w-80 text-center">
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="px-2 py-1 rounded border border-gray-300 flex-1 bg-white text-black placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>
      {weather ? (
        <>
          <h2 className="text-lg font-bold text-blue-500 drop-shadow">
            {weather.name} Weather
          </h2>

          <p className="text-3xl font-semibold text-blue-500 drop-shadow-sm">
            {weather.main.temp}°C
          </p>

          <p className="capitalize text-blue-300 italic mb-2">
            {weather.weather[0].description}
          </p>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
            className="mx-auto"
          />
        </>
      ) : (
        <p>Fetching weather...</p>
      )}
    </div>
  );
};

export default Weather;
