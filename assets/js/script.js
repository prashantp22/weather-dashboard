var searchButtonEl = document.querySelector("#button");
var inputEl = document.querySelector("#input");
var searcheEl = document.querySelector("#searches");
var cityNameEl = document.querySelector("#city-name");
var currentTempEl = document.querySelector("#temp");
var currentHumidEl = document.querySelector("#humidity");
var currentWindEl = document.querySelector("#wind");
var currentUVEl = document.querySelector("#uv");


var searchedCities = [];

// city search function
var formSubmitHandler = function (event) {
    event.preventDefault();
    
    
    var requestedCity = inputEl.value.trim();
    if (requestedCity) {
       
        cityList = document.createElement("li");
        cityList.className = "nav-item";
        cityList.innerHTML="<a class='nav-link border' href='#'><span data-feather='file'></span>" + requestedCity + "</a>";

        searcheEl.appendChild(cityList); 


       
        searchedCities.push(requestedCity);

        
        localStorage.setItem("previousCities", JSON.stringify(searchedCities));
        
     
        getWeather(requestedCity);
        
        cityInputEl.value = "";
    } else {
        alert("City not found!");
    }
}

// today's weather api
var getWeather = function (cityName) {
  
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

   
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // send data to today weather display function
                displayTodaysWeather(data, cityName);
                 // get UV Index
                getUVIndex(data.coord.lon, data.coord.lat);
                // get weekly weather
                getWeeklyWeather(data.coord.lon, data.coord.lat);
            });
        }
    });
}

var displayTodaysWeather = function (info, city) {
  
    document.querySelectorAll(".current").textContent="";

    // add city to top of page
    cityNameEl.textContent = city + " " + moment().format("L");


    
    var temp = info.main.temp
    var fixedTemp = temp.toFixed(1);
    currentTempEl.innerHTML = fixedTemp + "&deg; F";

    currentHumidEl.textContent = info.main.humidity + "%";
    
 
    var windSpeed = info.wind.speed;
    var fixedWindSpeed = windSpeed.toFixed(1);
    currentWindEl.textContent = fixedWindSpeed + " MPH";
}

var getUVIndex = function (lon, lat) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=8fc9d3841b8ffcc0fce5fb6a16a654cc&lat=" + lat +"&lon=" + lon;
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // save uv value
                var uv = data.value;
                currentUVEl.textContent = uv;
                // add color to UV index
                if (uv > 5 ) {
                    currentUVEl.className = "bg-danger"
                } else if (uv < 3) {
                    currentUVEl.className = "bg-success"
                } else {
                    currentUVEl.className = "bg-warning"
                }
                return uv;
            });
        }
    });
}

// get weekly weather
var getWeeklyWeather = function (lon, lat) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayWeeklyWeather(data);
            })
        }
    })
}

var displayWeeklyWeather = function (info) {
    // clear content
    document.querySelectorAll(".card-header").textContent="";

    for (var i=1; i < 6; i++) {
        var date = moment().add(i, 'd').format('L');
        document.querySelector(".day-" + i).textContent = date;

    
        var temp = info.daily[i].temp.day;
        var humidity = info.daily[i].humidity;
        document.querySelector(".temp-" + [i]).innerHTML = temp + "&deg; F";
        document.querySelector(".humid-" + [i]).textContent = humidity + "%";
    }
}

// get previously searched cities from local storage
var loadLocalStorage = function () {
    
    var previousCities = JSON.parse(localStorage.getItem('previousCities'));
    
    if (previousCities === null) {
        return;
       
    } else {
        for (var i = 0; i < previousCities.length; i++) {
            
        cityList = document.createElement("li");
        cityList.className = "nav-item";
        cityList.innerHTML="<a class='nav-link border' href='#'><span data-feather='file'></span>" + previousCities[i] + "</a>";

        searcheEl.appendChild(cityList); 
        }
    }
}


loadLocalStorage();

searchButtonEl.addEventListener("click", formSubmitHandler);

// click previously searched city
var citySaved = function (event) {
    var city = event.target.textContent;
    getWeather(city);
}

searcheEl.addEventListener("click", citySaved);