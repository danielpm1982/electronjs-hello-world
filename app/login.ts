// Use Electron ipcRenderer to send to the main.js the value of the username input field. From there, it's then sent to the index window to show to the user as part of the welcome message
// Validation of password not yet implemented - no authentication actually occurs, only a simulation of it - for now...
class Login{
    // Declare all properties and their types for Login class as static and private
    private static readonly electron:any = require('electron');
    private static readonly ipcRenderer:any = Login.electron.ipcRenderer;
    private static readonly form:HTMLFormElement = document.querySelector('form')! as HTMLFormElement;
    private static readonly usernameInputElement:HTMLInputElement = document.querySelector('#username')! as HTMLInputElement;
    private static username:string;
    // Declare the only public method accessable and visible from outside this class (see the end of this file), which triggers the call to all private methods
    public static configure():void{
        this.configureSubmitAction();
    }
    // Configure the action for when the submit event occurs (either by clicking the submit button or hitting enter after filling out the name and password at the input fields)
    private static configureSubmitAction():void{
        this.form.addEventListener('submit', (e:Event)=>{
            e.preventDefault();
            this.username = this.usernameInputElement.value;
            this.ipcRenderer.send('username', this.username);
        });
    }
}

Login.configure();
