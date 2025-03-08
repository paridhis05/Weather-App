const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weatherImg = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const locationNotFound = document.querySelector('.location-not-found');
const weatherBody = document.querySelector('.weather-body');

async function checkWeather(city) {
    const API_KEY = "b06a04caab711a2ad85933fd7694ed1f";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const weather_data = await response.json();

        if (weather_data.cod === 404) {
            locationNotFound.style.display = "flex";
            weatherBody.style.display = "none";
            console.log("Location not found");
            return;
        }

        locationNotFound.style.display = "none";
        weatherBody.style.display = "flex";

        temperature.innerHTML = `${Math.round(weather_data.main.temp)}°C`;
        description.innerHTML = `${weather_data.weather[0].description}`;
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        windSpeed.innerHTML = `${weather_data.wind.speed} Km/H`;

        switch (weather_data.weather[0].main) {
            case 'Clouds':
                weatherImg.src = "images/cloudy.png";
                break;
            case 'Clear':
                weatherImg.src = "images/clear.png";
                break;
            case 'Rain':
                weatherImg.src = "images/raining.png";
                break;
            case 'Mist':
                weatherImg.src = "images/haze.png";
                break;
            case 'Snow':
                weatherImg.src = "images/snow.png";
                break;
            default:
                weatherImg.src = "images/default.png";
        }

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value.trim());
});
