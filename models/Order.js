class Order {
  constructor({ id, productId, quantity, status, createdAt }) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.status = status;
    this.createdAt = createdAt;
  }
}

module.exports = Order;

