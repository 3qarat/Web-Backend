import pool from "../../database/index.js";

export const addToFavorites = async (userId, apartmentId) => {
  const sql = `
        insert into user_favorites (user_id, apartment_id)
        values (?, ?)
    `;
  const [result] = await pool.query(sql, [userId, apartmentId]);

  if (result.affectedRows > 0) {
    return `apartment with id ${apartmentId} added to favorites`;
  } else {
    return "apartment not found";
  }
};

export const removeFromFavorites = async (userId, apartmentId) => {
  const sql = `
        delete from user_favorites
        where user_id = ? and apartment_id = ?
    `;
  await pool.query(sql, [userId, apartmentId]);
};

export const getUserFavorites = async (userId) => {
  const sql = `
        select a.* , p.photos
        from apartment as a
        inner join user_favorites as  u
        on u.apartment_id = a.id
        left join apartment_Photos as p
        on a.id = p.apartment_id
    `;
  const [rows] = await pool.query(sql, [userId]);

  let apartments = {};
  rows.forEach((row) => {
    if (!apartments[row.id]) {
      apartments[row.id] = {
        ...row,
        photos: [],
      };
    }

    if (row.photos) {
      apartments[row.id].photos.push(row.photos);
    }
  });
  return apartments;
};
