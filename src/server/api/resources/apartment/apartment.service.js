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
  if (
    !location ||
    !size ||
    !num_bedrooms ||
    !num_bathrooms ||
    !amenities ||
    !price ||
    !status ||
    !rate ||
    !photos
  ) {
    throw new AppError("please provide all required fields", 400);
  }
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

export const getAllApartmentsBasedOnFilters = async ({
  location,
  minSize,
  maxSize,
  minBedrooms,
  maxBedrooms,
  minBathrooms,
  maxBathrooms,
  minPrice,
  maxPrice,
  status,
  minRate,
  maxRate,
}) => {
  let sql = `
    select a.id, a.location, a.size, a.num_bedrooms, a.num_bathrooms, a.amenities, a.price, a.status, a.rate, p.photos
    from apartment as a
    left join apartment_Photos as p
    on a.id = p.apartment_id
    where 1 = 1`;
  let params = [];
  let apartments = [];

  if (location) {
    sql += " and location = ? ";
    params.push(location);
  }
  if (minSize) {
    sql += " and size >= ? ";
    params.push(minSize);
  }
  if (maxSize) {
    sql += " and size <= ? ";
    params.push(maxSize);
  }
  if (minBedrooms) {
    sql += " and num_bedrooms >= ? ";
    params.push(minBedrooms);
  }
  if (maxBedrooms) {
    sql += " and num_bedrooms <= ? ";
    params.push(maxBedrooms);
  }
  if (minBathrooms) {
    sql += " and num_bathrooms >= ? ";
    params.push(minBathrooms);
  }
  if (maxBathrooms) {
    sql += " and num_bathrooms <= ? ";
    params.push(maxBathrooms);
  }
  if (minPrice) {
    sql += " and price >= ? ";
    params.push(minPrice);
  }
  if (maxPrice) {
    sql += " and price <= ? ";
    params.push(maxPrice);
  }
  if (status) {
    sql += " and status = ? ";
    params.push(status);
  }
  if (minRate) {
    sql += " and rate >= ? ";
    params.push(minRate);
  }
  if (maxRate) {
    sql += " and rate <= ? ";
    params.push(maxRate);
  }

  const [rows] = await pool.query(sql, params);
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

export const getAllUserApartments = async (user_id) => {
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

  if(rows.length === 0) {
    throw new AppError(`apartment not found with Id ${apartment_id}` , 400)
  }

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

export const updateApartmentById = async (
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

export const deleteApartmentById = async (apartment_id) => {
  const sql = `
    delete
    from apartment
    where id = ?
  `;
  await pool.query(sql, [apartment_id]);
};

export const dynamicUpdateApartmentById = async (
  {
    location,
    size,
    num_bedrooms,
    num_bathrooms,
    amenities,
    price,
    status,
    rate,
  },
  apartment_id
) => {
  let updates = [];
  let params = [];

  if (location) {
    updates.push("location = ?");
    params.push(location);
  }
  if (size) {
    updates.push("size = ?");
    params.push(size);
  }
  if (num_bedrooms) {
    updates.push("num_bedrooms = ?");
    params.push(num_bedrooms);
  }
  if (num_bathrooms) {
    updates.push("num_bathrooms = ?");
    params.push(num_bathrooms);
  }
  if (amenities) {
    updates.push("amenities = ?");
    params.push(amenities);
  }
  if (price) {
    updates.push("price = ?");
    params.push(price);
  }
  if (status) {
    updates.push("status = ?");
    params.push(status);
  }
  if (rate) {
    updates.push("rate = ?");
    params.push(rate);
  }

  if (updates.length === 0) {
    throw new AppError("no valid fields provided for update.");
  }

  //*
  params.push(apartment_id);

  const sql = `update apartment set ${updates.join(", ")} where id = ?`;

  const [result] = await pool.query(sql, params);

  if (result.affectedRows === 0) {
    throw new AppError(`no apartment found with ID ${apartment_id}`, 400);
  }

  return result.affectedRows;
};
