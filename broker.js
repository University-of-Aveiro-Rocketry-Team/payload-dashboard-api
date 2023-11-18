const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://" + (process.env.MQTT_HOST ? process.env.MQTT_HOST : "localhost") + ":1883");

client.on("connect", function () {
  console.log("connected to the broker");
});

function publish(topic, message) {
  client.publish(topic, message, function (err) {
    if (err) {
      console.error(`Failed to publish message: ${err}`);
    } else {
      console.log(`Message published to topic ${topic}`);
    }
  });
}
