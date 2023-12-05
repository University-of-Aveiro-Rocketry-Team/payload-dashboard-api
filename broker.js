const mqtt = require("mqtt");
const logger = require("./logger");
const client = mqtt.connect("ws://" + (process.env.MQTT_HOST ? process.env.MQTT_HOST : "localhost") + ":9001", {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

client.on("connect", function () {
  console.log("Connected to the broker successfully");
});

function publishMessage(topic, message) {
  client.publish(topic, JSON.stringify(message), function (err) {
    if (err) {
      console.error(`Failed to publish message: ${err}`);
      logger.error({
        message: `[BROKER] Failed to publish message on topic ${topic}`,
        err,
      });
    } else {
      console.log(`Message published to topic ${topic}`);
      logger.info(
        `[BROKER] Message published to topic ${topic} with payload ${JSON.stringify(message)}`
      );
    }
  });
}

module.exports = {
  publishMessage,
};
