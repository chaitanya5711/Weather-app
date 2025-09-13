document.getElementById("searchBtn").addEventListener("click", () => {
  const location = document.getElementById("locationInput").value;
  if (location) {
    getWeather(location);
  }
});

// Auto-detect location on load
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      getWeather(`${lat},${lon}`);
    });
  }
};

async function getWeather(location) {
  const apiKey = "YOUR_API_KEY"; // replace with your WeatherAPI key
const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

  try {
    document.getElementById("result").innerHTML = `<p>Loading...</p>`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    // Current weather
    const current = data.current;
    let html = `
      <div class="temp">${current.temp_c}°C</div>
      <img src="${current.condition.icon}" alt="${current.condition.text}">
      <div class="condition">${current.condition.text}</div>
      <p>Feels Like: ${current.feelslike_c}°C</p>
      <p>Humidity: ${current.humidity}%</p>
      <p>Wind: ${current.wind_kph} kph</p>
      <hr>
      <h3>5-Day Forecast</h3>
    `;

    // Forecast
    data.forecast.forecastday.forEach(day => {
      html += `
        <div class="forecast-day">
          <p>${day.date}</p>
          <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
          <p>${day.day.avgtemp_c}°C</p>
          <p>${day.day.condition.text}</p>
        </div>
      `;
    });

    document.getElementById("result").innerHTML = html;
  } catch (error) {
    document.getElementById("result").innerHTML =
      `<p style="color:red;">${error.message}</p>`;
  }
}
