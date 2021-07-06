require("dotenv").config();
import server from "./bootstrap/server";
import mongoDB from "./bootstrap/db";

const init = async () => {
  const db = await mongoDB();
  server(db);
};
init();
