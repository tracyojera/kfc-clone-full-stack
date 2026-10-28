const { Router } = require("express");
const userDetails = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userAuthRouter = Router();

// SIGNUP
userAuthRouter.post("/signup", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password || !req.body.firstname || !req.body.lastname) {
      return res.status(400).json({
        status: "ERROR",
        message: "Please fill in all required fields",
      });
    }

    const existingUser = await userDetails.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "ERROR",
        message: "Email already exists",
      });
    }

    const newPassword = await bcrypt.hash(password, 10);
    await userDetails.create({
      firstname: String(req.body.firstname).trim(),
      lastname: String(req.body.lastname).trim(),
      email,
      password: newPassword,
      token: "",
    });

    return res.status(201).json({ status: "OK", message: "Account created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "ERROR", message: "Unable to create account" });
  }
});

// LOGIN
userAuthRouter.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await userDetails.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: "ERROR", message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: "ERROR", message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    await userDetails.findOneAndUpdate({ email }, { token });

    return res.json({ status: "OK", user: token, message: "Login successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "ERROR", message: "Unable to login" });
  }
});

// LOGOUT
userAuthRouter.post("/logout", async (req, res) => {
  try {
    const { token } = req.headers;
    const user = await userDetails.findOne({ token: token });
    console.log('user:', user)
    if (user) {
      user.token = "";
      await user.save();
      res.status(200).json({ message: "logout successfully" });
    } else {
      res.status(400).json({ error: "invalid token" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = userAuthRouter;
