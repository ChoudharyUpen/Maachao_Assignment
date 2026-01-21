const db = require("../config/db");

const findByIdForUpdate = async (productId, connection) => {
  const [rows] = await connection.execute(
    "SELECT * FROM product WHERE id = ? FOR UPDATE",
    [productId]
  );
  return rows[0];
};

const updateStock = async (productId, newStock, connection) => {
  await connection.execute(
    "UPDATE product SET stock = ? WHERE id = ?",
    [newStock, productId]
  );
};

module.exports = {
  findByIdForUpdate,
  updateStock,
};
