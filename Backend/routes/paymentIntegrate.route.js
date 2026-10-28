const { Router } = require("express");
const crypto = require("crypto");

const paymentRouter = Router();

// Create Demo Payment
paymentRouter.post("/pay", async (req, res) => {
  try {
    const { amount } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid payment amount",
      });
    }

    // Generate a demo payment ID
    const paymentId =
      "KFC-" + crypto.randomBytes(6).toString("hex").toUpperCase();

    return res.status(200).json({
      status: "OK",
      message: "Payment successful",
      paymentId,
      amount: numericAmount,
      currency: "UGX",
    });
  } catch (error) {
    console.log("Payment error:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Payment failed",
    });
  }
});

module.exports = paymentRouter;