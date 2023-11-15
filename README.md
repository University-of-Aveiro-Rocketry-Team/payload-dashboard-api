# payload-dashboard-api

This is an Node.js API project with several services, including MongoDB, Graylog, and a custom application. The services can be deployed in development mode or orchestrated by Docker Compose using the provided docker-compose.yml file.  
<br>

## Prerequisites
Before you begin, ensure that you have the following installed on your system:

[Node.js v18.x or Newer](https://nodejs.org/en/download/package-manager#debian-and-ubuntu-based-linux-distributions)  
[NPM v6.x or Newer](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
[Docker](https://docs.docker.com/engine/install/)  
[Docker Compose](https://docs.docker.com/compose/install/)  
<br>

## Getting Started
To get started, first clone this repository and navigate to the project directory.

```bash
git clone git@github.com:University-of-Aveiro-Rocketry-Team/payload-dashboard-api.git
cd payload-dashboard-api
```
Then, create a .env file to store the required environment variables:

```
cp .env.example .env
```
Edit the .env file and set the required values for GRAYLOG_PASSWORD_SECRET and GRAYLOG_ROOT_PASSWORD_SHA2.  
<br>

## Development mode
### Instal dependencies
To install the dependencies for this project, use the following command:
```
npm install
```
### Run in development mode
To run the project, use the following command:
```
npm run dev
```
<br>

## Docker Compose
### Build and Run
To build and run the Docker Compose project, use the following command:

```
docker-compose up --build
```
This will build the images (if not already built) and start the containers for all services defined in the docker-compose.yml file.

### Stop and Remove Containers
To stop and remove the containers, use the following command:

```
docker-compose down
```

### Remove Volumes
To remove the volumes associated with this project, use the following command:

```
docker-compose down --volumes
```
<br>

## Services
### Ports and URLs
Here is a list of the services, their ports, and URLs:

1. **MongoDB**
   - Port: 27017
2. **Graylog**
   - Ports: 5044, 5140, 5555, 9000, 12201, 13301, 13302
   - Web Interface: http://localhost:9000
3. **Custom Application**
   - Port: 3000
   - URL: http://localhost:3000  
<br>

## Scripts
Three scripts are included for waiting on dependent services to start:

1. `wait-for-graylog.sh`: Waits for Graylog service to be available.
2. `start-app.sh`: Waits for Graylog service to be available, then starts the custom application.

These scripts are used in the command section of the app service in the docker-compose.yml file. They ensure that the custom application starts only after the required services are available.  
<br>

## Networks
Two networks are used in this project:

1. `backend`: This network is used by all services to communicate with each other.
2. `api`: This network is only used by app.

For more information on how the services are configured, refer to the docker-compose.yml file in the project directory.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
