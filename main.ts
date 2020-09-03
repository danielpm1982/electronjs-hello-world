import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import WeatherInfoObjInterface from './app/weather-info-obj-interface';
export default class Main{
    // Declare all properties and their types for Main class as static and private
    private static mainWin:Electron.BrowserWindow|null;
    private static loginWin:Electron.BrowserWindow|null;
    private static aboutWin:Electron.BrowserWindow|null;
    private static currentWeatherWin:Electron.BrowserWindow|null;
    private static currentWeatherResponseWin:Electron.BrowserWindow|null;
    private static mainMenu:Electron.Menu;
    private static mainMenuTemplate:object[];

    // Declare the only public method accessable and visible from outside this class (see app.ts file), through which the Electron modules/objects are injected from the app.ts and triggers the call to all private methods
    public static start(){
        Main.createMainMenuTemplate();
        Main.configureOnReady();
        Main.configureOnWindowAllClosed();
        Main.configureOnActivate();
        Main.configureOnUserName();
        Main.configureOnWeatherInfoObj();
    }
    // Create main app window
    private static createMainWindow () {
      // Create the browser window
      Main.mainWin = new BrowserWindow({
        width: 1000,
        height: 700,
        resizable: false,
        webPreferences: {
          nodeIntegration: true
        }
      });
      // and load the respective web page to be rendered on the window
      Main.mainWin.loadFile('app/index.html');
      // Quit app when this main window closes
      Main.mainWin.on('closed', function(){
        app.quit();
      });
      //Create main menu from template
      Main.mainMenu = Menu.buildFromTemplate(Main.mainMenuTemplate);
      //Insert menu
      Menu.setApplicationMenu(Main.mainMenu);
    }
    // Create login window
    private static createLoginWindow(){
        // Create the browser window
        Main.loginWin = new BrowserWindow({
            width: 850,
            height: 550,
            resizable: false,
            alwaysOnTop: true,  
            webPreferences: {
                nodeIntegration: true
            }
        });
        // and load the respective web page to be rendered on the window
        Main.loginWin.loadFile('app/login.html');
        // Optimize Garbage Collector handle
        Main.loginWin.on('closed', function(){
            Main.loginWin = null;
        });
        // Turn off visibility for menu on this window
        Main.loginWin.setMenuBarVisibility(false);
    }
    // Create about window
    private static createAboutWindow(){
        // Create the browser window
        Main.aboutWin = new BrowserWindow({
            width: 800,
            height: 520,
            resizable: false,
            alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true
            }
        });
        // and load the respective web page to be rendered on the window
        Main.aboutWin.loadFile('app/about.html');
        // Optimize Garbage Collector handle
        Main.aboutWin.on('closed', function(){
            Main.aboutWin = null;
        });
        // Turn off visibility for menu on this window
        Main.aboutWin.setMenuBarVisibility(false);
    }
    // Create current weather window
    private static createCurrentWeatherWindow(){
        // Create the browser window
        Main.currentWeatherWin = new BrowserWindow({
            width: 800,
            height: 520,
            resizable: false,
            alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true
            }
        });
        // and load the respective web page to be rendered on the window
        Main.currentWeatherWin.loadFile('app/current-weather.html');
        // Optimize Garbage Collector handle
        Main.currentWeatherWin.on('closed', function(){
            Main.currentWeatherWin = null;
        });
        // Turn off visibility for menu on this window
        // Main.currentWeatherWin.setMenuBarVisibility(false);
    }
    // Create current weather response window
    private static createCurrentWeatherResponseWindow(){
        // Create the browser window
        Main.currentWeatherResponseWin = new BrowserWindow({
            width: 700,
            height: 860,
            resizable: false,
            alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true
            }
        });
        // and load the respective web page to be rendered on the window
        Main.currentWeatherResponseWin.loadFile('app/current-weather-response.html');
        // Optimize Garbage Collector handle
        Main.currentWeatherResponseWin.on('closed', function(){
            Main.currentWeatherResponseWin = null;
        });
        // Turn off visibility for menu on this window
        // Main.currentWeatherResponseWin.setMenuBarVisibility(false);
    }
    //Create main menu template for the Menu to be built from
    private static createMainMenuTemplate(){
        Main.mainMenuTemplate = [
            {
                label: 'File',
                submenu:[
                    {
                        label: 'Login',
                        accelerator: process.platform == 'darwin' ? 'Command+L': 'Ctrl+L',
                        click(){
                            Main.createLoginWindow();
                        }
                    },
                    {
                        label: 'Logout',
                        accelerator: process.platform == 'darwin' ? 'Command+O': 'Ctrl+O',
                        click(){
                            Main.mainWin!.webContents.send('logout');
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
                            Main.createCurrentWeatherWindow();
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
                            Main.createAboutWindow();
                        }
                    }
                ]
            }
        ];
        // Correct the macOS bug of showing 'electron' instead of the first item of the array. Just add an empty first item to the array IF on mac ('darwin').
        if(process.platform=='darwin'){
            Main.mainMenuTemplate.unshift({});
        }
        // Show development tools only if NOT in production.
        if(process.env.NODE_ENV != 'production'){
            Main.mainMenuTemplate.push({
                label: 'Developer',
                submenu:[
                    {
                        label: 'Toggle DevTools',
                        accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
                        click(_item:any, focusedWindow:any){
                            focusedWindow.toggleDevTools();
                        }
                    }
                ]
            });
        }
    }
    // Configure app onReady event listener to execute createMainWindow method when Electron 
    // has finished initializing
    private static configureOnReady(){
        app.whenReady().then(Main.createMainWindow);
    }
    //Configure app window-all-closed event listener to quit the app (except if on macOS) when all 
    // windows are closed. There, it's common for applications and their menu bar to stay active 
    // until the user quits explicitly with Cmd + Q.
    private static configureOnWindowAllClosed(){
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        });
    }
    //Configure app activate event listener to recreate main window when the dock icon is clicked
    // On macOS it's common to re-create a window in the app when the dock icon is clicked and 
    // there are no other windows open.
    private static configureOnActivate(){
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                Main.createMainWindow()
            }
        });
    }
    // Configure the ipcMain username catch event
    // Catch username sent from loginWin window and send for the main win window to catch
    // Validation of password not yet implemented - no authentication actually occurs, only a simulation of it - for now...
    private static configureOnUserName(){
        ipcMain.on('username', function(e:Event, username:string){
            // Close the loginWin window when the form data is already sent to the main.js
            Main.loginWin!.close();
            // Send the username for the main win window to catch
            Main.mainWin!.webContents.send('username', username);
        });
    }
    // Configure the ipcMain weatherInfoObj catch event
    // Catch weatherInfoObj sent from currentWeatherWin window and send for the currentWeatherResponseWin window to catch
    private static configureOnWeatherInfoObj(){
        ipcMain.on('weatherInfoObj', function(e:Event, weatherInfoObj:WeatherInfoObjInterface){
            // Close the currentWeatherWin window when the weatherInfoObj is sent to the main.js
            Main.currentWeatherWin!.close();
            // Create the currentWeatherResponseWin window
            Main.createCurrentWeatherResponseWindow();
            // Create 500ms delay, before sending weatherInfoObj to the response window, for avoiding sending before the window is even created
            setTimeout(() => {
                // Send the weatherInfoObj for the currentWeatherResponseWin to catch - the window must already have been created !
                Main.currentWeatherResponseWin!.webContents.send('weatherInfoObj', weatherInfoObj); 
            }, 500);
        });
    }
}
