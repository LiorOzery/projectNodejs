const express = require("express");
const joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const registerSchema = joi.object({
  name: joi.string().required().min(2),
  email: joi.string().required().email().min(6),
  password: joi.string().required().min(8),
  biz: joi.boolean().required(),
});

router.post("/", async (req, res) => {
  try {
    // joi validation
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // user already exist
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User alreadt exist");

    // add new user
    user = new User(req.body);

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // create token
    const genToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.secretKey
    );

    await user.save();

    res.status(201).send({ token: genToken });
  } catch (error) {
    res.status(400).send("Error in register" + error);
  }
});

module.exports = router;
