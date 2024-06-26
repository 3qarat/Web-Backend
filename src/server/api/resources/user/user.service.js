import AppError from "../../../utils/appError.js";
import pool from "../../database/index.js";
import bcrypt from "bcryptjs";

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
