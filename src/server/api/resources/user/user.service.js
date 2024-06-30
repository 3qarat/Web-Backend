import pool from "../../database/index.js";

export const getAllPartners = async () => {
  const sql = `
        select u.id, u.username, u.profile_picture, count(a.id) as apartments
        from user as u
        inner join apartment as a
        on u.id = a.user_id
        group by u.id, u.username, u.profile_picture
    `;

  const [rows] = await pool.query(sql);

  return rows;
};

export const getAllPartnerApartments = async (user_id) => {
  let apartments = {};

  const sql = `
      select u.id as user_id, u.username, u.profile_picture, a.id as apartment_id, a.type, a.title, a.description, a.price, a.bedrooms, a.bathrooms, a.area, a.note, a.built_year, a.garages, a.latitude, a.longitude, a.amenities,a.education, a.health, a.transportation , floor, vr_link, a.status, a.rate, p.photos, view_count
      from apartment as a
      inner join user as u
      on a.user_id = u.id
      left join apartment_Photos as p
      on a.id = p.apartment_id
      where a.user_id = ?
    `;
  const [rows] = await pool.query(sql, [user_id]);

  rows.forEach((row) => {
    if (!apartments[row.apartment_id]) {
      apartments[row.apartment_id] = {
        ...row,
        photos: [],
      };
    }

    if (row.photos) {
      apartments[row.apartment_id ].photos.push(row.photos);
    }
  });

  const apartmentsArr = Object.values(apartments);
  return apartmentsArr;
};