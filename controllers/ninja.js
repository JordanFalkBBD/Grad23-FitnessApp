const express = require("express");
const router = express.Router();
const config = require("../config");

router.get("/:search", (req, res) => {
  fetch(" https://api.api-ninjas.com/v1/exercises?name=" + req.params.search, {
    headers: {
      "X-Api-Key": config.ninja_key,
    },
  })
    .then((response) => response.json())
    .then((response) => res.json(response));
});

module.exports = router;
