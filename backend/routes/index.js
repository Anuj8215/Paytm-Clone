const express = require('express');
const userRouter = require("./user");
const accountRouter = require("./account");
const router = express.Router();
 
// All user related routes
router.use("/user", userRouter);

// All account related routes
router.use("/account", accountRouter);

module.exports = router;
