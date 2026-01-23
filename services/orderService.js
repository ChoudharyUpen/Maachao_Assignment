const db = require("../config/db");
const ProductRepository = require("../repositories/ProductRepository");
const OrderRepository = require("../repositories/OrderRepository");
const Product = require("../models/Product");
const Order = require("../models/Order")

const createOrder = async (productId, quantity) => {
  if (quantity <= 0) throw new Error("Quantity must be greater than zero");

  const connection = await db.getConnection();

  try {
   
    await connection.beginTransaction();


    // 1. Validate product
    const productRow = await ProductRepository.findByIdForUpdate(productId, connection);
   
    const product = new Product(productRow);

    if (!product) throw new Error("Product not found");

    // 2. Validate stock
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock. Only ${product.stock} unit(s) available. Please enter a lower quantity.`);
    }

    // 3. Deduct stock
    const updatedStock = product.stock - quantity;
    await ProductRepository.updateStock(productId, updatedStock, connection);

    // 4. Create order
    const orderId = await OrderRepository.createOrder(productId, quantity, connection);

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
