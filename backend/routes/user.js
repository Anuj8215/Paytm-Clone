const express = require("express");
const jwt = require("jsonwebtoken");
const z = require("zod");
const { User,Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authmiddleware } = require("../middleware/auth");

const router = express.Router();

//!SECTION - ZOD SCHEMA

const signupSchema = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(6),
});

const signinSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

//!SECTION - SIGNUP

router.post("/signup", async (req, res) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { firstName, lastName, username, password } = validatedData;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const newUser = new User({ firstName, lastName, username, password });
    await newUser.save();

    //NOTE - Giving initial balance to the user
    const initialBalance = Math.floor(Math.random() * 1000) + 1;
    await Account.create({ userId: newUser._id, balance: initialBalance });

    //NOTE - Create JWT
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "3600min",
    });

    return res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    console.error("Error occurred during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//!SECTION - SIGNIN

router.post("/signin", async (req, res) => {
  try {
    const validatedData = signinSchema.parse(req.body);
    const { username, password } = validatedData;

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "3600min",
    });

    res.json({
      message: "Signin successful",
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    console.error("Error occurred during signin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//!SECTION - UPDATE USER WITH ZOD AND AUTH MIDDLEWARE

router.put("/update", authmiddleware, async (req, res) => {
  try {
    const updateSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      password: z.string().min(6).optional(),
    });

    const parsedData = updateSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    await User.updateOne({ _id: req.userId }, parsedData.data);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//SECTION - BULK FIND

router.get("/bulk", async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    });

    res.status(200).json({
      users: users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
