const express = require("express");
const router = express.Router();

const { postOrder } = require("../controller/ordercontroller");

router.post("/", postOrder);

module.exports = router;
