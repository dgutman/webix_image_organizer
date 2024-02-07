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

## Instructions with NPM
* Install npm
* Clone the repo
* ```$ npm install```
* ```$ npm run start```
* Navigate to http://localhost:5000 in web browser of choice

## Instructions with Docker Compose (not currently working!)
* Install Docker-compose (usually installs with Docker)
* docker build -t dsaio .
* docker run -p####:80  # choose desired port
* App will run in localhost:####
* Stop docker container: ```$ docker compose stop```

Known errors:
* ```Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use```
  - Solution: ```$ sudo service apache2 stop```
