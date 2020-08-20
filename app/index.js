// Catch username value that was sent from the login window to the main.js, and from there to here.
// Apply the username value to the welcome message, at the span node element, instead of 'World'. Turn color greenyellow.
// On logout, reset the original text and color.
const electron = require('electron');
const {ipcRenderer} = electron;
const spanElement = document.querySelector('span');
ipcRenderer.on('username', function(e, username){
  spanElement.innerHTML = username;
  spanElement.style.color='greenyellow';
})
ipcRenderer.on('logout', function(){
  spanElement.innerHTML = 'World';
  spanElement.style.color='white';
})
