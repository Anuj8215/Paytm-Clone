const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const express = require("express");
const { User } = require("../db");
const router = express.Router();

//SECTION - SIGNUP

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      const newUser = new User({ firstName, lastName, username, password });
      await newUser.save();
      return res.status(201).json({
        message: "User created successfully",
      });
    } else {
      res.status(409).json({
        message: "Username already exists",
      });
    }
  } catch (error) {
    console.error("Error occurred during signup:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

//SECTION - Sign IN
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }
    //NOTE -  - CREATING JWT

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "30min",
    });
    res.json({
      message: "Signin successful",
      token,
    });
  } catch (error) {
    console.error("Error occurred during signin:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Export the router
module.exports = router;
