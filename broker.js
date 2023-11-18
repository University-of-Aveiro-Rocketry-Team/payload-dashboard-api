const mqtt = require("mqtt");
const logger = require("./logger");
const client = mqtt.connect("mqtt://" + (process.env.MQTT_HOST ? process.env.MQTT_HOST : "localhost") + ":1883", {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

client.on("connect", function () {
  console.log("connected to the broker");
});

function publishMessage(topic, message) {
  client.publish(topic, message, function (err) {
    if (err) {
      console.error(`Failed to publish message: ${err}`);
      logger.error({
        message: `[BROKER] Failed to publish message on topic ${topic}`,
        err,
      });
    } else {
      console.log(`Message published to topic ${topic}`);
      logger.info(`[BROKER] Message published to topic ${topic} with payload ${message}`);
    }
  });
}

module.exports = {
  publishMessage,
};
