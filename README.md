# electronjs-hello-world
This is a sample app created with Node.js, npm, JavaScript ES6+, TypeScript and Electron.js.

[**Description of this repository**]<br>
This is a sample app created with Node.js, npm, JavaScript ES6+, TypeScript and Electron.js.<br>
The objective of this project is simply to demonstrate how to use these technologies. This app basically access a REST weather API (OpenWeather - current weather), retrieves the result for the requested city and shows to the user.<br>
It is a multi-platform desktop app that runs natively on Linux, Windows or iOS, according to the respective distro, and has the GUI components rendered by Electron from the html, css and .js files (compiled from the .ts files).<br>
For running the sources of this app from VSCode you gotta have Node.js and npm installed globally at your OS. After cloning this project, just go the directory and run npm install, to install the dependency modules at the project; npm run tsc-compilate-project (or tsc-compilate-project-win if on Windows), to compile the .ts files to .js files; and npm start (to start the app).<br>
For running an executable build, compiled to your OS, on the other hand, you have to create the build and the executable file yourself, by running one of the three commands below (according to your system):<br>
npm run package-linux<br>
npm run package-win<br>
npm run package-mac<br>
.<br>
Later, go to the folder of the distro and run the executable file - e.g.: ./electronjs-hello-world-v2.0.0-app if on Linux or clicking twice on the .exe file if on Windows.

For a deployed Web version of this project, as a web app (with no Electron):<br>
http://danielpm1982.com/public/open-weather-client/index.html

The above Web version sources:<br>
https://github.com/danielpm1982/open-weather-client-web/releases

For a Multi-Platform Desktop version of this app, using Electron.js, Vue.js and TypeScript:<br>
https://github.com/danielpm1982/open-weather-client/releases

For more about it, see the references, used to create this project, at:<br>
https://github.com/danielpm1982/electronjs-hello-world/blob/master/references.md

This repository is a single-project repo with Git version control.

Some of my repositories are for backup only, each of them being a collection of tens of projects inside one same repo (with no individual version control for each project), and others are single-project repositores (with effective version control for that single project). As a distinction between them, the backup repos are named in uppercase with underscores (e.g. SPRING3) while the single-project ones are named in lowercase with dashes (e.g. springboot2-ac-di).

See all my public repositories at:<br>
https://github.com/danielpm1982?tab=repositories .

[**Copyright© License**]<br>
© 2020 Daniel Pinheiro Maia All Rights Reserved<br>
This GitHub repository - and all code (software) available inside - is exclusively for academic and individual learning purposes, and is **NOT AVAILABLE FOR COMMERCIAL USE**, nor has warranty of any type. You're authorized to fork, clone, run, test, modify, branch and merge it, at your own risk and using your own GitHub account, for individual learning purposes only, but you're **NOT ALLOWED to distribute, sublicense and/or sell copies of the whole or of parts of it** without explicit and written consent from its owner / author. You can fork this repository to your individual account at GitHub, clone it to your personal notebook or PC, analyse, run and test its code, modify and extend it locally or remotely (exclusively at your own GitHub account and as a forked repository), as well as send issues or pull-requests to this parent (original) repository for eventual approval. GitHub is in charge of explicitly showing whom this respository has been forked from. **If you wish to use any of this repository content in any way other than what is expressed above, or publish it anyway or anywhere other than as a forked repository at your own GitHub account, please contact this repository owner / author** using GitHub or the contact info below. For the meaning of the technical terms used at this license, please refer to GitHub documentation, at: <br> https://help.github.com/en/github .

[**Owner and Author of this GitHub Repository**]<br>
Daniel Pinheiro Maia<br>
[danielpm1982.com](http://www.danielpm1982.com)<br>
danielpm1982@gmail.com<br>
[linkedin.com/in/danielpm1982](https://www.linkedin.com/in/danielpm1982)<br>
Brazil<br>
.
