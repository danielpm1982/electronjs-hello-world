// Catches weatherInfoObj that was sent from the currentWeatherWin window to the main.js, and from there to here.
// Applies the weatherInfo values, from the weatherInfoObj, to the the p#weatherInfo node element.
const electron = require('electron');
const {ipcRenderer} = electron;
const pElement = document.querySelector('#weatherInfo');
ipcRenderer.on('weatherInfoObj', function(e, weatherInfoObj){
    const city = 'city: '+weatherInfoObj.name;
    const country = 'country: '+weatherInfoObj.sys.country;
    const coord = 'coordinates: latitude '+weatherInfoObj.coord.lat+", longitude "+weatherInfoObj.coord.lon;
    const timezone = 'timezone: UTC'+weatherInfoObj.timezone/3600;
    const weatherDesc = 'weather description: '+weatherInfoObj.weather[0].description;
    const windSpeed = 'wind speed (meter/sec): '+weatherInfoObj.wind.speed;
    const windDirection = 'wind direction (degrees): '+weatherInfoObj.wind.deg;
    const visibility = 'visibility (meters): '+weatherInfoObj.visibility;
    const cloudness = 'cloudness (%): '+weatherInfoObj.clouds.all;
    const temp = 'temperature (Celsius): '+weatherInfoObj.main.temp;
    const feelsLike = 'feels like (Celsius): '+weatherInfoObj.main.feels_like;
    const tempMin = 'temperature minimum (Celsius): '+weatherInfoObj.main.temp_min;
    const tempMax = 'temperature maximum (Celsius): '+weatherInfoObj.main.temp_max;
    const pressure = 'pressure (hPa): '+weatherInfoObj.main.pressure;
    const humidity = 'humidity (%): '+weatherInfoObj.main.humidity;
    pElement.innerHTML = city+'<br>'+country+'<br>'+coord+'<br>'+timezone+'<br>'+weatherDesc+'<br>'+windSpeed+'<br>'+
        windDirection+'<br>'+visibility+'<br>'+cloudness+'<br>'+temp+'<br>'+feelsLike+'<br>'+tempMin+'<br>'+
        tempMax+'<br>'+pressure+'<br>'+humidity;
})
