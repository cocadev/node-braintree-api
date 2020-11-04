const dotenv = require("dotenv");
const braintree = require("braintree");
const express = require("express");
const bodyParser = require('body-parser')

dotenv.config();

const app = express();

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/getClientToken", async (req, res, next) => {
  try {
    gateway.clientToken.generate({}, function(err, response) {
      if (err) {
        res.status(400).send({
          token: null,
        });
      }
      res.status(200).send({
        token: response.clientToken,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      token: null,
    });
  }
});

app.post("/checkouts", async (req, res, next) => {
  console.log('+++++ A ++++++', req.body);
  const { amount, paymentMethodNonce } = req.body;

  try {
    gateway.transaction.sale({
      amount,
      paymentMethodNonce,
      options: { submitForSettlement: true }
    }, function(err, response) {
      if (err) {
        res.status(400).send({
          result: null,
        });
      }
      res.status(200).send({
        result: response,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      result: null,
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
