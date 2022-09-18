const express = require("express");
const joi = require("joi");
const _ = require("lodash");
const auth = require("../midlewares/auth");
const Card = require("../models/Card");
const router = express.Router();

const cardSchema = joi.object({
  name: joi.string().required().min(2),
  description: joi.string().required().min(2),
  address: joi.string().required().min(2),
  phone: joi.string().required().min(9).max(10),
  image: joi.string().required().min(2),
});

// create card
router.post("/", auth, async (req, res) => {
  try {
    // joi validation
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // add new card
    let card = new Card(req.body);

    // create random biz number and check if the number is used already
    let bizFlag = true;

    while (bizFlag) {
      let randomBizNumber = _.random(1, 999);
      let checkCard = await Card.findOne({ bizNumber: randomBizNumber });
      if (!checkCard) bizFlag = false;
      card.bizNumber = randomBizNumber;
      card.userId = req.payload._id;
    }

    //save card
    await card.save();
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send("Error in creating card");
  }
});

// get all cards
router.get("/all", auth, async (req, res) => {
  try {
    let cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {
    res.status(400).send("Error in geting cards" + error);
  }
});

// get all cards for user by userId
router.get("/mycards", auth, async (req, res) => {
  try {
    let cards = await Card.find({ userId: req.payload._id });
    res.status(200).send(cards);
  } catch (error) {
    res.status(400).send("Error in card" + error);
  }
});

// get card by card id
router.get("/:id", auth, async (req, res) => {
  try {
    let card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("No cards found");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("Error in card" + error);
  }
});

// update card by card id
router.put("/:id", auth, async (req, res) => {
  try {
    // joi validation
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // update card
    let card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!card) return res.status(400).send("No cards found");

    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("Error in updating card" + error);
  }
});

// delete card by card id
router.delete("/:id", auth, async (req, res) => {
  try {
    let card = await Card.findByIdAndRemove(req.params.id);
    if (!card) return res.status(400).send("No cards found");
    res.status(200).send("Card removed successfuly");
  } catch (error) {
    res.status(400).send("Error in deleting card" + error);
  }
});

module.exports = router;
