// destructuring some Electron module/objects for starting the app through the 
// Main class start() method
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
import Main from './main'

Main.start(app, BrowserWindow, Menu, ipcMain);
