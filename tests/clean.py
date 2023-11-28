import requests
import argparse


def get_ids(API_ENDPOINT):
    print(API_ENDPOINT)
    response = requests.get(API_ENDPOINT)

    if response.status_code == 200:
        data = response.json()
        ids = [item['_id'] for item in data]
        return ids
    else:
        print(f"Failed to fetch data. Status Code: {response.status_code}")
        return []

def delete_data(api_url, sensors):
    for sensor in sensors:
        API_ENDPOINT = api_url + '/' + sensor
        if sensor == 'bme680':
            ids = get_ids(API_ENDPOINT)
        elif sensor == 'neo7m':
            ids = []
            for message in ['gprmc', 'gpgga', 'gpvtg', 'gpgsa', 'gpgll', 'gpgsv']:
                API_ENDPOINT = api_url + '/' + sensor + '/' + message
                ids += get_ids(API_ENDPOINT)
            API_ENDPOINT = api_url + '/' + sensor
            ids += get_ids(API_ENDPOINT)
        elif sensor == 'mpu6500':
            ids = get_ids(API_ENDPOINT)
        
        for id in ids:
            response = requests.delete(API_ENDPOINT + '/' + id)
            print(f"Deleting data for {sensor}. Status Code: {response.status_code}")

def main():
    parser = argparse.ArgumentParser(description='Delete data with the API for specified sensors.')
    parser.add_argument('--sensors', nargs='+', help='List of sensors to test, e.g., bme680 neo7m mpu6500')
    parser.add_argument('--api_url', type=str, default='http://127.0.0.1:3001/api/v1', help='API URL to delete data to')
    args = parser.parse_args()

    if args.sensors and args.api_url:
        delete_data(args.api_url, args.sensors)
    else:
        print("Please specify both sensors and API URL.")

if __name__ == "__main__":
    main()
