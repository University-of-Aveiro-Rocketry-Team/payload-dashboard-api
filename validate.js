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
  acceleration_x: Joi.number().required(),
  acceleration_y: Joi.number().required(),
  acceleration_z: Joi.number().required(),
  gyroscope_x: Joi.number().required(),
  gyroscope_y: Joi.number().required(),
  gyroscope_z: Joi.number().required(),
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

// RMC schema that corresponds to Swagger documentation
const rmcSchema = Joi.object({
  valid: Joi.boolean().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  speed: Joi.number().min(0).required(),
  date: Joi.string().required(),
});

// VTG schema that corresponds to Swagger documentation
const vtgSchema = Joi.object({
  true_track_degress: Joi.number().required(),
  speed_kph: Joi.number().min(0).required(),
});

// GGA schema that corresponds to Swagger documentation
const ggaSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  altitude: Joi.number().min(0).required(),
  fix_quality: Joi.number().valid(1, 2, 3).required(),
  satelites: Joi.number().min(0).max(18).required(),
  hdop: Joi.number().required(),
  height_geoid: Joi.number().required(),
  time: Joi.string().required(),
});

// GSA schema that corresponds to Swagger documentation
const gsaSchema = Joi.object({
  mode: Joi.string().valid("A", "M").required(),
  fix_type: Joi.number().valid(1, 2, 3).required(),
  satelites: Joi.array().items(Joi.number().min(0).max(12)).required(),
  pdop: Joi.number().required(),
  hdop: Joi.number().required(),
  vdop: Joi.number().required(),
});

// GLL schema that corresponds to Swagger documentation
const gllSchema = Joi.object({
  mode: Joi.string().valid("A", "V").required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  time: Joi.string().required(),
});

// GSV schema that corresponds to Swagger documentation
const gsvSchema = Joi.object({
  total_messages: Joi.number().valid(1, 2, 3).required(),
  message_number: Joi.number().valid(1, 2, 3).required(),
  satelites: Joi.array().items(Joi.object({
    prn: Joi.number().min(0).max(12).required(),
    elevation: Joi.number().min(0).max(90).required(),
    azimuth: Joi.number().min(0).max(359).required(),
    snr: Joi.number().required(),
  })).required(),
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

// Middleware for validating MPU6500 data
const validateMPU6500 = (req, res, next) => {
  const { error } = mpu6050Schema.validate(req.body["data"], { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .send({ name: "MPU6500 Validation Error", details: error.details });
  }
  next();
};

// Middleware for validating NEO-7M data
const validateNEO7M = (req, res, next) => {
  if (req.path === "/gprmc") {
    const { error } = rmcSchema.validate(req.body["data"], {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .send({ name: "RMC Validation Error", details: error.details });
    }
  } else if (req.path === "/gpvtg") {
    const { error } = vtgSchema.validate(req.body["data"], {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .send({ name: "VTG Validation Error", details: error.details });
    }
  } else if (req.path === "/gpgga") {
    const { error } = ggaSchema.validate(req.body["data"], {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .send({ name: "GGA Validation Error", details: error.details });
    }
  } else if (req.path === "/gpgsa") {
    const { error } = gsaSchema.validate(req.body["data"], {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .send({ name: "GSA Validation Error", details: error.details });
    }
  } else if (req.path === "/gpgll") {
    const { error } = gllSchema.validate(req.body["data"], {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .send({ name: "GLL Validation Error", details: error.details });
    }
  } else if (req.path === "/gpgsv") {
    const { error } = gsvSchema.validate(req.body["data"], {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .send({ name: "GSV Validation Error", details: error.details });
    }
  } else {
    const { error } = neo7mSchema.validate(req.body["data"], {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .send({ name: "NEO-7M Validation Error", details: error.details });
    }
  }

  next();
};


module.exports = {
  validateBME680,
  validateMPU6500,
  validateNEO7M,
  validateID
};
