import AppError from "../../../utils/appError.js";
import pool from "../../database/index.js";
import bcrypt from "bcryptjs";
import moment from "moment";
import { v4 as uuidv4, v4 } from "uuid";

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const signup = async ({
  username,
  email,
  password,
  profile_picture = null,
  mobile_num,
}) => {
  if (!username || !email || !password || !mobile_num) {
    throw new AppError(
      "please provide all required fields (username, email, password and mobile_num)",
      400
    );
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let sql = `insert into user(username, email, password ,profile_picture) values (?, ?, ?, ?)`;
    const [result] = await connection.query(sql, [
      username,
      email,
      await hashPassword(password),
      profile_picture,
    ]);

    const contactPromises = mobile_num.map((num) =>
      connection.query(
        "insert into contact(user_id, mobile_num) values (?, ?)",
        [result.insertId, num]
      )
    );

    await Promise.all(contactPromises);

    await connection.commit();

    return result.insertId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
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

export const generateResetToken = async (email) => {
  //get user from db
  const [rows] = await pool.query("select id from user where email = ?", [
    email,
  ]);
  const user = rows[0];
  if (!user) {
    next(new AppError("user not found", 400));
  }

  //generate token
  const token = v4();
  const expiresAt = moment().add(1, "hour").format("YYYY-MM-DD HH:mm:ss");

  //store token in db
  await pool.query(
    "insert into password_reset_tokens(user_id, token, expires_at) values(?,?,?)",
    [user.id, token, expiresAt]
  );

  //send via email
};

export const resetPassword = async (token, newPassword) => {
  // get token from db
  const [rows] = await pool.query(
    "select * from password_reset_tokens where token = ?",
    [token]
  );
  const resetToken = rows[0];
  if (!resetPassword) {
    next(new AppError("Token not found or expired", 404));
  }

  // check expiration date
  const now = moment();
  const expiresAt = moment(resetToken.expires_at);
  if (now.isAfter(expiresAt)) {
    await pool.query("delete from password_reset_tokens where id = ?", [
      resetToken.id,
    ]);
    next(new AppError("Token expired", 400));
  }

  //update password
  const password = await hashPassword(newPassword);
  await pool.query("update user set password = ? where id = ?", [
    password,
    resetToken.user_id,
  ]);

  //delete token from db
  await pool.query("delete from password_reset_tokens where id = ?", [
    resetToken.id,
  ]);
};
