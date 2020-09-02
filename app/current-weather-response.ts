// Catches weatherInfoObj that was sent from the currentWeatherWin window to the main.js, and from there to here.
// Applies the weatherInfo values, from the weatherInfoObj, to the the p#weatherInfo node element.
class CurrentWeatherResponse{
    // Declare all properties and their types for CurrentWeatherResponse class as static and private
    private static readonly electron:any = require('electron');
    private static readonly ipcRenderer:any = CurrentWeatherResponse.electron.ipcRenderer;
    private static readonly pElement:HTMLParagraphElement = document.querySelector('#weatherInfo')! as HTMLParagraphElement;
    private static city:string;
    private static country:string;
    private static coord:string;
    private static timezone:string;
    private static weatherDesc:string;
    private static windSpeed:string;
    private static windDirection:string;
    private static visibility:string;
    private static cloudness:string;
    private static temp:string;
    private static feelsLike:string;
    private static tempMin:string;
    private static tempMax:string;
    private static pressure:string;
    private static humidity:string;
    private static lastUpdateDateTime:DateTimeInterface;
    private static lastUpdated:string;
    // Declare the only public method accessable and visible from outside this class (see the end of this file), which triggers the call to all private methods
    public static configure():void{
        this.configureShowResultAction();
    }
    // Configure the action for the receiving of the weatherInfoObj, from the main process, and basically show the parameter values to the user at the pElement
    private static configureShowResultAction():void{
        this.ipcRenderer.on('weatherInfoObj', (e:Event, weatherInfoObj:WeatherInfoObjInterface)=>{
            this.city = `city: ${weatherInfoObj.name}`;
            this.country = `country: ${weatherInfoObj.sys.country}`;
            this.coord = `coordinates: latitude ${weatherInfoObj.coord.lat} longitude ${weatherInfoObj.coord.lon}`;
            this.timezone = `timezone: UTC${weatherInfoObj.timezone/3600}`;
            this.weatherDesc = `weather description: ${weatherInfoObj.weather[0].description}`;
            this.windSpeed = `wind speed (meter/sec): ${weatherInfoObj.wind.speed}`;
            this.windDirection = `wind direction (degrees): ${weatherInfoObj.wind.deg}`;
            this.visibility = `visibility (meters): ${weatherInfoObj.visibility}`;
            this.cloudness = `cloudness (%): ${weatherInfoObj.clouds.all}`;
            this.temp = `temperature (Celsius): ${weatherInfoObj.main.temp}`;
            this.feelsLike = `feels like (Celsius): ${weatherInfoObj.main.feels_like}`;
            this.tempMin = `temperature minimum (Celsius): ${weatherInfoObj.main.temp_min}`;
            this.tempMax = `temperature maximum (Celsius): ${weatherInfoObj.main.temp_max}`;
            this.pressure = `pressure (hPa): ${weatherInfoObj.main.pressure}`;
            this.humidity = `humidity (%): ${weatherInfoObj.main.humidity}`;
            this.lastUpdateDateTime = DateTimeUtil.getDateTimeStringFromUnixTimeStampInSec(weatherInfoObj.dt);
            this.lastUpdated = `last updated: ${this.lastUpdateDateTime.date+' '+this.lastUpdateDateTime.time}`;
            this.pElement.innerHTML = this.city+'<br>'+this.country+'<br>'+this.coord+'<br>'+this.timezone+'<br>'+this.weatherDesc
                +'<br>'+this.windSpeed+'<br>'+this.windDirection+'<br>'+this.visibility+'<br>'+this.cloudness+'<br>'+this.temp
                +'<br>'+this.feelsLike+'<br>'+this.tempMin+'<br>'+this.tempMax+'<br>'+this.pressure+'<br>'+this.humidity+'<br>'
                +this.lastUpdated+'<br>';
        })
    }
}
// Calcule the Date from the timestamp in seconds (returned by the service) and return an object with the strings of the local date and time
// This DateTime is the last update time of the retrieved data, local to the requester timezone, not to the requested city timezone
interface DateTimeInterface{
    date: string;
    time: string;
}
class DateTimeUtil{
    public static getDateTimeStringFromUnixTimeStampInSec(timeInSec:number):DateTimeInterface{
        const timeInMillis = timeInSec*1000;
        const date = new Date(timeInMillis);
        const dateString = date.toLocaleDateString();
        const timeString = date.toLocaleTimeString();
        return {
            date: dateString,
            time: timeString
        }
    }
}
// This interface should be imported from current-weather.ts when the typescript modules are configured at this project
interface WeatherInfoObjInterface{
    coord: {
        lon: number,
        lat: number
    },
    weather: {
        id: number,
        main: string,
        description: string,
        icon: string}[]
    ,
    base: string,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        humidity: number
    },
    visibility: number,
    wind: {
        speed: number,
        deg: number
    },
    clouds: {
        all: number
    },
    dt: number,
    sys: {
        type: number,
        id: number,
        message: number,
        country: string,
        sunrise: number,
        sunset: number
    },
    timezone: number,
    id: number,
    name: string,
    cod: number
}

CurrentWeatherResponse.configure();