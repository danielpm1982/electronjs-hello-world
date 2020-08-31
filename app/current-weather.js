// Use Electron net module, from electron.remote, to send a GET request to the REST API, with the city and appid, and receive the local weather info response.
// Use Electron ipcRenderer to send to the main.js the resulting weather info. From there, it's then sent to the currentWeatherResponseWindow window, for showing to the user.
const electron = require('electron');
const {ipcRenderer, remote} = electron;
const net = remote.net;
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);
function submitForm(e){
    e.preventDefault();
    const city = document.querySelector('#city').value;
    const cityFormattedToURL = formatStringToURL(city);
    const unitsSystem = 'metric';
    const appid = 'c90bb6a51603a99515006429cd457dc0';
    // Create and submit a ClientRequest request through the net request() method
    const request = net.request({
        method: 'GET',
        protocol: 'http:',
        hostname: 'api.openweathermap.org',
        path: `/data/2.5/weather?q=${cityFormattedToURL}&units=${unitsSystem}&APPID=${appid}`
    });
    // Wait 10s for a response to be received, otherwise throws alert and aborts the request. If the received response has a statusCode different from 200, also throws an alert.
    // If the response is received and has a valid statusCode, then get the data, parse to js Object format and then send, as the weatherInfoObj, to the main process js file (main.js), for being sent then to the currentWeatherResponseWindow renderer process js file (current-weather-response.js)
    let didRespond = false;
    request.on('response', (response) => {
        didRespond = true;
        if(response.statusCode === 200){
            response.on('data', (data) => { 
                const weatherInfoObj = JSON.parse(`${data}`);
                ipcRenderer.send('weatherInfoObj', weatherInfoObj);
            });
        } else{
            alert('Invalid response received (statusCode !== 200) ! Can\'t show current weather ! Try again later !');
        }
    });
    // Set the timeOut that will throw the no response alert after 10s and abort the request
    setTimeout(()=>{
        if(didRespond === false){
            alert('No response received or server could not be reached ! Can\'t show current weather ! Check your connection and try again later !');
            request.abort();
        }
    },10000);
    request.on('finish', () => { 
        console.log('Request is Finished') 
    }); 
    request.on('abort', () => { 
        console.log('Request is Aborted') 
        alert('Request is Aborted')
    });
    request.on('error', (error) => { 
        console.log(`ERROR: ${JSON.stringify(error)}`) 
    }); 
    request.on('close', (error) => { 
        console.log('Last Transaction has occured') 
    }); 
    request.setHeader('Content-Type', 'application/json'); 
    request.end(); 
}
// Use the method below to trim and to substitute internal name spaces for '+' on the city names with multiple words, in order to concatenate to the URL using the correct format
function formatStringToURL(stringInitialValue){
    stringInitialValue = stringInitialValue.trim();
    if(stringInitialValue.includes(' ')){
        let stringNameSplitArray = stringInitialValue.split(' ');
        let resultString='';
        for (i=0; i<stringNameSplitArray.length-1; i++){
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
