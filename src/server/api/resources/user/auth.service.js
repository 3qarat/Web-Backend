import AppError from "../../../utils/appError.js";
import pool from "../../database/index.js";
import bcrypt from "bcryptjs";
import moment from "moment";
import { v4 as uuidv4, v4 } from "uuid";
import useragent from "useragent";

const generateFourDigitRandomNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const signup = async (
  { username, email, password, mobile_num },
  uploaded_image
) => {
  if (!username || !email || !password || !mobile_num) {
    throw new AppError(
      "please provide all required fields (username, email, password and mobile_num)",
      400
    );
  }

  // Extract uploaded image path
  const domain =
    config.NODE_ENV === "development"
      ? "http://localhost:8181/"
      : "https://web-backend-production-8f43.up.railway.app/";
  const profile_picture = uploaded_image
    ? `${domain}/uploads/${uploaded_image.filename}`
    : null;

  let sql = `insert into user(username, email, password, mobile_num ,profile_picture) values (?, ?, ?, ?, ?)`;
  const [result] = await pool.query(sql, [
    username,
    email,
    await hashPassword(password),
    mobile_num,
    profile_picture,
  ]);

  return result.insertId;
};

export const updatePassword = async (id, newPassword) => {
  const password = await hashPassword(newPassword);
  const sql = "update user set password = ? where id = ?";
  const [result] = await pool.query(sql, [password, id]);

  if (result.affectedRows == 1) {
    return "password updated successfully";
  } else {
    return "failed to update password";
  }
};

export const generateResetToken = async (email, req) => {
  let token;
  //detect sender device type
  const agent = useragent.parse(req.headers["user-agent"]);

  //get user from db
  const [rows] = await pool.query("select id from user where email = ?", [
    email,
  ]);
  const user = rows[0];
  if (!user) {
    throw new AppError("user not found", 400);
  }

  //generate token
  console.log(agent);
  if (agent.family.startsWith("Mobile")) {
    token = generateFourDigitRandomNumber();
  } else {
    token = v4();
  }

  const expiresAt = moment().add(1, "hour").format("YYYY-MM-DD HH:mm:ss");

  //store token in db
  await pool.query(
    "insert into password_reset_token(user_id, token, expires_at) values(?,?,?)",
    [user.id, token, expiresAt]
  );

  //send via email
};

export const verifyToken = async (token) => {
  // get token from db
  const [rows] = await pool.query(
    "select * from password_reset_token where token = ?",
    [token]
  );
  const resetToken = rows[0];
  if (!resetToken) {
    throw new AppError("Token not found or expired", 404);
  }

  // check expiration date
  const now = moment();
  const expiresAt = moment(resetToken.expires_at);
  if (now.isAfter(expiresAt)) {
    await pool.query("delete from password_reset_token where id = ?", [
      resetToken.id,
    ]);
    throw new AppError("Token expired", 400);
  }
};

export const resetPassword = async (token, newPassword) => {
  // get token from db
  const [rows] = await pool.query(
    "select * from password_reset_token where token = ?",
    [token]
  );
  const resetToken = rows[0];
  if (!resetToken) {
    throw new AppError("Token not found or expired", 404);
  }

  // check expiration date
  const now = moment();
  const expiresAt = moment(resetToken.expires_at);
  if (now.isAfter(expiresAt)) {
    await pool.query("delete from password_reset_token where id = ?", [
      resetToken.id,
    ]);
    throw new AppError("Token expired", 400);
  }

  //update password
  const password = await hashPassword(newPassword);
  await pool.query("update user set password = ? where id = ?", [
    password,
    resetToken.user_id,
  ]);

  //delete token from db
  await pool.query("delete from password_reset_token where id = ?", [
    resetToken.id,
  ]);
};
