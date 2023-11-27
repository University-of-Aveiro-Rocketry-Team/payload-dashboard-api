const express = require("express");
const router = express.Router();
const { fetchFromDatabase, addToDatabase } = require("../database");
const { validateMPU6500, validateID } = require("../validate");
const logger = require("../logger");

// Middleware to log request info
router.use((req, res, next) => {
  logger.info({
    message: `[ENDPOINT] ${req.method} 'api/v1/mpu6500/'${req.path}`,
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
      message: `[RESPONSE] ${req.method} 'api/v1/mpu6500/'${req.path}`,
      status_code: res.statusCode,
      time_elapsed: elapsedTimeInMs.toFixed(3) + ` ms`,
    });
  });

  next();
});

/**
 * @swagger
 * /api/v1/mpu6500:
 *   get:
 *     summary: Get MPU-6500 data
 *     tags: [MPU-6500]
 *     responses:
 *       200:
 *         description: The MPU-6500 sensor readings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MPU6500_Data'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    res.json(await fetchFromDatabase("mpu6500"));
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/mpu6500:
 *    post:
 *      summary: Insxert MPU-6500 data to the database
 *      tags: [MPU-6500]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MPU6500_Data'
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
router.post("/", validateMPU6500, async (req, res) => {
  try {
    await addToDatabase("mpu6500", req.body);
    res.status(200).send({"message": "Data added successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/mpu6500/{id}:
 *    delete:
 *      summary: Remove MPU-6500 data from the database
 *      tags: [MPU-6500]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the MPU-6500 object to delete
 *      responses:
 *        200:
 *          description: Data removed successfully
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
 *        404:
 *          description: ID not found
 *        500:
 *          description: Internal server error
 */
router.delete("/:id", validateID, async (req, res) => {
  try {
    await deleteFromDatabase("mpu6500", req.params["id"]);
    res.status(200).send({"message": "Data deleted successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});


module.exports = router;
