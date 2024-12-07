import pool from "../../database/index.js";
import AppError from "../../../utils/appError.js";

export const createFeedback = async (userId, apartmentId, comment, rating) => {
  if (!comment || !rating || !apartmentId) {
    throw new AppError(
      "please provide your comment, rating and valid apartment id"
    );
  }

  const sql = `
    insert into feedback (comment, rating, user_id, apartment_id)
    values (?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [
    comment,
    rating,
    userId,
    apartmentId,
  ]);

  if (result.affectedRows == 0) {
    throw new AppError("failed to add feedback", 400);
  }
};

export const deleteFeedback = async (feedbackId) => {
  const sql = `
        delete from feedback
        where id = ?
    `;

  const [result] = await pool.query(sql, [feedbackId]);

  if (result.affectedRows == 0) {
    throw new AppError("failed to delete", 400);
  }
};

export const updateFeedback = async (comment, rating, feedbackId) => {
  const updates = [];
  const params = [];

  if (comment) {
    updates.push("comment = ?");
    params.push(comment);
  }
  if (rating) {
    updates.push("rating = ?");
    params.push(rating);
  }
  if (updates.length === 0) {
    throw new AppError("no valid fields provided for update.");
  }

  params.push(feedbackId);

  const sql = `update feedback set ${updates.join(", ")} where id = ?`;
  const [result] = await pool.query(sql, params);

  if (result.affectedRows === 0) {
    throw new AppError("failed to update feedback", 400);
  }
};

export const getApartmentFeedback = async (apartmentId) => {
  if (!apartmentId) {
    throw new AppError("please provide valid apartment id", 400);
  }

  const sql = `
    select id,  comment, rating, feedback_date, apartment_id 
    from feedback
    where apartment_id = ?
  `;

  const [rows] = await pool.query(sql, [apartmentId]);

  if (rows.length === 0) {
    throw new AppError("no feedbacks found", 404);
  }

  return rows;
};
