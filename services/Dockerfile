# Use an official Python runtime as a parent image
FROM jjanzic/docker-python3-opencv:opencv-4.0.1

# Set the working directory to /app
WORKDIR /app


RUN  apt-get update

RUN  apt-get install -y \
    tesseract-ocr

RUN  apt-get install -y \
    tesseract-ocr-eng libdmtx-*

# Copy the current directory contents into the container at /app
COPY requirements.txt /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

RUN pip install --upgrade pip

RUN pip install histomicstk --find-links https://girder.github.io/large_image_wheels
RUN pip install imageio

RUN pip install tqdm


# Copy the current directory contents into the container at /app
COPY . /app


# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV NAME insearch
ENV FLASK_APP /app/server.py
ENV FLASK_ENV=development

CMD ["flask" , "run", "--port=8000", "--host=0.0.0.0"]
