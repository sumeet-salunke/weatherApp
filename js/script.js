const searchInput = document.querySelector("#search-input");

const searchBtn = document.getElementById("search-button")
const resultSection = document.querySelector("#results");


const handleSearch = () => {

  const cityName = searchInput.value.trim();
  if (cityName === "") {
    alert("Please enter e city name");
    return;
  }
  else {
    fetchCoordinates(cityName);
  }
}


const fetchCoordinates = async (cityName) => {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
  const data = await response.json();
  if (!data.results) {
    alert("city not found"); return;
  }
  const latitude = data.results[0].latitude;
  const longitude = data.results[0].longitude;
  fetchWeather(latitude, longitude, cityName);
}

const fetchWeather = async (latitude, longitude, cityName) => {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
  const data = await response.json();
  const temperature = data.current_weather.temperature;
  const windSpeed = data.current_weather.windspeed;
  resultSection.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("weather-card");

  const cityE1 = document.createElement("h3");
  cityE1.textContent = cityName;

  const tempE1 = document.createElement("h2");
  tempE1.textContent = `Temperature: ${temperature}°C`;

  const windE1 = document.createElement("p");
  windE1.innerText = `Wind Speed: ${windSpeed} km/h`;
  card.append(cityE1);
  card.append(tempE1);
  card.append(windE1);
  resultSection.append(card);

}

searchBtn.addEventListener("click", handleSearch);