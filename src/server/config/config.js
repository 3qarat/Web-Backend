import "dotenv/config";

const {
  NODE_ENV,
  PORT,
  MYSQL_ROOT_PASSWORD,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

export default {
  NODE_ENV,
  PORT,
  MYSQL_ROOT_PASSWORD,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
};
