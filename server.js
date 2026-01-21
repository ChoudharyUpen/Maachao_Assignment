const express = require("express");
const app = express();

app.use(express.json());

const orderRoutes = require("./routes/route");
app.use("/order", orderRoutes);

module.exports = app;
