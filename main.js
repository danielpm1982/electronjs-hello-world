// destructuring some of electron module's objects for later use
const { app, BrowserWindow, Menu, ipcMain } = require('electron')

let win, loginWin, aboutWin, currentWeatherWin, currentWeatherResponseWin;

// Set environment variable NODE_ENV as: 'production', 'development' or other
// Development Tools will only appear on the menu if NOT in 'production' environment
// Just uncomment the following line to change to production environment and make Developer Tools disappear
// process.env.NODE_ENV = 'production';

// Create main app window
function createWindow () {
  // Create the browser window
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the respective web page to be rendered on the window
  win.loadFile('app/index.html')

  // Quit app when this main window closes
  win.on('closed', function(){
    app.quit();
  })

  //Create main menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  //Insert menu
  Menu.setApplicationMenu(mainMenu);
}

// Create login window
function createLoginWindow(){
  // Create the browser window
  loginWin = new BrowserWindow({
    width: 850,
    height: 550,
    resizable: false,
    alwaysOnTop: true,  
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  // and load the respective web page to be rendered on the window
  loginWin.loadFile('app/login.html')

  // Optimize Garbage Collector handle
  loginWin.on('closed', function(){
    loginWin = null;
  })

  // Turn off visibility for menu on this window
  loginWin.setMenuBarVisibility(false);
}

// Create about window
function createAboutWindow(){
  // Create the browser window
  aboutWin = new BrowserWindow({
    width: 800,
    height: 520,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the respective web page to be rendered on the window
  aboutWin.loadFile('app/about.html')

  // Optimize Garbage Collector handle
  aboutWin.on('closed', function(){
    aboutWin = null;
  })

  // Turn off visibility for menu on this window
  aboutWin.setMenuBarVisibility(false);
}

// Create current weather window
function createCurrentWeatherWindow(){
  // Create the browser window
  currentWeatherWin = new BrowserWindow({
    width: 800,
    height: 520,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  // and load the respective web page to be rendered on the window
  currentWeatherWin.loadFile('app/current-weather.html')

  // Optimize Garbage Collector handle
  currentWeatherWin.on('closed', function(){
    currentWeatherWin = null;
  })

  // Turn off visibility for menu on this window
  currentWeatherWin.setMenuBarVisibility(false);
}

// Create current weather response window
function createCurrentWeatherResponseWindow(){
  // Create the browser window
  currentWeatherResponseWin = new BrowserWindow({
    width: 700,
    height: 860,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  // and load the respective web page to be rendered on the window
  currentWeatherResponseWin.loadFile('app/current-weather-response.html')

  // Optimize Garbage Collector handle
  currentWeatherResponseWin.on('closed', function(){
    currentWeatherResponseWin = null;
  })

  // Turn off visibility for menu on this window
  currentWeatherResponseWin.setMenuBarVisibility(false);
}

//Create main menu template for the Menu to be built from
const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label: 'Login',
        accelerator: process.platform == 'darwin' ? 'Command+L': 'Ctrl+L',
        click(){
          createLoginWindow();
        }
      },
      {
        label: 'Logout',
        accelerator: process.platform == 'darwin' ? 'Command+O': 'Ctrl+O',
        click(){
          win.webContents.send('logout');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: 'View',
    submenu:[
      {
        role: 'reload'
      }
    ]
  },
  {
    label: 'Services',
    submenu:[
      {
        label: 'Current Weather',
        accelerator: process.platform == 'darwin' ? 'Command+W': 'Ctrl+W',
        click(){
          createCurrentWeatherWindow();
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu:[
      {
        label: 'About',
        accelerator: process.platform == 'darwin' ? 'Command+U': 'Ctrl+U',
        click(){
          createAboutWindow();
        }
      }
    ]
  }
]

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Correct the macOS bug of showing 'electron' instead of the first item of the array. Just add an empty first item to the array IF on mac ('darwin').
if(process.platform=='darwin'){
  mainMenuTemplate.unshift({});
}

// Show development tools only if NOT in production.
if(process.env.NODE_ENV != 'production'){
  mainMenuTemplate.push({
    label: 'Developer',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}

// Catch username sent from loginWin window and send for the main win window to catch
// Validation of password not yet implemented - no authentication actually occurs, only a simulation of it - for now...
ipcMain.on('username', function(e, username){
  // Close the loginWin window when the form data is already sent to the main.js
  loginWin.close();
  // Send the username for the main win window to catch
  win.webContents.send('username', username);
})

// Catch weatherInfoObj sent from currentWeatherWin window and send for the currentWeatherResponseWin window to catch
ipcMain.on('weatherInfoObj', function(e, weatherInfoObj){
  // Close the currentWeatherWin window when the weatherInfoObj is sent to the main.js
  currentWeatherWin.close();
  // Create the currentWeatherResponseWin window
  createCurrentWeatherResponseWindow();
  // Create 100ms delay, before sending weatherInfoObj to the response window, for avoiding sending before the window is even created
  setTimeout(() => {
    // Send the weatherInfoObj for the currentWeatherResponseWin to catch - the window must already have been created !
    currentWeatherResponseWin.webContents.send('weatherInfoObj', weatherInfoObj);  
  }, 100);
})
