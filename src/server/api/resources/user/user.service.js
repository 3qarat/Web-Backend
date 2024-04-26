import AppError from "../../../utils/appError.js";
import pool from "../../database/index.js";
import bcrypt from "bcryptjs";

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const signup = async ({
  username,
  email,
  password,
  role,
  profile_picture = null,
}) => {
  if (!username || !email || !password || !role) {
    throw new AppError(
      "please provide all required fields (username, email, password and role)",
      400
    );
  }

  const sql = `insert into user(username, email, password, role ,profile_picture) values (?, ?, ?, ?, ?)`;

  const result = await pool.query(sql, [
    username,
    email,
    await hashPassword(password),
    role,
    profile_picture,
  ]);

  console.log(result);
  return result;
};
