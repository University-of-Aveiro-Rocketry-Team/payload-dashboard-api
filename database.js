const { MongoClient } = require("mongodb");
const { publishMessage } = require("./broker");
const logger = require("./logger");
const static = require("./static");

const fetchFromDatabase = async (collectionName) => {
  const mongoClient = new MongoClient(
    "mongodb://" +
    (process.env.MONGODB_HOST ? process.env.MONGODB_HOST : "localhost") +
    ":27017"
  );

  try {
    await mongoClient.connect();
    const database = mongoClient.db(static.DATABASE_NAME);
    const collection = database.collection(collectionName);
    let data = await collection.find({}).toArray();

    logger.info(`[DATABASE] Fetched data from ${collectionName} collection`);
    return data;
  } catch (error) {
    logger.error({
      message: `[DATABASE] Failed to fetch data from ${collectionName} collection: ${error.message}`,
      error,
    });
    console.error(error); // Debugging purposes
    throw new Error("Failed to fetch data from database");
  } finally {
    await mongoClient.close();
  }
};

const addToDatabase = async (collectionName, data) => {
  const mongoClient = new MongoClient(
    "mongodb://" +
    (process.env.MONGODB_HOST ? process.env.MONGODB_HOST : "localhost") +
    ":27017"
  );

  try {
    await mongoClient.connect();
    const database = mongoClient.db(static.DATABASE_NAME);
    const collection = database.collection(collectionName);

    // Add a timestamp to the data
    data.timestamp = new Date();

    await collection.insertOne(data);
    logger.info(`[DATABASE] Added data to ${collectionName} collection`);

    if (collectionName == "neo7m" || collectionName == "mpu6500") {
      publishMessage(collectionName, data);
    }
  } catch (error) {
    logger.error({
      message: `[DATABASE] Failed to add data to ${collectionName} collection: ${error.message}`,
      error,
    });
    console.error(error); // Debugging purposes
    throw new Error("Failed to post data from database");
  } finally {
    await mongoClient.close();
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

const deleteFromDatabase = async (collectionName, param, paramValue) => {
  // NOT YET IMPLEMENTED
  // const mongoClient = new MongoClient("mongodb://mongodb:27017");
  // try {
  //   await mongoClient.connect();
  //   const database = mongoClient.db(static.DATABASE_NAME);
  //   const collection = database.collection(collectionName);
  //   const data = await collection.findOne({ [param]: paramValue });
  //   if (data) {
  //     await collection.deleteOne({ [param]: paramValue });
  //     let user = await collection.findOne({
  //       "external_information.id": data.external_information.id,
  //     });
  //     // Delete the data from the cache
  //     if (!user) await deleteFromCache(data.external_information.id);
  //   }
  //   logger.warning(
  //     `[DATABASE] Deleted data from ${collectionName} collection with ${param}: ${paramValue}`
  //   );
  //   return data;
  // } catch (error) {
  //   logger.error({
  //     message: `[DATABASE] Failed to delete data from ${collectionName} collection: ${error.message}`,
  //     error,
  //   });
  //   console.error(error); // Debugging purposes
  //   throw new Error("Failed to delete data from database");
  // } finally {
  //   await mongoClient.close();
  // }
};

module.exports = {
  fetchFromDatabase,
  addToDatabase,
  updateDatabase,
  deleteFromDatabase,
};
