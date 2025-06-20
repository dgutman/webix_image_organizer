# Use an official Python runtime as a parent image
FROM python:3.11-slim-bullseye

# Set the working directory to /app
WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip install --upgrade pip && pip install opencv-python

RUN  apt-get update

RUN  apt-get install -y tesseract-ocr

RUN  apt-get install -y tesseract-ocr-eng libdmtx-*

# Copy the current directory contents into the container at /app
COPY requirements.txt /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app


# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV NAME=insearch
ENV FLASK_APP=/app/server.py


CMD ["flask" , "run",  "--host=0.0.0.0"]
