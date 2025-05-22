# Building Docker containers

We have set up containers for the webix_image_organizer service.  There is even a container
to do OCR!  However this is currently a bit confusing.

## Building the image organizer app

So please look in [conf/readme.md](./conf/readme.md) for further instructions..

## Build of individual services

### Dockerfile Overview

Each service in the project has its own `Dockerfile`.

### Environment Variables

Create a `.env` file with these variables:

#### Images Organizer

```ini
SINGLE_SERVER={"id": "serverId", "value": "Name of server", "hostAPI": "URL to server API"}
SERVER_LIST=[{"id": "1", "value": "Name of server", "hostAPI": "URL to server API"}, {"id": "2", "value": "Name of second server", "hostAPI": "URL to server API"}]
LOGO_LABEL="Image Organizer"
```

### Example Build Commands

```bash
docker build -t image-name -f /path/to/Dockerfile /build/context/path
```

#### Build the Image Organizer

```bash
docker build -t imgorg -f Dockerfile .
```

#### Build the Faceted Search

```bash
docker build -t  fs -f ./faceted_search/Dockerfile ./faceted_search/
```

#### Build the RCM

```bash
docker build -t  rcm -f ./rcm/Dockerfile ./rcm/
```
