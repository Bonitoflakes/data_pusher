import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";
import Accounts from "./accounts.model.js";

const Destination = sequelize.define("Destination", {
  destinationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Accounts,
      key: "accountId",
    },
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  httpMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  headers: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

// Define the associations between Destination and Account
// Destination.belongsTo(Accounts);
Destination.belongsTo(Accounts, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
});
Accounts.hasMany(Destination);

export default Destination;
