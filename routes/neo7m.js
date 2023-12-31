const express = require("express");
const router = express.Router();
const { fetchFromDatabase, addToDatabase, deleteFromDatabase } = require("../database");
const { validateNEO7M, validateID } = require("../validate");
const logger = require("../logger");


// Middleware to log request info
router.use((req, res, next) => {
  logger.info({
    message: `[ENDPOINT] ${req.method} 'api/v1/neo7m/'${req.path}`,
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
      message: `[RESPONSE] ${req.method} 'api/v1/neo7m/'${req.path}`,
      status_code: res.statusCode,
      time_elapsed: elapsedTimeInMs.toFixed(3) + ` ms`,
    });
  });

  next();
});

/**
 * @swagger
 * /api/v1/neo7m:
 *   get:
 *     summary: Get NEO-7M data
 *     tags: [NEO-7M]
 *     responses:
 *       200:
 *         description: The NEO-7M sensor readings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NEO7M_Data'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    res.json(await fetchFromDatabase("neo7m"));
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m:
 *    post:
 *      summary: Insert NEO-7M data to the database
 *      tags: [NEO-7M]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NEO7M_Data'
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
router.post("/", async (req, res) => {
  try {
    await addToDatabase("neo7m", req.body);
    res.status(200).send({"message": "Data added successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/{id}:
 *    delete:
 *      summary: Remove NEO-7M data from the database
 *      tags: [NEO-7M]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the NEO-7M object to delete
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
    await deleteFromDatabase("neo7m", req.params['id']);
    res.status(200).send({"message": "Data removed successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gprmc:
 *   get:
 *     summary: Get GPS RMC data
 *     tags: [NEO-7M]
 *     responses:
 *       200:
 *         description: The GPS RMC data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPRMC_Data'
 *       500:
 *         description: Internal server error
 */
router.get("/gprmc", async (req, res) => {
  try {
    res.json(await fetchFromDatabase("neo7m-gprmc"));
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gprmc:
 *    post:
 *      summary: Insert GPS RMC data to the database
 *      tags: [NEO-7M]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GPRMC_Data'
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
router.post("/gprmc", validateNEO7M, async (req, res) => {
  try {
    await addToDatabase("neo7m-gprmc", req.body);
    res.status(200).send({"message": "Data added successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gprmc/{id}:
 *    delete:
 *      summary: Remove GPS GPRMC data from the database
 *      tags: [NEO-7M]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the GPS GPRMC object to delete
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
router.delete("/gprmc/:id", validateID, async (req, res) => {
  try {
    await deleteFromDatabase("neo7m-gprmc", req.params["id"]);
    res.status(200).send({"message": "Data removed successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgga:
 *   get:
 *     summary: Get GPS GGA data
 *     tags: [NEO-7M]
 *     responses:
 *       200:
 *         description: The GPS GGA data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPGGA_Data'
 *       500:
 *         description: Internal server error
 */
router.get("/gpgga", async (req, res) => {
  try {
    res.json(await fetchFromDatabase("neo7m-gpgga"));
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgga:
 *    post:
 *      summary: Insert GPS GGA data to the database
 *      tags: [NEO-7M]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GPGGA_Data'
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
router.post("/gpgga", validateNEO7M, async (req, res) => {
  try {
    await addToDatabase("neo7m-gpgga", req.body);
    res.status(200).send({"message": "Data added successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgga{id}:
 *    delete:
 *      summary: Remove GPS GPGGA data from the database
 *      tags: [NEO-7M]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the GPS GPGGA object to delete
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
router.delete("&gpgga/:id", validateID, async (req, res) => {
  try {
    await deleteFromDatabase("neo7m-gpgga", req.params["id"]);
    res.status(200).send({"message": "Data removed successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpvtg:
 *   get:
 *     summary: Get GPS VTG data
 *     tags: [NEO-7M]
 *     responses:
 *       200:
 *         description: The GPS VTG data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPVTG_Data'
 *       500:
 *         description: Internal server error
 */
router.get("/gpvtg", async (req, res) => {
  try {
    res.json(await fetchFromDatabase("neo7m-gpvtg"));
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/pgvtg:
 *    post:
 *      summary: Insert GPS VTG data to the database
 *      tags: [NEO-7M]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GPVTG_Data'
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
router.post("/gpvtg", validateNEO7M, async (req, res) => {
  try {
    await addToDatabase("neo7m-gpvtg", req.body);
    res.status(200).send({"message": "Data added successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpvtg/{id}:
 *    delete:
 *      summary: Remove GPS GPVTG data from the database
 *      tags: [NEO-7M]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the GPS GPVTG object to delete
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
router.delete("&gpvtg/:id", validateID, async (req, res) => {
  try {
    await deleteFromDatabase("neo7m-gpvtg", req.params["id"]);
    res.status(200).send({"message": "Data removed successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgsa:
 *   get:
 *     summary: Get GPS GSA data
 *     tags: [NEO-7M]
 *     responses:
 *       200:
 *         description: The GPS GSA data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPGSA_Data'
 *       500:
 *         description: Internal server error
 */
router.get("/gpgsa", async (req, res) => {
  try {
    res.json(await fetchFromDatabase("neo7m-gpgsa"));
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgsa:
 *    post:
 *      summary: Insert GPS GSA data to the database
 *      tags: [NEO-7M]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GPGSA_Data'
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
router.post("/gpgsa", validateNEO7M, async (req, res) => {
  try {
    await addToDatabase("neo7m-gpgsa", req.body);
    res.status(200).send({"message": "Data added successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgsa{id}:
 *    delete:
 *      summary: Remove GPS GPGSA data from the database
 *      tags: [NEO-7M]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the GPS GPGSA object to delete
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
router.delete("/gpgsa/:id", validateID, async (req, res) => {
  try {
    await deleteFromDatabase("neo7m-gpgsa", req.params["id"]);
    res.status(200).send({"message": "Data removed successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgll:
 *   get:
 *     summary: Get GPS GLL data
 *     tags: [NEO-7M]
 *     responses:
 *       200:
 *         description: The GPS GLL data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPGLL_Data'
 *       500:
 *         description: Internal server error
 */
router.get("/gpgll", async (req, res) => {
  try {
    res.json(await fetchFromDatabase("neo7m-gpgll"));
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgll:
 *    post:
 *      summary: Insert GPS GLL data to the database
 *      tags: [NEO-7M]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GPGLL_Data'
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
router.post("/gpgll", validateNEO7M, async (req, res) => {
  try {
    await addToDatabase("neo7m-gpgll", req.body);
    res.status(200).send({"message": "Data added successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgll/{id}:
 *    delete:
 *      summary: Remove GPS GPGLL data from the database
 *      tags: [NEO-7M]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the GPS GPGLL object to delete
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
router.delete("/gpgll/:id", validateID, async (req, res) => {
  try {
    await deleteFromDatabase("neo7m-gpgll", req.params["id"]);
    res.status(200).send({"message": "Data removed successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgsv:
 *   get:
 *     summary: Get GPS GSV data
 *     tags: [NEO-7M]
 *     responses:
 *       200:
 *         description: The GPS GSV data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPGSV_Data'
 *       500:
 *         description: Internal server error
 */
router.get("/gpgsv", async (req, res) => {
  try {
    res.json(await fetchFromDatabase("neo7m-gpgsv"));
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgsv:
 *    post:
 *      summary: Insert GPS GSC data to the database
 *      tags: [NEO-7M]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GPGSV_Data'
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
router.post("/gpgsv", validateNEO7M, async (req, res) => {
  try {
    await addToDatabase("neo7m-gpgsv", req.body);
    res.status(200).send({"message": "Data added successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});

/**
 * @swagger
 * /api/v1/neo7m/gpgsv/{id}:
 *    delete:
 *      summary: Remove GPS GPGSV data from the database
 *      tags: [NEO-7M]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the GPS GPGSV object to delete
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
router.delete("/gpgsv/:id", validateID, async (req, res) => {
  try {
    await deleteFromDatabase("neo7m-gpgsv", req.params["id"]);
    res.status(200).send({"message": "Data removed successfully"});
  } catch (error) {
    res.status(500).send({"message": "Internal Server Error"});
  }
});


module.exports = router;
