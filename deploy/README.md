# Warning
MongoDB officially requires ARMv8.2-A+ microarchitecture support as of MongoDB 5.0+.
Since the deployment is being done on a Raspberry Pi 4 which runs on ARMv8.0-A, a modified version of MongoDB must be used.  
<br>

## Sources
Binaries - https://github.com/themattman/mongodb-raspberrypi-binaries/releases  
Docker Images - https://github.com/themattman/mongodb-raspberrypi-docker/tree/main  
<br>

## How to Install
### Download Pre-Built Docker Images
1. Navigate to the [releases page](https://github.com/themattman/mongodb-raspberrypi-docker/releases).
2. Download the tarball via browser or copying the link to a terminal session
```
$ wget https://github.com/themattman/mongodb-raspberrypi-docker/releases/download/r7.0.3-mongodb-raspberrypi-docker-unofficial/mongodb.ce.pi4.r7.0.3-mongodb-raspberrypi-docker-unofficial.tar.gz
```
3. Load the release
```
$ docker load --input mongodb.ce.pi4.r7.0.3-mongodb-raspberrypi-docker-unofficial.tar.gz
```
Should get the following output
```
Loaded image: mongodb-raspberrypi4-unofficial-r7.0.3:latest
```
