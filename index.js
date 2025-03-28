const API_KEY = "d45e8c6f7c534dd99a5120838252603"; // WeatherAPI key

// Select DOM elements
const cityInput = document.getElementById("cityName");
const searchBtn = document.getElementById("searchBtn");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const dropdown = document.getElementById("dropdown");

// Function to fetch and display weather data
async function getWeather(query) {
    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=5&aqi=no&alerts=no`
        );

        if (!response.ok) {
            throw new Error(`City not found! (Status: ${response.status})`);
        }

        const data = await response.json();

        // Update current weather section
        document.getElementById("city").innerText = `City: ${data.location.name}`;
        document.getElementById("temp").innerText = `${data.current.temp_c}`;
        document.getElementById("condition").innerText = data.current.condition.text;
        document.getElementById("humidity").innerText = `${data.current.humidity}`;
        document.getElementById("wind").innerText = `${data.current.wind_kph} `;

        // Save to recent searches
        saveRecentSearch(data.location.name);

        // Update 5-day forecast
        updateForecast(data.forecast.forecastday);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching weather data. Please try again.");
    }
}

// Function to update the 5-day forecast section
function updateForecast(forecast) {
    for (let i = 0; i < 5; i++) {
        document.getElementById(`day${i + 1}`).innerText = forecast[i].date;
        document.getElementById(`icon${i + 1}`).src = forecast[i].day.condition.icon;
        document.getElementById(`temp${i + 1}`).innerText = `${forecast[i].day.avgtemp_c}°C`;
        document.getElementById(`wind${i + 1}`).innerText = `Wind: ${forecast[i].day.maxwind_kph} km/h`;
        document.getElementById(`humidity${i + 1}`).innerText = `Humidity: ${forecast[i].day.avghumidity}%`;
    }
}

// Function to get current location weather
function getCurrentLocationWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeather(`${lat},${lon}`);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve location. Please enable location access.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Save recent searches to localStorage
function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    // Avoid duplicates
    if (!searches.includes(city)) {
        searches.push(city);
        if (searches.length > 5) searches.shift(); // Keep last 5 searches
        localStorage.setItem("recentSearches", JSON.stringify(searches));
    }

    updateDropdown();
}

// Update the dropdown menu
function updateDropdown() {
    dropdown.innerHTML = ""; // Clear previous dropdown
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    if (searches.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    dropdown.style.display = "block"; // Show dorpdown
    searches.forEach(city => {
        const option = document.createElement("div");
        option.classList.add("dropdown-item", "cursor-pointer", "p-2", "hover:bg-gray-200", "border-b");
        option.innerText = city;
        option.addEventListener("click", () => {
            cityInput.value = city; // Update input filed
            getWeather(city); // Fetch weather
            dropdown.style.display = "none"; // Hide dropdown after selectionn
        });
        dropdown.appendChild(option);
    });
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeather(cityName);
    } else {
        alert("Please enter a city name!");
    }
});


cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

currentLocationBtn.addEventListener("click", getCurrentLocationWeather);

// Load recent searches on page load
document.addEventListener("DOMContentLoaded", updateDropdown);
