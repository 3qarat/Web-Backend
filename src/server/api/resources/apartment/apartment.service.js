import pool from "../../database/index.js";
import AppError from "../../../utils/appError.js";

export const createApartment = async (
  {
    location,
    size,
    num_bedrooms,
    num_bathrooms,
    amenities,
    price,
    status,
    rate,
    photos,
  },
  user_id
) => {
  const connection = await pool.getConnection();
  let sql;

  try {
    await connection.beginTransaction();

    sql = `
        insert into apartment(location, size, num_bedrooms, num_bathrooms, amenities, price, status, rate, user_id)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [rows] = await connection.query(sql, [
      location,
      size,
      num_bedrooms,
      num_bathrooms,
      amenities,
      price,
      status,
      rate,
      user_id,
    ]);

    sql = `
        insert into apartment_Photos (apartment_id, photos)
        values (?, ?)
    `;
    const apartmentPhotosPromises = photos.map((photo) =>
      connection.query(sql, [rows.insertId, photo])
    );
    await Promise.all(apartmentPhotosPromises);

    await connection.commit();
    return rows.insertId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const getAllApartments = async (user_id) => {
  let apartments = {};

  const sql = `
      select a.id, a.location, a.size, a.num_bedrooms, a.num_bathrooms, a.amenities, a.price, a.status, a.rate, p.photos
      from apartment as a
      left join apartment_Photos as p
      on a.id = p.apartment_id
      where a.user_id = ?
    `;
  const [rows] = await pool.query(sql, [user_id]);

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

  const apartmentsArr = Object.values(apartments);
  return apartmentsArr;
};

export const getApartmentById = async (apartment_id) => {
  let apartment = {};
  const sql = `
    select a.id, a.location, a.size, a.num_bedrooms, a.num_bathrooms, a.amenities, a.price, a.status, a.rate, p.photos 
    from apartment as a
    left join apartment_Photos as p
    on a.id = p.apartment_id
    where a.id = ?
  `;
  const [rows] = await pool.query(sql, [apartment_id]);

  rows.forEach((row) => {
    if (!apartment[row.id]) {
      apartment[row.id] = {
        ...row,
        photos: [],
      };
    }

    if (row.photos) {
      apartment[row.id].photos.push(row.photos);
    }
  });

  const apartmentArr = Object.values(apartment);
  return apartmentArr;
};

export const updateApartment = async (
  {
    location,
    size,
    num_bedrooms,
    num_bathrooms,
    amenities,
    price,
    status,
    rate,
    photos,
  },
  apartment_id
) => {
  const connection = await pool.getConnection();
  let sql;
  try {
    await connection.beginTransaction();

    sql = `
      update apartment
      set 
        location = ?,
        size = ?,
        num_bedrooms = ?,
        num_bathrooms = ?, 
        amenities = ?,
        price = ?,
        status = ?,
        rate = ?
      where id = ?
    `;

    const [result] = await connection.query(sql, [
      location,
      size,
      num_bedrooms,
      num_bathrooms,
      amenities,
      price,
      status,
      rate,
      apartment_id,
    ]);

    if (result.affectedRows === 0) {
      throw new AppError(`no apartment found with ID ${apartment_id}`, 400);
    }

    if (photos?.length > 0) {
      await connection.query(
        "delete from apartment_Photos where apartment_id = ? ",
        [apartment_id]
      );

      sql = `
        insert into apartment_Photos(apartment_id, photos)
        values(?, ?)
      `;
      const apartmentPhotosPromises = photos.map((photo) =>
        connection.query(sql, [apartment_id, photo])
      );

      await Promise.all(apartmentPhotosPromises);
    }

    await connection.commit();
    return result.affectedRows;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const deleteApartment = () => {};
