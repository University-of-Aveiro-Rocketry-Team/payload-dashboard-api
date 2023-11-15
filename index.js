const express = require("express");
const app = express();
const fs = require("fs");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const static = require("./static");
const package = require("./package.json");

const PORT = process.env.PORT || static.PORT;
const IP = process.env.IP || "127.0.0.1";
const PROTOCOL = process.env.PROTOCOL ? "https" : "http";
const URL = PROTOCOL + "://" + IP + ":" + (process.env.PORT ? process.env.PORT : PORT);


// Setup Express Middleware
app.use(express.json());

// Add JSON parsing error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ name: "Syntax Error", details: err.message });
  }
  next(err);
});

// Expose public content
app.use("/public", express.static(path.join(__dirname, "public")));

// Enable Cors Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// Setup Swagger Docs
const swagger_options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: package["name"],
      version: package["version"],
      description: package["description"],
      contact: { name: "André Clérigo", email: "andreclerigo@ua.pt" },
    },
    servers: [{ url: URL, description: "Payload API" }],
  },
  apis: ["./routes/*.js", "./docs/payload-api.yml"],
};

// Swagger Docs customization
const swagger_specs = swaggerJsDoc(swagger_options);
app.use(
  "/api/v1/docs",
  swaggerUI.serve,
  swaggerUI.setup(swagger_specs, {
    customSiteTitle: "Payload API",
    customfavIcon: "/public/logo.png",
  })
);

// Redirect API root to docs webpage
app.get("/", (req, res) => {
  res.redirect("/api/v1/docs");
});

app.get("/api/v1/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swagger_specs);
});

// Setup routes
fs.readdir(static.ROUTES_DIR, (err, files) => {
  files.forEach((file) =>
    app.use(
      `/api/v1/${file.replace(".js", "")}`,
      require(static.ROUTES_DIR + file.replace(".js", ""))
    )
  );

  // Middleware to handle 404 when nothing else responded
  app.use((req, res, next) => {
    res.status(404).json({
      message: `404 | Endpoint ${req.url} Not Found!`,
      url: URL + req.url,
      timestamp: new Date().toISOString(),
    });

    return;
  });
});

// Startup Message
app.listen(PORT, () => {
  console.log(`App listening on ${URL}`);
});
