const { MongoClient, ObjectId } = require("mongodb");
const { publishMessage } = require("./broker");
const logger = require("./logger");
const staticConfig = require("./static");

// Connection URI and client
const uri = `mongodb://${process.env.MONGODB_HOST || "mongodb"}:27017`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Optional: tune pool size and timeouts
  // maxPoolSize: 20,
  // serverSelectionTimeoutMS: 5000,
});
let db;

// Initialize and cache the database connection
const initDb = async () => {
  if (!db) {
    await client.connect();
    db = client.db(staticConfig.DATABASE_NAME);
    console.log("MongoDB connected");
  }
  return db;
};

// Fetch all documents from a collection
const fetchFromDatabase = async (collectionName) => {
  try {
    const database = await initDb();
    const collection = database.collection(collectionName);
    const data = await collection.find({}).toArray();
    logger.info(`[DATABASE] Fetched data from ${collectionName} collection`);
    return data;
  } catch (error) {
    logger.error({
      message: `[DATABASE] Failed to fetch data from ${collectionName}: ${error.message}`,
      error,
    });
    throw new Error("Failed to fetch data from database");
  }
};

// Insert a new document (and publish to MQTT if needed)
const addToDatabase = async (collectionName, data) => {
  try {
    const database = await initDb();
    const collection = database.collection(collectionName);
    data.timestamp = new Date();
    const result = await collection.insertOne(data);
    logger.info(`[DATABASE] Added document to ${collectionName} collection`);
    if (["neo7m", "mpu6500"].includes(collectionName)) {
      publishMessage(collectionName, data);
    }
    return result;
  } catch (error) {
    logger.error({
      message: `[DATABASE] Failed to add data to ${collectionName}: ${error.message}`,
      error,
    });
    throw new Error("Failed to add data to database");
  }
};

// Delete a document by its ObjectId
const deleteFromDatabase = async (collectionName, idValue) => {
  try {
    const database = await initDb();
    const collection = database.collection(collectionName);
    const result = await collection.findOneAndDelete({ _id: new ObjectId(idValue) });
    if (result.value) {
      logger.warn(
        `[DATABASE] Deleted document from ${collectionName} with id: ${idValue}`
      );
      return result.value;
    } else {
      logger.warn(
        `[DATABASE] No document found in ${collectionName} with id: ${idValue}`
      );
      return null;
    }
  } catch (error) {
    logger.error({
      message: `[DATABASE] Failed to delete data from ${collectionName}: ${error.message}`,
      error,
    });
    throw new Error("Failed to delete data from database");
  }
};

const updateDatabase = async (collectionName, param, paramValue, newValues) => {
  // NOT YET IMPLEMENTED
  // const mongoClient = new MongoClient("mongodb://mongodb:27017");
  // try {
  //   await mongoClient.connect();
  //   const database = mongoClient.db(static.DATABASE_NAME);
  //   const collection = database.collection(collectionName);
  //   let data = await collection.updateOne(
  //     { [param]: paramValue },
  //     { $set: newValues }
  //   );
  //   data = await collection.findOne({ [param]: paramValue });
  //   logger.info(
  //     `[DATABASE] Updated data in ${collectionName} collection with ${param}: ${paramValue}`
  //   );
  //   return data;
  // } catch (error) {
  //   logger.error({
  //     message: `[DATABASE] Failed to update data in ${collectionName} collection: ${error.message}`,
  //     error,
  //   });
  //   console.error(error); // Debugging purposes
  //   throw new Error("Failed to update data from database");
  // } finally {
  //   await mongoClient.close();
  // }
};


module.exports = {
  initDb,
  fetchFromDatabase,
  addToDatabase,
  updateDatabase,
  deleteFromDatabase,
};
