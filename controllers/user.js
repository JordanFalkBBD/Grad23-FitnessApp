const express = require("express");
const router = express.Router();
const dal = require("../models/userDAL");

router.get("/", async (req, res) => {
  const data = await dal.getUser(req.session.userID);
  res.json(JSON.stringify(data));
});

router.post("/update/:metric/:email", async (req, res) => {
  const data = await dal.updateUser(req.session.userID, req.params.email, req.params.metric);
  res.status(200);
});

module.exports = router;