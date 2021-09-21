const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
let ejs = require("ejs");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
