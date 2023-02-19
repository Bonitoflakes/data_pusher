import express from "express";
import pkg from "body-parser";
import sequelize from "./config/db.config.js";
const { json, urlencoded } = pkg;
import cors from "cors";

const app = express();
const port = 8801;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/destinations/one/facebook", async function savePost(req, res) {
  try {
    console.log("Saving post to Facebook");
    console.log(req.body);
    return res.status(201).json(req.body);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.post("/destinations/one/discord", async function savePost(req, res) {
  try {
    console.log(req.body);
    const webhookClient = new WebhookClient({
      url: "https://discord.com/api/webhooks/1076082111435505724/_cKXomhVvYjcLFbpr5WK1-83cCMzI1DTUYuVn_6wbWmCRx3uXlZM0AVomJI36cxY4mtX",
    });
    const embed = new EmbedBuilder()
      .setTitle(req.body.title ?? "Hey Kiwi!!!")
      .setDescription(req.body.description ?? "Webhooks 101");

    webhookClient.send({
      content: req.body.msg,
      username: "bonitoflakes",
      avatarURL: "https://i.imgur.com/AfFp7pu.png",
      embeds: [embed],
    });
  } catch (error) {
    return res.send(500).json(error);
  }
});

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
