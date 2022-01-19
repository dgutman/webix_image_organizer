#### Overview

The image organizer app and the tagger application can be run directly from command line, but we also have dockerized versions to simplify deployment.  Docker can be a bit confusing, as you need to expose ports within a container for it to work at all.  Also remember the internal exposed port "within" the container can be mapped to any external port.  

### Building a standalone image organizer app

You need to be in the root directory of the system (i.e. webix_image_organizer) if you cloned the repository.  Each directory has its own Dockerbuild file, so you need to run the command in the directory with the appropriate <i>Dockerfile</i> 


    docker build -t imgorg .


## Running image organizer

    docker run -p 5000:80 -t imgorg

This will run the image organizer app and you can access it on port 5000.  The port on the left (i.e. 5000) is on YOUR machine, the one on the right maps to the port within the docker container.




## Testing in a local environment...

We have set up a docker-compose script that will build tagger, image organizer, and an additional container that runs some basic image analysis scripts.  To build the containers, type:


    docker-compose up -d --build


## NOTES

For now you can run Images Organizer and/or  Tagger client by following the instruction:
1. go to directory with Dockerfile (project directory for IO and ./tagger directory for Tagger)
2. run "docker build -t <your name> ." command (this will build the image);
3. run "docker run -itd -p <your port>:80 <image name>"

this will run the app on the specified port.

Don't forget to run the taggerAPI separately (build image and run the container from ./tagger/server directory).
it uses 4000 port by default, so to run the container use the following command:


    docker run -itd -p <your port>:4000 <image name>


Added it to "docker" branch
So try to run docker-compose up -d --build now and check /tagger, /io /api, /marker /label /sticker routes



## Stopping all running docker containers
    docker stop $(docker ps -aq)
   
### Remove all containers.
    docker rm $(docker ps -aq)

### Remove all images.

    docker rmi $(docker images -q)

## After running docker build

You should see something like this if you run `docker ps` which indicates the various containers and services are up and running. 
![](mdImages/2020-06-10-13-00-27.png)


## Accessing services

In this configuration, the image organizer is running on port 3000, tagger on port 2000, and the image recognition service is running on port 5000.

