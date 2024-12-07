import mysql from "mysql2/promise";
import config from "../../config/config.js";

let pool;

const devConfig = {
  host: config.MYSQL_HOST,
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
};

const prodConfig = {
  host: "viaduct.proxy.rlwy.net",
  user: "root",
  password: "LluaADqlAXpEiOCFbjwSYUigajcvhNin",
  database: "railway",
  port: 54933,
  uri: "mysql://root:LluaADqlAXpEiOCFbjwSYUigajcvhNin@mysql.railway.internal:3306/railway",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};
const initializePool = () => {
  pool = mysql.createPool(
    config.NODE_ENV == "development" ? devConfig : prodConfig
  );


  if (config.NODE_ENV === "development") {
    pool.on("acquire", () => {
      console.log("Connection acquired");
    });

    pool.on("connection", () => {
      console.log(`Connected to ${config.MYSQL_DATABASE}`);
    });

    pool.on("release", () => {
      console.log("Connection released");
    });

    pool.on("enqueue", () => {
      console.log("Waiting for available connection slot");
    });
  }

  pool.on("error", handlePoolError);
};

const handlePoolError = (err) => {
  console.error("MySQL pool error: ", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
    console.error("Reinitializing MySQL connection pool");
    initializePool();
  } else {
    throw err;
  }
};

// Initialize the pool at the start
initializePool();

// Graceful shutdown
const gracefulShutdown = () => {
  pool.end((err) => {
    if (err) console.error("Error closing pool: ", err);
    else console.log("Pool closed");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default pool;
