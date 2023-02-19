import express from "express";
import pkg from "body-parser";
import sequelize from "./config/db.config.js";
import Accounts from "./models/accounts.model.js";
import Router from "./routes/routes.js";
const { json, urlencoded } = pkg;
import cors from "cors";

const app = express();
const port = 8800;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(Router);
app.get("/", (_req, res) => res.send("Hello World!"));

try {
  sequelize
    .sync()
    .then(() => {
      console.log("Connection to the database has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });
} catch (error) {
  console.error(error);
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
