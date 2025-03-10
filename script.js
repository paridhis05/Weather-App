const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weatherImg = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const locationNotFound = document.querySelector('.location-not-found');
const weatherBody = document.querySelector('.weather-body');
const forecastContainer = document.getElementById('forecast');
const body = document.body;

// Hide "location-not-found" by default
locationNotFound.style.display = "none";

const API_KEY = "b06a04caab711a2ad85933fd7694ed1f"; // Replace with a valid OpenWeather API key

const weatherBackgrounds = {
    "Clear": "linear-gradient(135deg, #ffcc00, #ff6600)",
    "Clouds": "linear-gradient(135deg, #8a8a8a, #b0b0b0)",
    "Rain": "linear-gradient(135deg, #00416A, #E4E5E6)",
    "Snow": "linear-gradient(135deg, #00c6ff, #0072ff)",
    "Mist": "linear-gradient(135deg, #757F9A, #D7DDE8)",
    "Drizzle": "linear-gradient(135deg, #7f8c8d, #95a5a6)",
    "Thunderstorm": "linear-gradient(135deg, #232526, #414345)",
    "Smoke": "linear-gradient(135deg, #555555, #999999)",
    "Haze": "linear-gradient(135deg, #b3a28f, #d1c2aa)",
    "Dust": "linear-gradient(135deg, #c2b280, #e4d5a1)",
    "Fog": "linear-gradient(135deg, #b0b0b0, #e0e0e0)",
    "Sand": "linear-gradient(135deg, #e0ac69, #d8a35c)",
    "Ash": "linear-gradient(135deg, #434343, #6d6d6d)",
    "Squall": "linear-gradient(135deg, #37474f, #607d8b)",
    "Tornado": "linear-gradient(135deg, #1a1a1a, #4d4d4d)",
    "Default": "linear-gradient(135deg, #667eea, #764ba2)" 
};

async function checkWeather(city) {
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const weather_data = await response.json();

        if (weather_data.cod === "404") {
            locationNotFound.style.display = "flex";
            weatherBody.style.display = "none";
            
            // Add shake animation for error message
            locationNotFound.classList.add("shake");
            setTimeout(() => {
                locationNotFound.classList.remove("shake");
            }, 400);

            return;
        }

        locationNotFound.style.display = "none";
        weatherBody.style.display = "flex";

        // Add fade-in effect for smooth appearance
        weatherBody.style.animation = "fadeIn 0.8s ease-in-out";

        const weatherCondition = weather_data.weather[0].main;

        temperature.innerHTML = `${Math.round(weather_data.main.temp)}°C`;
        description.innerHTML = weather_data.weather[0].description;
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        windSpeed.innerHTML = `${weather_data.wind.speed} Km/H`;

        // Set Weather Image
        const weatherIcons = {
            "Clear": "images/clear.png",
            "Clouds": "images/clouds.png",
            "Rain": "images/rain.png",
            "Snow": "images/snow.png",
            "Mist": "images/mist.png",
            "Drizzle": "images/drizzle.png",
            "Thunderstorm": "images/thunderstorm.png",
            "Smoke": "images/smoke.png",
            "Haze": "images/haze.png",
            "Dust": "images/dust.png",
            "Fog": "images/fog.png",
            "Sand": "images/sand.png",
            "Ash": "images/ash.png",
            "Squall": "images/squall.png",
            "Tornado": "images/tornado.png",
            "Default": "images/default.png"
        };
        
        // Function to update weather icon
        function updateWeatherIcon(condition) {
            weatherImg.src = weatherIcons[condition] || weatherIcons["Default"];
        }

        // Inside checkWeather() function (AFTER setting `weatherCondition`)
        updateWeatherIcon(weatherCondition);  

        // Change Background
        body.style.background = weatherBackgrounds[weatherCondition] || weatherBackgrounds["Default"];
        body.style.transition = "background 1s ease-in-out";

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

async function checkForecast(city) {
    if (!city) return;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const forecastData = await response.json();

        if (forecastData.cod === "404") {
            forecastContainer.innerHTML = "<p>Forecast data not available</p>";
            return;
        }

        forecastContainer.innerHTML = ""; // Clear previous data

        const dailyForecasts = {};
        forecastData.list.forEach((item) => {
            const date = item.dt_txt.split(" ")[0]; // Extract date
            if (!dailyForecasts[date] && item.dt_txt.includes("12:00:00")) {
                dailyForecasts[date] = item;
            }
        });

        Object.values(dailyForecasts).forEach((day) => {
            const temp = Math.round(day.main.temp);
            const description = day.weather[0].description;
            const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
            const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });

            const forecastItem = `
                <div class="forecast-item">
                    <p>${date}</p>
                    <img src="${icon}" alt="${description}">
                    <p style="padding-bottom: 5px;">${temp}°C</p>
                    <p>${description}</p>
                </div>
            `;
            forecastContainer.innerHTML += forecastItem;
        });

        // Show forecast with animation
        forecastContainer.style.opacity = "0";
        setTimeout(() => {
            forecastContainer.style.animation = "slideDown 0.8s ease-in-out forwards";
        }, 500);

    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

// Event Listener to Fetch Weather & Forecast
searchBtn.addEventListener("click", () => {
    const city = inputBox.value.trim();
    
    if (city) {
        checkWeather(city);
        checkForecast(city);
    }
});
