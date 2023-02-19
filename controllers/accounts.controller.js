import { v4 as uuidv4 } from "uuid";
import Accounts from "../models/accounts.model.js";
import { encryptData, decryptData } from "../temp.js";

const postAccounts = (req, res) => {
  const { emailId, accountName, website } = req.body;
  const accountId = uuidv4();
  console.log(accountId);

  let encrypted = encryptData(accountId.toString("hex"));
  console.log(encrypted);

  let decrypted = decryptData(encrypted);
  console.log(decrypted);

  Accounts.create({
    emailId,
    accountName,
    appSecretToken: encrypted,
    website,
    accountId,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Account.",
      });
    });
};

const getAllAccounts = (req, res) => {
  Accounts.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving accounts.",
        data: data,
      });
    });
};

const getOneAccount = (req, res) => {
  const accountId = req.params.accountId;
  Accounts.findOne({
    where: { accountId: accountId },
  })
    .then((data) => {
      console.log(data);
      data ? res.json(data) : res.json("Invalid accountID");
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving Account with id=" + accountId,
      });
    });
};

const updateAccount = (req, res) => {
  const accountId = req.params.accountId;
  Accounts.update(req.body, {
    where: { accountId: accountId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Account was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Account with accountId=${accountId}. Maybe Account was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Account with id=" + id,
      });
    });
};

const deleteAccount = (req, res) => {
  const accountId = req.params.accountId;
  Accounts.destroy({
    where: { accountId: accountId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Account was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Account with accountId=${accountId}. Maybe Account was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Account with accountId=" + accountId,
      });
    });
};

const dropTable = async (req, res) => {
  try {
    await Accounts.drop();
    console.log("Table dropped successfully.");
    return res.json();
  } catch (err) {
    console.log("Error dropping table:", err);
    return res.json();
  }
};

export { postAccounts, getAllAccounts, getOneAccount, updateAccount, deleteAccount, dropTable };
