const { app, BrowserWindow, Menu, ipcMain } = require('electron')

let win;
let loginWin;
let aboutWin;

// Set environment variable NODE_ENV as: 'production', 'development' or other
// Development Tools will only appear on the menu if NOT in 'production' environment
// Just uncomment the following line to change to production environment and make Developer Tools disappear
// process.env.NODE_ENV = 'production';

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
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

function createLoginWindow(){
  // Create the browser window.
  loginWin = new BrowserWindow({
    width: 850,
    height: 550,
    title: 'Login to your account',
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  // and load the login.html of the app.
  loginWin.loadFile('app/login.html')

  // Optimize Garbage Collector handle
  loginWin.on('closed', function(){
    loginWin = null;
  })

  //Create main menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert menu
  Menu.setApplicationMenu(mainMenu);
}

function createAboutWindow(){
  // Create the browser window.
  aboutWin = new BrowserWindow({
    width: 800,
    height: 520,
    title: 'About this App',
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  // and load the about.html of the app.
  aboutWin.loadFile('app/about.html')

  // Optimize Garbage Collector handle
  aboutWin.on('closed', function(){
    loginWin = null;
  })

  //Create main menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert menu
  Menu.setApplicationMenu(mainMenu);
}

// Catch username sent from login.html window and send for the main window to catch
// Validation of password not implemented yet - no authentication actually occurs, only a simulation of it
ipcMain.on('username', function(e, username){
  win.webContents.send('username', username);
  // Closes the login window when the form data is sent to the main.js
  loginWin.close();
})

//Create main menu template
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
    label: 'Developer Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
