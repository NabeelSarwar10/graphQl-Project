
import { MongoClient } from "mongodb";
export default () => {
  return new Promise(async (resolve, reject) => {
    try {
      await MongoClient.connect(process.env.MONGO_URI_ATLAS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then((database) => {
        const parts = process.env.MONGO_URI_ATLAS.split("/");
        const databaseName = parts[parts.length - 1];
        const db = database.db(databaseName);
        console.log("DB Connected Successfully...!");
        resolve(db);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
