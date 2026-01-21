const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "7248119519",
  database: "vkdb",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
