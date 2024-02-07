Image Organizer app that uses the Webix Toolkit to interact with a Girder server.

## Pre-installation Steps
* Open up CORS on DSA servers you will use:
  * Navigate to DSA frontend URL
  * Log in as an admin user
  * Go to "Admin console" side tab
  * Go to "Server configuration"
  * At the bottom set "Core Routes", "core_girder" to "/"
  * In "Advanced Settings" set "CORS Allowed Origins" to "*"
* Create local .env file
  * ```$ cp example.env .env```
  * Modify .env file to include your DSA servers, keep contents of .env file in a single line (don't add new line characters!)

## Installing & Running Application
* Install npm
* Clone the repo
* ```$ npm install```
* ```$ npm run start```
* Navigate to http://localhost:5000 in web browser of choice

Known errors:
* ```Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use```
  - Solution: ```$ sudo service apache2 stop```
