// Catch username value that was sent from the login window to the main.js, and from there to here.
// Apply the username value to the welcome message, at the span node element, instead of 'World'. Turn color greenyellow.
// On logout, reset the original text and color.
class Index{
  // Declare all properties and their types for Index class as static and private
  private static readonly electron:any = require('electron');
  private static readonly ipcRenderer:any = Index.electron.ipcRenderer;
  private static readonly spanElement:HTMLSpanElement = document.querySelector('span')!;
  // Declare the only public method accessable and visible from outside this class (see the end of this file), which triggers the call to all private methods
  public static configure():void{
    this.configureUserNameChangeAction();
    this.configureLogoutAction();
  }
  // Configure the action for the receiving of the username, from the main process, and basically show its value to the user at the spanElement, adjusting the style color
  private static configureUserNameChangeAction():void{
    this.ipcRenderer.on('username', (e:Event, username:string)=>{
      this.spanElement.innerHTML = username;
      this.spanElement.style.color = 'greenyellow';
    });
  }
  // Configure the action for the receiving of the logout command, from the main process, and basically reset the view to the original aspect
  private static configureLogoutAction():void{
    this.ipcRenderer.on('logout', (Event:any)=>{
      this.spanElement.innerHTML = 'World';
      this.spanElement.style.color = 'white';
    });
  }
}

Index.configure();
