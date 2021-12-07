## Building the flask service

This is currently building a flask app as defined in the Dockerfile.  We have some very simple routes
to do sticker detection, marker detection, etc... which don't work very well.  They were developed as proof of principal.  


#### Building the container

docker build -t dsaflaskio .


### Running the service

If you pass it a -d it will run as a daemon.. but I'd avoid that for now.  Change the path where the python code is to the local directory.  Eventually I need to rememeber the ${PWD}

  docker run -p 8000:8000 -v /home/dagutman/devel/webix_image_organizer/services:/app dsaocr ^C