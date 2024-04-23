import mysql from "mysql2/promise";
import config from "../../config/config.js";

console.log(config.MYSQL_USER,  config.MYSQL_PASSWORD,config.MYSQL_DATABASE );
const pool = mysql.createPool({
  host: "mysql",
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

pool.on("connection", () =>
  console.log(`connected to ${config.MYSQL_DATABASE}`)
);
pool.on("release", () => console.log("connection is released"));

export default pool;
