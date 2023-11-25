const Joi = require("joi");
const { ObjectId } = require("mongodb");


// BME680 schema that corresponds to Swagger documentation
const bme680Schema = Joi.object({
  temperature: Joi.number().required(),
  humidity: Joi.number().min(0).required(),
  pressure: Joi.number().min(0).required(),
  gas_resistance: Joi.number().min(0).required(),
});

// MPU6050 schema that corresponds to Swagger documentation
const mpu6050Schema = Joi.object({
  accelerometer: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    z: Joi.number().required(),
  }).required(),
  gyroscope: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    z: Joi.number().required(),
  }).required(),
});

// NEO-7M schema that corresponds to Swagger documentation
const neo7mSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  altitude: Joi.number().min(0).required(),
  speed: Joi.number().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
});


// Middleware for validating ID
const validateID = (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
  } catch (error) {
    return res.status(400)
      .send({ 
        "name": "ID Validation Error",
        "details": [
          {
            "message": "\"id\" must be a valid MongoDB ObjectId.",
            "path": ["id"],
            "type": "",
            "context": {
              "value": req.params.id,
              "label": "id",
              "key": "id"
            }
          }
        ]    
      }
    );
  }
  next();
};

// Middleware for validating BME680 data
const validateBME680 = (req, res, next) => {
  const { error } = bme680Schema.validate(req.body["data"], { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .send({ name: "BME680 Validation Error", details: error.details });
  }
  next();
};

// Middleware for validating MPU6050 data
const validateMPU6050 = (req, res, next) => {
  const { error } = mpu6050Schema.validate(req.body["data"], { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .send({ name: "MPU6050 Validation Error", details: error.details });
  }
  next();
};

// Middleware for validating NEO-7M data
const validateNEO7M = (req, res, next) => {
  const { error } = neo7mSchema.validate(req.body["data"], { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .send({ name: "NEO-7M Validation Error", details: error.details });
  }
  next();
};


module.exports = {
  validateBME680,
  validateMPU6050,
  validateNEO7M,
  validateID
};
