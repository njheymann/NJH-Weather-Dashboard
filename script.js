var searchButton = document.getElementById("search-button");

var cityInput = document.getElementById("city-search");

var clearSearch = document.getElementById("clear-search");

// Current weather Icon
var weatherIconElement = document.getElementById("weather-icon");

// 5 day weather Icon
var weatherIconElements = document.querySelectorAll(".five-day-forecast img");

// Current date
var cityDateElement = document.getElementById("city-date");

// 5 day date
var cityDates = document.querySelectorAll(".five-day-forecast h3");

// Current temp
var temp = document.getElementById("temp");

// 5 day temp
var tempMaxFiveday = document.querySelectorAll(".five-day-forecast #temp-max");
var tempMinFiveday = document.querySelectorAll(".five-day-forecast #temp-min");

// Current wind
var wind = document.getElementById("wind");

// 5 day wind
var windFiveDay = document.querySelectorAll(".five-day-forecast #wind");

// Current humidity
var humidity = document.getElementById("humidity");

// 5 day humidity
humidityFiveDay = document.querySelectorAll(".five-day-forecast #humidity");

// Handlers
searchButton.addEventListener("click", function () {
  var city = cityInput.value;
  searchHistory.push(city);
  localStorage.setItem("history", JSON.stringify(searchHistory));
  saveSearch();
  fiveDayForecast();
});
var limit = 1;
var apiKey = "ec1eab6d6ce100f73dbb1ece9f088f95";
var baseURL = "https://api.openweathermap.org/geo/1.0/direct";
var currentUrl = "https://api.openweathermap.org/data/3.0/onecall";
var weatherIconURL = "https://openweathermap.org/img/wn/${icon}@2x.png";
var lat, lon;
function fiveDayForecast() {
  var city = cityInput.value;
  var cityURL = `${baseURL}?q=${city}, ${city},${city}&limit=${limit}&appid=${apiKey}`;
  fetch(cityURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      var city = data[0].name;

      var fiveDay = `https://api.openweathermap.org/data/2.5/forecast`;
      var fiveDayURL = `${fiveDay}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      fetch(fiveDayURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // CURRENT DAY CONTAINER
          // City name and date
          var city = data.city.name;
          var currentTimeAndDate = data.list[0].dt_txt;
          var date = currentTimeAndDate.split(" ")[0];
          cityDateElement.textContent = city + " (" + date + ")";
          // TEMPERATURE
          var mainTemp = data.list[0].main.temp + "°C";
          temp.textContent = `Current temperature: ` + mainTemp;
          // WIND SPEED
          var windSpeed = (data.list[0].wind.speed * 3.6).toFixed(2) + " km/h";
          wind.textContent = `Wind: ` + windSpeed;
          // HUMIDITY
          var mainHumidity = data.list[0].main.humidity + "%";
          humidity.textContent = `Humidity: ` + mainHumidity;
          // ICON
          var icon = data.list[0].weather[0].icon;
          var weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
          weatherIconElement.src = weatherIcon;

          fetch(fiveDayURL)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              console.log(data);
              // 5 DAY FORECAST CONTAINER
              for (var i = 1; i <= 5; i++) {
                // Date retrieval in YYYY/MM/DD format
                cityDates[i - 1].textContent =
                  data.list[i * 8 - 1].dt_txt.split(" ")[0];
                // Max AND Min temperature retrieval
                var temperatures = [];
                for (var j = 1; j < 8; j++) {
                  var temp = data.list[i * 8 - 8 + j].main.temp;
                  temperatures.push(temp);
                }
                var maxTemp = Math.max(...temperatures);
                var minTemp = Math.min(...temperatures);
                console.log(maxTemp);
                console.log(minTemp);
                tempMaxFiveday[i - 1].textContent =
                  `Max temp: ` + maxTemp + `°C`;
                tempMinFiveday[i - 1].textContent =
                  `Min temp: ` + minTemp + `°C`;

                // Max wind and humidity retrieval
                var maxWind = [];
                var maxHumidity = [];
                for (var j = 0; j < 8; j++) {
                  var humidity = data.list[i * 8 - 8 + j].main.humidity;
                  var winds = data.list[i * 8 - 8 + j].wind.speed * 3.6;
                  maxWind.push(winds);
                  maxHumidity.push(humidity);
                }
                var maxWinds = Math.max(...maxWind);
                windFiveDay[i - 1].textContent =
                  "Wind: " + maxWinds.toFixed(2) + " km/h";
                var maxHumidities = Math.max(...maxHumidity);
                humidityFiveDay[i - 1].textContent =
                  "Humidity: " + maxHumidities + "%";

                console.log("Max winds" + maxWinds);
                console.log("Max humditiy" + maxHumidities);

                // Icon retrieval SET TO DAYTIME ICON ONLY
                var icon = data.list[i * 8 - 1].weather[0].icon.replace(
                  "n",
                  "d"
                );
                var weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                weatherIconElements[i - 1].src = weatherIcon;
              }

              // Final day retrieval, had to be set at the final array due to final day data not showing full day.
              cityDates[4].textContent = data.list[39].dt_txt.split(" ")[0];

              windFiveDay[4].textContent =
                `Wind: ` +
                (data.list[39].wind.speed * 3.6).toFixed(2) +
                " km/h";
              humidityFiveDay[4].textContent =
                `Humidity: ` + data.list[39].main.humidity + "%";
              var icon = data.list[39].weather[0].icon.replace("n", "d");
              weatherIconElements[4].src = weatherIcon;
            });
        });
    })
    // Error handler, alerts you that no city was found then removes it from search history
    .catch(function (error) {
      alert("No city was found");
      var index = searchHistory.indexOf(city);
      if (index > -1) {
        searchHistory.splice(index, 1);
        localStorage.setItem("history", JSON.stringify(searchHistory));
        saveSearch();
      }
    });
}

// SAVE SEARCH
var searchHistory = [];
var saveHistory = localStorage.getItem("history");
if (saveHistory) {
  searchHistory = JSON.parse(saveHistory);
}
var storage = document.getElementById("storage");
function saveSearch() {
  storage.innerHTML = "";
  for (var i = 0; i < searchHistory.length; i++) {
    var makeButton = document.createElement("button");
    makeButton.textContent =
      searchHistory[i].charAt(0).toUpperCase() + searchHistory[i].slice(1);
    makeButton.classList.add("search-history-button");
    makeButton.addEventListener("click", function () {
      var cityName = this.textContent;
      cityInput.value = cityName;
      fiveDayForecast();
    });
    storage.appendChild(makeButton);
  }
}

// CLEAR SEARCH
clearSearch.addEventListener("click", function () {
  localStorage.clear();
  searchHistory = [];
  storage.innerHTML = "";
});
