import React, { useEffect, useState } from "react";

type WeatherData = {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
};

type Coords = {
    lat: number;
    lon: number;
};

const getWeatherInfo = (code: number) => {
    if (code === 0) return { label: "Clear", icon: "☀️", color: "#facc15" };
    if (code <= 3) return { label: "Cloudy", icon: "☁️", color: "#94a3b8" };
    if (code <= 48) return { label: "Fog", icon: "🌫", color: "#64748b" };
    if (code <= 67) return { label: "Rain", icon: "🌧", color: "#38bdf8" };
    if (code <= 77) return { label: "Snow", icon: "❄️", color: "#e0f2fe" };
    if (code <= 99) return { label: "Storm", icon: "⛈", color: "#6366f1" };

    return { label: "Unknown", icon: "❓", color: "#888" };
};

const Weather: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [coords, setCoords] = useState<Coords | null>(null);
    const [location, setLocation] = useState<string>("Detecting...");

    // 📍 Get user location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                });
            },
            () => {
                // fallback to Chennai
                setCoords({ lat: 13.0827, lon: 80.2707 });
            }
        );
    }, []);

    // 🌦 Fetch weather + location
    useEffect(() => {
        if (!coords) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // 🌦 Weather API
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&timezone=auto`
                );
                const weatherData = await weatherRes.json();
                setWeather(weatherData.current_weather);

                // 📍 Reverse Geocoding
                const locRes = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${coords.lat}&longitude=${coords.lon}&count=1`
                );
                const locData = await locRes.json();

                if (locData?.results?.length > 0) {
                    const place = locData.results[0];
                    setLocation(`${place.name}, ${place.country}`);
                } else {
                    setLocation("Unknown location");
                }

            } catch (err) {
                console.error("Error:", err);
                setLocation("Location unavailable");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [coords]);

    const weatherInfo = weather
        ? getWeatherInfo(weather.weathercode)
        : null;

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ color: "#00D4FF", fontSize: "24px", margin: "0" }}>
                {weatherInfo?.icon} Weather
            </h2>

            {loading ? (
                <div style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", padding: "40px 20px" }}>
                    Fetching weather...
                </div>
            ) : weather ? (
                <div
                    style={{
                        padding: "24px",
                        background: "rgba(10,15,28,0.5)",
                        backdropFilter: "blur(16px)",
                        border: `1px solid rgba(255,255,255,0.1)`,
                        boxShadow: `0 0 20px rgba(0,212,255,0.2), inset 0 0 15px rgba(0,212,255,0.05)`,
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.3)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(0,212,255,0.3), inset 0 0 15px rgba(0,212,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(0,212,255,0.2), inset 0 0 15px rgba(0,212,255,0.05)";
                    }}
                >
                    {/* Location */}
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "8px", margin: "0 0 12px 0" }}>
                        📍 {location}
                    </p>

                    {/* Temperature */}
                    <h1 style={{ fontSize: "56px", margin: "0 0 10px 0", color: "#00D4FF", fontWeight: "bold" }}>
                        {weather.temperature}°C
                    </h1>

                    {/* Condition */}
                    <p style={{ fontSize: "18px", margin: "0 0 20px 0", color: "rgba(255,255,255,0.8)" }}>
                        {weatherInfo?.label}
                    </p>

                    {/* Grid Info */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "16px",
                            fontSize: "14px",
                            textAlign: "left",
                        }}
                    >
                        <div
                            style={{
                                padding: "12px",
                                background: "rgba(0,212,255,0.08)",
                                border: "1px solid rgba(0,212,255,0.2)",
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.15)";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.08)";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                            }}
                        >
                            <div style={{ color: "rgba(255,255,255,0.7)" }}>🌬 Wind</div>
                            <div style={{ color: "#00D4FF", fontWeight: "bold", marginTop: "4px" }}>
                                {weather.windspeed} km/h
                            </div>
                        </div>

                        <div
                            style={{
                                padding: "12px",
                                background: "rgba(0,212,255,0.08)",
                                border: "1px solid rgba(0,212,255,0.2)",
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.15)";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.08)";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                            }}
                        >
                            <div style={{ color: "rgba(255,255,255,0.7)" }}>🕒 Updated</div>
                            <div style={{ color: "#00D4FF", fontWeight: "bold", marginTop: "4px" }}>
                                {new Date(weather.time).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p style={{ color: "rgba(255,255,255,0.6)" }}>Failed to load weather</p>
            )}
        </div>
    );
};

export default Weather;