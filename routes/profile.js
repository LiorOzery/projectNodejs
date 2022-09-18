const express = require("express");
const _ = require("lodash");
const auth = require("../midlewares/auth");
const User = require("../models/User");

const router = express.Router();

// get user details by token
router.get("/", auth, async (req, res) => {
  try {
    let user = await User.findById(req.payload._id);
    if (!user) return res.status(400).send("Wrong details");

    res.status(200).send(_.pick(user, ["name", "email", "biz"]));
  } catch (error) {
    res.status(400).send("Error in profile");
  }
});

module.exports = router;
