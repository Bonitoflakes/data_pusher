import sequelize from "../config/db.config.js";
import Destination from "../models/destination.model.js";

const postDestination = (req, res) => {
  const { url, httpMethod, headers } = req.body;
  Destination.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Destination.",
      });
    });
};

const getAllDestinations = (req, res) => {
  Destination.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving destinations.",
        data: data,
      });
    });
};

const getAllDestinationsforAnAccount = (req, res) => {
  Destination.findAll({
    where: { accountId: req.params.accountId },
    attributes: ["url", "headers", "httpMethod"],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving destinations.",
        data: data,
      });
    });
};

const getOneDestination = (req, res) => {
  const destinationId = req.params.destinationId;
  Destination.findOne({
    where: { destinationId: destinationId },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Destination with id=" + destinationId,
      });
    });
};

const updateDestination = (req, res) => {
  const destinationId = req.params.destinationId;
  Destination.update(req.body, {
    where: { destinationId: destinationId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Destination was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Destination with id=${destinationId}. Maybe Destination was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Destination with id=" + destinationId,
      });
    });
};

const deleteDestination = (req, res) => {
  const destinationId = req.params.destinationId;
  Destination.destroy({
    where: { destinationId: destinationId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Destination was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Destination with id=${destinationId}. Maybe Destination was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Destination with id=" + destinationId,
      });
    });
};

export {
  postDestination,
  getAllDestinations,
  getOneDestination,
  updateDestination,
  deleteDestination,
  getAllDestinationsforAnAccount,
};
