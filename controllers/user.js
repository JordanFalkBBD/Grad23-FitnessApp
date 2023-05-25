const express = require("express");
const router = express.Router();
const dal = require("../models/Server");
const config = require("../config");

router.get("/", (req, res) => {
  const userID = dal.fetchUserID(req.session.email).then();
  const data = dal.fetchUser(userID).then();
  res.json(data);
});

router.post("/update/:metric/:email", (req, res) => {
  const userID = dal.fetchUserID(req.session.email).then();
  const data = dal.updateUser(userID, req.params.email,req.params.metric).then();
  res.json(data);
});

module.exports = router;