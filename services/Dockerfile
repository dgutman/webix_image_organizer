# Use an official Python runtime as a parent image
FROM jjanzic/docker-python3-opencv:opencv-4.0.1

# Set the working directory to /app
WORKDIR /app


RUN  apt-get update

RUN  apt-get install -y \
    tesseract-ocr

RUN  apt-get install -y \
    tesseract-ocr-eng libdmtx-*

RUN apt-get install nano

# Copy the current directory contents into the container at /app
COPY requirements.txt /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

RUN pip install jupyter

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV NAME insearch
ENV FLASK_APP /app/server.py



CMD ["flask" , "run",  "--host=0.0.0.0"]
