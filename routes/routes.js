import { Router } from "express";
import {
  postAccounts,
  getAllAccounts,
  updateAccount,
  deleteAccount,
  dropTable,
  getOneAccount,
} from "../controllers/accounts.controller.js";
import {
  postDestination,
  getAllDestinations,
  getOneDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destination.controller.js";
import Accounts from "../models/accounts.model.js";
import Destination from "../models/destination.model.js";
import axios from "axios";
import { EmbedBuilder, WebhookClient } from "discord.js";
import { decryptData } from "../temp.js";

const router = Router();

//accounts schema
router.post("/accounts/save", postAccounts);
router.get("/accounts/getAll", getAllAccounts);
router.get("/accounts/:accountId", getOneAccount);
router.put("/accounts/update/:accountId", updateAccount);
router.delete("/accounts/delete/:accountId", deleteAccount);
router.delete("/accounts/drop", dropTable);

router.post("/destinations/save", postDestination);
router.get("/destinations/getAll", getAllDestinations);
router.get("/destinations/:destinationId", getOneDestination);
router.put("/destinations/:destinationId", updateDestination);
router.delete("/destinations/:destinationId", deleteDestination);

async function fetchData(url) {
  const data = await axios.get(url);
  // console.log(data);
  return data;
}

router.post("/server/incoming_data", async function pushData(req, res) {
  try {
    console.log("✨✨✨✨✨");
    console.log(req.headers["cl-x-token"]);
    if (req.headers["cl-x-token"]) {
      // Decrypt the clxtoken and find the accountID.
      const decryptedAccountId = decryptData(req.headers["cl-x-token"]);
      console.log("✨✨✨✨✨");
      console.log(decrypted);
      const accountDetails = await Accounts.findAndCountAll({ where: { accountId: decryptedAccountId } });

      if (accountDetails.count === 1) {
        const destinationDetails = await Destination.findAll({
          where: { accountId: decryptedAccountId },
          attributes: ["url", "headers", "httpMethod"],
        });

        const temp = JSON.parse(JSON.stringify(destinationDetails));

        const responses = await Promise.all(
          temp.map(async (destination) => {
            console.log("✨✨✨✨ Making the axios call");
            console.log(req.body);
            const { data } = await axios.post(destination.url, { ...req.body });
            // const { data } = await axios.post(destination.url);
            return data;
          })
        );
        return res.json(responses);
      }
    } else {
      return res.status(401).json("Unauthorized!!");
    }
  } catch (error) {
    return res.json(error);
  }
});

router.post("/destinations/one/facebook", async function savePost(req, res) {
  try {
    console.log("Saving post to Facebook");
    console.log(req.body);
    return res.status(201).json(req.body);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/destinations/one/discord", async function savePost(req, res) {
  try {
    console.log(req.body);
    console.log("Saving post to Dis");

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

export default router;