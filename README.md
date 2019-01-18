# [TV Showtimes App](http://www.derrickcraven.com/tvshowinfo/)
I wanted an easier way to view when my favorite TV shows air new episodes so I built a simple TV Showtimes app.
          The app uses the TVmaze API to load basic metadata about different TV shows. The app stores all its data on the client to reduce API calls and increase page load speed.
          
## Getting Started
To run the TV Showtimes app use Electron or simply serve the page to a browser.

### Running the App with Electron
Install [electron-prebuilt](https://github.com/electron-userland/electron-prebuilt)

`npm install -g electron-prebuilt`


Navigate to the app directory and run electron

`cd tvshowinfo`

`electron .`

### Running the App in the Browser
The app can run by simply serving the static content to a browser. As of this writing, TVmaze does not yet support HTTPS so adding new shows may require specifically allowing HTTP requests from a page loaded with HTTPS. In other words, click the warning in Chrome's address bar and then click "Load unsafe scripts."
