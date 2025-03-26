const API_KEY = "d45e8c6f7c534dd99a5120838252603"; // Use your WeatherAPI key

async function getWeather(city) {
    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
        );

        if (!response.ok) {
            throw new Error(`City not found! (Status: ${response.status})`);
        }

        const data = await response.json();

        // Update the UI with weather data
        document.getElementById("city").innerText = `City: ${data.location.name}`;
        document.getElementById("temp").innerText = `${data.current.temp_c}°C`;
        document.getElementById("condition").innerText = data.current.condition.text;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Check city name or API key.");
    }
}

// Event listener for search button
document.getElementById("searchBtn").addEventListener("click", () => {
    const cityName = document.getElementById("cityName").value.trim();
    
    if (cityName) {
        getWeather(cityName);
    } else {
        alert("Please enter a city name!");
    }
});
