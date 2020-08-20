// Use Nodejs net module, from electron.remote, to send a GET request to the REST API, with the city and appid, and receive the local weather info response.
// Use Electron ipcRenderer to send to the main.js the resulting weather info. From there, it's then sent to the currentWeatherResponseWindow window, for showing to the user.
const electron = require('electron');
const {ipcRenderer, remote} = electron;
const net = remote.net;
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);
function submitForm(e){
    e.preventDefault();
    const city = document.querySelector('#city').value;
    const unitsSystem = 'metric';
    const appid = 'c90bb6a51603a99515006429cd457dc0';
    const request = net.request('http://api.openweathermap.org/data/2.5/weather?q='+city+'&units='+unitsSystem+'&APPID='+appid);
    request.on('response', (response) => { 
        response.on('data', (data) => { 
            const weatherInfoObj = JSON.parse(`${data}`);
            ipcRenderer.send('weatherInfoObj', weatherInfoObj);
        });
    });
    request.on('finish', () => { 
        console.log('Request is Finished') 
    }); 
    request.on('abort', () => { 
        console.log('Request is Aborted') 
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
