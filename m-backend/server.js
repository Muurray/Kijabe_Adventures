const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const moment = require("moment");

app.post("/stkpush", async (req, res) => {
  const phone = req.body.phone;
  const amount = req.body.amount;

  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(
    process.env.SHORTCODE + process.env.PASSKEY + timestamp
  ).toString("base64");

  try {
    // Get access token
    const auth = Buffer.from(
      process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET
    ).toString("base64");

    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // STK Push request
    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: "https://yourdomain.com/callback",
        AccountReference: "Booking",
        TransactionDesc: "Booking Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(stkResponse.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Payment failed");
  }
});
