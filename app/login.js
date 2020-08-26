// Use Electron ipcRenderer to send to the main.js the value of the username input field. From there, it's then sent to the index window to show to the user as part of the welcome message
// Validation of password not yet implemented - no authentication actually occurs, only a simulation of it - for now...
const electron = require('electron');
const {ipcRenderer} = electron;
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);
function submitForm(e){
    e.preventDefault();
    const username = document.querySelector('#username').value;
    ipcRenderer.send('username', username);
}
