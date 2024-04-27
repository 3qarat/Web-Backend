import AppError from "../../../utils/appError.js";
import pool from "../../database/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  role,
  profile_picture = null,
  mobile_num,
}) => {
  if (!username || !email || !password || !role || !mobile_num) {
    throw new AppError(
      "please provide all required fields (username, email, password and role, mobile_num)",
      400
    );
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let sql = `insert into user(username, email, password, role ,profile_picture) values (?, ?, ?, ?, ?)`;
    const [result] = await connection.query(sql, [
      username,
      email,
      await hashPassword(password),
      role,
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

export const login = async ({ username, password }) => {
  if (!username || !password) {
    throw new AppError("provide your username and password", 400);
  }
  let sql = "select id, password from user where username = ?";
  const [rows] = await pool.query(sql, [username]);

  if (
    rows.length === 0 ||
    !(await verifyPassword(password, rows[0].password))
  ) {
    throw new AppError("incorrect email or password");
  }

  const token = jwt.sign({ id: rows[0].id }, "jwt-secret-string", {
    expiresIn: "1h",
  });
  return token;
};
