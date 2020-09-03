// Use Electron net module, from electron.remote, to send a GET request to the REST API, with the city and appid, and receive the local weather info response.
// Use Electron ipcRenderer to send to the main.js the resulting weather info. From there, it's then sent to the currentWeatherResponseWindow window, for showing to the user.
// const electron = require('electron');
import { remote, ipcRenderer } from 'electron';
const net = remote.net;
import WeatherInfoObjInterface from './weather-info-obj-interface';
class CurrentWeather{
    // Declare all properties and their types for CurrentWeather class as static and private
    private static readonly form:HTMLFormElement = document.querySelector('form')! as HTMLFormElement;
    private static readonly cityInputElement:HTMLInputElement = document.querySelector('#city')! as HTMLInputElement;
    private static readonly maxTimeInMillisForResponse:number = 10000;
    private static readonly unitsSystem:string = 'metric';
    private static readonly appid:string = 'c90bb6a51603a99515006429cd457dc0'; //sample key
    private static city:string;
    private static cityFormattedToURL:string;
    private static readonly method:string = 'GET';
    private static readonly protocol:string = 'http:';
    private static readonly hostname:string = 'api.openweathermap.org';
    private static request:Electron.ClientRequest;
    private static didRespond:boolean = false;
    private static weatherInfoObj: WeatherInfoObjInterface;
    // Declare the only public method accessable and visible from outside this class (see the end of this file), which triggers the call to all private methods
    public static configure():void{
        this.configureSubmitAction();
    }
    // Configure the action for when the submit event occurs (either by clicking the submit button or hitting enter after filling out the city at the input field)
    private static configureSubmitAction():void{
        this.form.addEventListener('submit', (e:Event)=>{
            e.preventDefault();
            this.city = this.cityInputElement.value;
            // Get URL-formatted city name through formatStringToURL() method for later add to the ClientRequest
            this.cityFormattedToURL = Util.formatStringToURL(this.city);
            // Instantiate ClientRequest request through the net request() method
            this.request = net.request({
                method: this.method,
                protocol: this.protocol,
                hostname: this.hostname,
                path: `/data/2.5/weather?q=${this.cityFormattedToURL}&units=${this.unitsSystem}&APPID=${this.appid}`
            });
            // Only if and when the submit event is triggered, set the other actions below:
            // Configure the action for when the response event occurs, and then configures the action for when the data is available for being processed
            this.configureResponseAction();
            // At the 4 lines below, configure the finish, abort, error and close events actions: simple console notifications about the events
            this.configureFinishAction();
            this.configureAbortAction();
            this.configureErrorAction();
            this.configureCloseAction();
            // Set the content-type to json
            this.request.setHeader('Content-Type', 'application/json'); 
            // Configure the timeout for the response: wait 10s, otherwise throw alert and abort the request
            this.setTimeOutForResponse();
            // End the request by submiting the instantiated ClientRequest to the REST Service
            this.request.end();
        });
    }
    private static configureResponseAction():void{
        // If the response is received and has a valid statusCode, then get the data, parse to js Object format and then send, as the weatherInfoObj, to the main process js file (main.js), for being sent then to the currentWeatherResponseWindow renderer process js file (current-weather-response.js)
        this.request.on('response', (response:any) => {
            this.didRespond = true;
            if(response.statusCode === 200){
                response.on('data', (data:any) => { 
                    this.weatherInfoObj = JSON.parse(`${data}`);
                    ipcRenderer.send('weatherInfoObj', this.weatherInfoObj);
                    this.didRespond = false;
                });
            } else{
                alert('Invalid response received (statusCode !== 200) ! Can\'t show current weather ! Try again later !');
            }
        });
    }
    private static configureFinishAction():void{
        this.request.on('finish', () => { 
            console.log('Request is Finished') 
        });
    }
    private static configureAbortAction():void{
        this.request.on('abort', () => { 
            console.log('Request is Aborted') 
            alert('Request is Aborted')
        });
    }
    private static configureErrorAction():void{
        this.request.on('error', (error:any) => { 
            console.log(`ERROR: ${JSON.stringify(error)}`) 
        }); 
    }
    private static configureCloseAction():void{
        this.request.on('close', (error:any) => { 
            console.log('Last Transaction has occured') 
        }); 
    }
    private static setTimeOutForResponse():void{
        setTimeout(()=>{
            if(!this.didRespond){
                alert('No response received or server could not be reached ! Can\'t show current weather ! Check your connection and try again later !');
                this.request.abort();
            }
        },this.maxTimeInMillisForResponse);
    }
}
class Util{
    // Use the method below to trim and to substitute internal name spaces for '+' on the city names with multiple words, in order to concatenate to the URL using the correct format
    public static formatStringToURL(stringInitialValue:string):string{
        stringInitialValue = stringInitialValue.trim();
        if(stringInitialValue.includes(' ')){
            let stringNameSplitArray = stringInitialValue.split(' ');
            let resultString:string='';
            for (let i=0; i<stringNameSplitArray.length-1; i++){
                stringNameSplitArray[i]+='+';
            }
            for (let word of stringNameSplitArray){
                resultString+=word;
            }
            return resultString;
        }else{
            return stringInitialValue;
        }
    }    
}

CurrentWeather.configure();
