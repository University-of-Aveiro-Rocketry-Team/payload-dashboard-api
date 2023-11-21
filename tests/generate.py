import requests
import time
import argparse
import random


def generate_bme680_data():
    # A function that generates data for temperature, humidity, pressure, and gas resistance
    # the data is is close to a real world usage i.e., there are no sudden jumps in the data

    # Temperature
    temperature = random.uniform(20, 30)
    # Humidity
    humidity = random.uniform(30, 40)
    # Pressure
    pressure = random.uniform(1000, 1100)
    # Gas Resistance
    gas_resistance = random.uniform(1000, 1100)

    return {
        "data": {
            "temperature": temperature,
            "humidity": humidity,
            "pressure": pressure,
            "gas_resistance": gas_resistance
        }
    }

def post_data(api_url, sensors):
    for sensor in sensors:
        API_ENDPOINT = api_url + '/' + sensor
        if sensor == 'bme680':
            data = generate_bme680_data()
        elif sensor == 'neo7m':
            # Add data generation for neo7m
            pass
        elif sensor == 'mpu6500':
            # Add data generation for mpu6500
            pass
        
        response = requests.post(API_ENDPOINT, json=data)
        print(f"Posting data for {sensor}. Status Code: {response.status_code}, Response: {response.json()}")

def main():
    parser = argparse.ArgumentParser(description='Post data to API for specified sensors.')
    parser.add_argument('--sensors', nargs='+', help='List of sensors to test, e.g., bme680 neo7m mpu6500')
    parser.add_argument('--api_url', type=str, default='http://127.0.0.1:3001/api/v1', help='API URL to post data to')
    parser.add_argument('--interval', type=int, default=10, help='Time interval in seconds for posting data')
    args = parser.parse_args()

    if args.sensors and args.api_url:
        while True:
            post_data(args.api_url, args.sensors)
            time.sleep(args.interval)
    else:
        print("Please specify both sensors and API URL.")

if __name__ == "__main__":
    main()
