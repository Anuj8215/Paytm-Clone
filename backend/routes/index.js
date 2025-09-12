const express = require('express');
const userRouter = require("./user");
const router = express.Router();
 
// All user related routes

router.use("/user", userRouter);

module.exports = router;
