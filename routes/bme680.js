const express = require("express");
const router = express.Router();
const { fetchFromDatabase, addToDatabase } = require("../database");
const { validateBME680 } = require("../validate");
const logger = require("../logger");

// Middleware to log request info
router.use((req, res, next) => {
  logger.info({
    message: `[ENDPOINT] ${req.method} '/v1/bme680/'${req.path}`,
    ip: req.ip,
    body: req.body,
  });

  next();
});

// Middleware to log response time
router.use((req, res, next) => {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    // 'finish' event is emitted when response finished sending
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    logger.info({
      message: `[RESPONSE] ${req.method} '/v1/bme680/'${req.path}`,
      status_code: res.statusCode,
      time_elapsed: elapsedTimeInMs.toFixed(3) + ` ms`,
    });
  });

  next();
});

/**
 * @swagger
 * /v1/bme680:
 *   get:
 *     tags: [BME680]
 *     summary: Get sensor data
 *     description: Retrieve the temperature, humidity, gas, and pressure readings from the BME680 sensor.
 *     responses:
 *       200:
 *         description: The BME680 sensor readings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BME680_Data'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    res.json(await fetchFromDatabase("bme680"));
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * tags:
 *   name: BME680
 * description: Sensor data from BME680
 * /v1/bme680:
 *    post:
 *      tags: [BME680]
 *      summary: Post sensor data
 *      description: Post the temperature, humidity, gas, and pressure readings from the BME680 sensor.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BME680_Data'
 *      responses:
 *        200:
 *          description: Data added successfully
 *        422:
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ValidationErrors'
 *        400:
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SyntaxError'
 *        500:
 *          description: Internal server error
 */
router.post("/", validateBME680, async (req, res) => {
  try {
    await addToDatabase("bme680", req.body);
    res.status(200).send("Data added successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
