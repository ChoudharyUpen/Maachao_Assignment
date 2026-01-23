const { createOrder } = require("../services/orderService");

const postOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity required" });
    }
    console.log("productId, quantity: ",productId, quantity)
    const order = await createOrder(productId, quantity);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { postOrder };
