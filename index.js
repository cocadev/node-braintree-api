const dotenv = require("dotenv");
const braintree = require("braintree");
const express = require("express");
const bodyParser = require('body-parser')

dotenv.config();

const app = express();

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '8pch5jjbn3yrm95s',
  publicKey: '9qwm25677pb4czgz',
  privateKey: '4d1f133c1c2f183237c51a8a187f5b6a',
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
