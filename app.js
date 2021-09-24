const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
let ejs = require("ejs");
const Razorpay = require("razorpay");
var fs = require("fs");

var easyinvoice = require("easyinvoice");

var data = {
  //"documentTitle": "RECEIPT", //Defaults to INVOICE
  //"locale": "de-DE", //Defaults to en-US, used for number formatting (see docs)
  currency: "USD", //See documentation 'Locales and Currency' for more info
  taxNotation: "vat", //or gst
  marginTop: 25,
  marginRight: 25,
  marginLeft: 25,
  marginBottom: 25,
  logo: "https://public.easyinvoice.cloud/img/logo_en_original.png", //or base64
  background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg", //or base64 //img or pdf
  sender: {
    company: "Sample Corp",
    address: "Sample Street 123",
    zip: "1234 AB",
    city: "Sampletown",
    country: "Samplecountry",
    //"custom1": "custom value 1",
    //"custom2": "custom value 2",
    //"custom3": "custom value 3"
  },
  client: {
    company: "Client Corp",
    address: "Clientstreet 456",
    zip: "4567 CD",
    city: "Clientcity",
    country: "Clientcountry",
    //"custom1": "custom value 1",
    //"custom2": "custom value 2",
    //"custom3": "custom value 3"
  },
  invoiceNumber: "2021.0001",
  invoiceDate: "1.1.2021",
  products: [
    {
      quantity: "2",
      description: "Test1",
      tax: 6,
      price: 33.87,
    },
    {
      quantity: "4",
      description: "Test2",
      tax: 21,
      price: 10.45,
    },
  ],
  bottomNotice: "Kindly pay your invoice within 15 days.",
  //Used for translating the headers to your preferred language
  //Defaults to English. Below example is translated to Dutch
  // "translate": {
  //     "invoiceNumber": "Factuurnummer",
  //     "invoiceDate": "Factuurdatum",
  //     "products": "Producten",
  //     "quantity": "Aantal",
  //     "price": "Prijs",
  //     "subtotal": "Subtotaal",
  //     "total": "Totaal"
  // }
};

//Create your invoice! Easy!
easyinvoice.createInvoice(data, async function (result) {
  //The response will contain a base64 encoded PDF file
  console.log(result.pdf);
  await fs.writeFileSync("invoice.pdf", result.pdf, "base64");
});

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

app.get("/success", (req, res) => {
  res.render("success");
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
