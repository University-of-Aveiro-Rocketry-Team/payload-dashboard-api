# Create a Virtual Environment
1. Navigate to the directory containing the script and create a virtual environment:

```
python3 -m venv venv
```

2. Activate the Virtual Environment
Activate the virtual environment:

```
source venv/bin/activate
```

# Install Required Packages
Install the required packages using pip:

```
pip3 install -r requirements.txt
```

# Testing
Run the script using the following command:

```
python3 generate.py --sensors [SENSOR_NAMES] --api_url [API_URL] --interval [INTERVAL]
```
Replace [SENSOR_NAMES] with the names of the sensors (e.g., bme680 neo7m), [API_URL] with the URL of your API, and [INTERVAL] with the time interval in seconds.

Example:
```
python3 generate.py --sensors bme680 neo7m --api_url http://localhost:3000/api/v1 --interval 10
```

# Deactivating the Virtual Environment
Once you are done, you can deactivate the virtual environment:

```
deactivate
```
