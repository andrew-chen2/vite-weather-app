import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
    const [data, setData] = useState(null);
    const [coords, setCoords] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coordinates = `${position.coords.latitude},${position.coords.longitude}`;
                    setCoords(coordinates);
                },
                (error) => {
                    setError(error.message);
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchWeatherData = () => {
            if (coords) {
                fetch(`https://api.weatherapi.com/v1/forecast.json?key=0cd0be0407a041aa99581301232207&q=${coords}&days=3&aqi=no&alerts=no`)
                    .then((response) => response.json())
                    .then((json) => {
                        setData(json);
                        setLoading(false);
                    })
                    .catch((e) => {
                        setError('Failed to fetch weather data.');
                        setLoading(false);
                    });
            }
        };

        fetchWeatherData(); // Fetch the weather data immediately after coords is set

        const intervalId = setInterval(fetchWeatherData, 60000); // Fetch weather data every 60 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [coords]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {data ? (
                <div className="weather-container">
                    <div className="location-weather">
                        <div className="location-info">
                            <h2>{data.location.name}, {data.location.region}</h2>
                            <p>{data.location.country}</p>
                            <p>{data.location.localtime}</p>
                        </div>
                        <div className="current-weather">
                            <img src={`https:${data.current.condition.icon}`} alt={data.current.condition.text} />
                            <h1>{data.current.temp_c}°C</h1>
                            <p>{data.current.condition.text}</p>
                        </div>
                    </div>

                    <div className="weather-details">
                        <div className="detail">
                            <span>Feels like:</span>
                            <span>{data.current.feelslike_c}°C</span>
                        </div>
                        <div className="detail">
                            <span>Humidity:</span>
                            <span>{data.current.humidity}%</span>
                        </div>
                        <div className="detail">
                            <span>Wind:</span>
                            <span>{data.current.wind_kph} kph {data.current.wind_dir}</span>
                        </div>
                        <div className="detail">
                            <span>Pressure:</span>
                            <span>{data.current.pressure_mb} mb</span>
                        </div>
                        <div className="detail">
                            <span>Visibility:</span>
                            <span>{data.current.vis_km} km</span>
                        </div>
                        <div className="detail">
                            <span>UV Index:</span>
                            <span>{data.current.uv}</span>
                        </div>
                    </div>

                    <div className="forecast">
                        <h3>Forecast</h3>
                        <div className="forecast-grid">
                            {data.forecast.forecastday.map((day, index) => (
                                <div key={index} className="forecast-day">
                                    <p>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                    <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} />
                                    <p>{day.day.avgtemp_c}°C</p>
                                    <p>{day.day.condition.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default Weather;