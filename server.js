const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const orderRoutes = require("./routes/route");
app.use("/order", orderRoutes);
app.use((req, res) => {
  res.status(404).send("Route not found");
});
module.exports = app;
