const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const profile = require("./routes/profile");
const card = require("./routes/card");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/profile", profile);
app.use("/api/card", card);

mongoose
  .connect(process.env.dbString, { useNewUrlParser: true })
  .then(() => console.log("Mongo connected successfuly"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log("Server atarted on port ", PORT));
