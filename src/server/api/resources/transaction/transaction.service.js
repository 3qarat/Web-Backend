import pool from "../../database/index.js";
import AppError from "../../../utils/appError.js";

export const createTransaction = async ({
  tx_type,
  price,
  payment_method,
  apartment_id,
  user_id,
}) => {
  if (
    !tx_type ||
    price === undefined ||
    !payment_method ||
    !apartment_id ||
    !user_id
  ) {
    throw new AppError("missing required transaction details.", 400);
  }

  let sql;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // check if tenant exists
    sql = "select 1 from user where id = ? and is_active = 1";
    const [tenants] = await connection.query(sql, [user_id]);
    if (tenants.length === 0) {
      throw new AppError("tenant not found", 404);
    }

    //check if apartment exists
    sql = "select 1 from apartment where id = ?";
    const [apartments] = await connection.query(sql, [apartment_id]);
    if (apartments.length === 0) {
      throw new AppError("apartment not found", 404);
    }

    // record tx
    sql = `
    insert into transactions(tx_type, price, payment_method, apartment_id, user_id)
    values (?, ?, ?, ?, ?)
  `;
    const [result] = await pool.query(sql, [
      tx_type,
      price,
      payment_method,
      apartment_id,
      user_id,
    ]);

    await connection.commit();
    return result.insertId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
