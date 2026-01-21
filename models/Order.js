const db = require("../config/db");

const createOrder = async (productId, quantity, connection) => {
  const [result] = await connection.execute(
    "INSERT INTO orders (productId, quantity) VALUES (?, ?)",
    [productId, quantity]
  );
  return result.insertId;
};

module.exports = { createOrder };
