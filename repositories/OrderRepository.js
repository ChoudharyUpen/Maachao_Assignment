const createOrder = async (productId, quantity, connection) => {
  const [result] = await connection.execute(
    "INSERT INTO orders (productId, quantity) VALUES (?, ?)",
    [productId, quantity]
  );
  return result.insertId;
};

const getOrderById = async (orderId, connection) => {
  const [rows] = await connection.execute(
    "SELECT * FROM orders WHERE id = ?",
    [orderId]
  );
  return rows[0];
};

const getAllOrders = async (connection) => {
  const [rows] = await connection.execute("SELECT * FROM orders");
  return rows;
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
};