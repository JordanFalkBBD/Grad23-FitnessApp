const express = require("express");
const router = express.Router();
const dal = require("../models/Server");

router.get("/:email", async (req, res) => {
  const userID = await dal.fetchUserID(req.params.email);
  const data = await dal.fetchUser(userID);
  res.json(JSON.stringify(data));
});

router.post("/update/:metric/:email", async (req, res) => {
  const userID = await dal.fetchUserID(req.params.email);
  const data = await dal.updateUser(userID, req.params.email,req.params.metric);
  res.json(JSON.stringify(data));
});

module.exports = router;