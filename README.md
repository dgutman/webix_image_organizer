Image Organizer app that uses the Webix Toolkit to interact with a Girder server.

Steps to run application:

1. Install [docker compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04) (Ubuntu 20.04)
2. Create .env file in root of repo (```$ vim .env```, or similar)
3. Add RECOGNITION_SERVICE and SERVER_LIST to .env. Example:
```
RECOGNITION_SERVICE=http://localhost:4000
SERVER_LIST=[{"id":"#","value":"A name","hostAPI":"http://servername:8080/api/v1"}]
```
4. Build with docker compose: ```$ docker compose build```
5. Run the service: ```$ docker compose up```
  * in the event of error:
```
Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use
```
  * Run ```$ sudo service apache2 stop``` and try again
* To stop running: ```docker compose stop```

* By default tagger service runs in port 2000 and image organizer service in 3000
