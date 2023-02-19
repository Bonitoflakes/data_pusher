import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const Accounts = sequelize.define("Account", {
  emailId: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  accountId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  appSecretToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING,
  },
});

export default Accounts;
