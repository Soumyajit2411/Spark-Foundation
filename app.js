const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
let ejs = require("ejs");
const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "rzp_test_h60mCWCH1om22f",
  key_secret: "KfVU4VOud16dNm9UvsKs8mb9",
});

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

app.get("/donation", (req, res) => {
  res.render("donation");
});

app.post("/order", (req, res) => {
  var options = {
    amount: 50000,
    currency: "INR",
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
    res.json(order);
  });
});

app.post("/js-order-complete", (req, res) => {
  instance.payments.fetch(req.body.razorpay_payment_id).then((docs) => {
    if (docs.status == "captured") {
      res.send("Payment successful");
    } else {
      res.redirect("/");
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
