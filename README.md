Image Organizer app that uses the Webix Toolkit to interact with a Girder server.

Steps to run app:
* Install Docker-compose (usually installs with Docker)
* modify / create a .env file
  - Example of contents: SERVER_LIST=[{"id":"#","value":"Label shown in GUI","hostAPI":"http://servername:8080/api/v1"},{...}]
  - Keep contents of .env file in a single line
* docker build -t dsaio .
* docker run -p####:80  # choose desired port
* App will run in localhost:####

Known error:
```
Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use
```
* solutions: ```$ sudo service apache2 stop```


* To stop running: ```docker compose stop```