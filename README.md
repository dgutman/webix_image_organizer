Image Organizer app that uses the Webix Toolkit to interact with a Girder server

Steps:
1. npm install
2. npm run start

Path to recognition service:
1. create .env file
2. add `RECOGNITION_SERVICE_API=http://your.path` row

Adding new hosts:
1. Open webpack.config.js for editing (found in root of repo)
2. add a new item in SERVER_LIST (bottom of page)
3. example: {id: "#", value: "A name", hostAPI: "http://servername:8080/api/v1"}
