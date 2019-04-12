# Use an official Python runtime as a parent image
FROM jjanzic/docker-python3-opencv

# Set the working directory to /app
WORKDIR /app


RUN  apt-get update

RUN  apt-get install -y \
    tesseract-ocr

RUN  apt-get install -y \
    tesseract-ocr-eng

# Copy the current directory contents into the container at /app
COPY requirements.txt /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app


# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV NAME insearch
ENV FLASK_APP /app/server.py


CMD ["flask" , "run",  "--host=0.0.0.0"]
