const express = require("express");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const loginSchema = joi.object({
  email: joi.string().required().email().min(6),
  password: joi.string().required().min(8),
});

router.post("/", async (req, res) => {
  try {
    // joi validation
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // check email
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Wrong Email or Password");

    // compare password
    const compareResult = bcrypt.compare(req.body.password, user.password);
    if (!compareResult) return res.status(400).send("Wrong Email or Password");

    // create token
    const genToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.secretKey
    );

    res.status(200).send({ token: genToken });
  } catch (error) {
    res.status(400).send("Error in login" + error);
  }
});

module.exports = router;
