var searchFormEl = document.querySelector("#city-search-submit");
var cityInputEl = document.querySelector("#city-input");
var previousSearchesEl = document.querySelector("#previous-searches");
var cityNameEl = document.querySelector("#city-name");
var todayTempEl = document.querySelector("#temp");
var todayHumidEl = document.querySelector("#humid");
var todayWindEl = document.querySelector("#wind");
var todayUVEl = document.querySelector("#uv");


var previouslySearchedCities = [];

// once city is searched, perform this function
var formSubmitHandler = function (event) {
    event.preventDefault();
    
    
    var requestedCity = cityInputEl.value.trim();
    if (requestedCity) {
       
        previousCityListItem = document.createElement("li");
        previousCityListItem.className = "nav-item";
        previousCityListItem.innerHTML="<a class='nav-link border' href='#'><span data-feather='file'></span>" + requestedCity + "</a>";

        previousSearchesEl.appendChild(previousCityListItem); 


       
        previouslySearchedCities.push(requestedCity);

        
        localStorage.setItem("previousCities", JSON.stringify(previouslySearchedCities));
        
     
        getWeather(requestedCity);
        
        cityInputEl.value = "";
    } else {
        alert("City not found!");
    }
}

// fetch api call for today's weather
var getWeather = function (cityName) {
  
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

   
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // send data to function that will display elements on page
                displayTodaysWeather(data, cityName);
            })
        } else {
                   alert("Error: " + response.statusText);
        }
    })
}

var displayTodaysWeather = function (info, city) {
  
    document.querySelectorAll(".today").textContent="";

    // add city to top of page
    cityNameEl.textContent = city + " " + moment().format("L");


    
    var temp = info.main.temp
    var fixedTemp = temp.toFixed(1);
    todayTempEl.innerHTML = fixedTemp + "&deg; F";

    todayHumidEl.textContent = info.main.humidity + "%";
    
 
    var windSpeed = info.wind.speed;
    var fixedWindSpeed = windSpeed.toFixed(1);
    todayWindEl.textContent = fixedWindSpeed + " MPH";
}


// if previously searched city is clicked, run this function
var previousCityLoad = function (event) {
   
    var city = event.target.textContent;
    
    getWeather(city);
}

// load previously searched cities to page
var loadLocalStorage = function () {
    
    var previousCities = JSON.parse(localStorage.getItem('previousCities'));
    
    if (previousCities === null) {
        return;
       
    } else {
        for (var i = 0; i < previousCities.length; i++) {
            
        previousCityListItem = document.createElement("li");
        previousCityListItem.className = "nav-item";
        previousCityListItem.innerHTML="<a class='nav-link border' href='#'><span data-feather='file'></span>" + previousCities[i] + "</a>";

        previousSearchesEl.appendChild(previousCityListItem); 
        }
    }
}


loadLocalStorage();

searchFormEl.addEventListener("click", formSubmitHandler);
previousSearchesEl.addEventListener("click", previousCityLoad);