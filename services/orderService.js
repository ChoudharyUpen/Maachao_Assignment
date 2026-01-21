const db = require("../config/db");
const Product = require("../models/Product");
const Order = require("../models/Order");

const createOrder = async (productId, quantity) => {
  if (quantity <= 0) throw new Error("Quantity must be greater than zero");

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Validate product
    const product = await Product.findByIdForUpdate(productId, connection);
    if (!product) throw new Error("Product not found");

    // 2. Validate stock
    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    // 3. Deduct stock
    const updatedStock = product.stock - quantity;
    await Product.updateStock(productId, updatedStock, connection);

    // 4. Create order
    const orderId = await Order.createOrder(productId, quantity, connection);

    await connection.commit();
    return { orderId, productId, quantity };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { createOrder };
