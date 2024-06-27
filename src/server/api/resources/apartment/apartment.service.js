import pool from "../../database/index.js";
import AppError from "../../../utils/appError.js";

export const createApartment = async (
  {
    type,
    title,
    description,
    price,
    bedrooms,
    bathrooms,
    area,
    note,
    built_year,
    garages,
    latitude,
    longitude,
    amenities,
    education,
    health,
    transportation,
    floor,
    vr_link,
    status,
    photos,
  },
  user_id
) => {
  if (
    !type ||
    !title ||
    !price ||
    !bedrooms ||
    !bathrooms ||
    !area ||
    !built_year ||
    !garages ||
    !status ||
    !photos
  ) {
    throw new AppError("please provide all required fields", 400);
  }
  const connection = await pool.getConnection();
  let sql;
  try {
    await connection.beginTransaction();

    sql = `
        insert into apartment(type, title, description, price, bedrooms, bathrooms, area, note, built_year, garages, latitude, longitude, amenities, education, health, transportation , floor, vr_link, status, user_id)
        values (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?)`;
    const [rows] = await connection.query(sql, [
      type,
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      area,
      note,
      built_year,
      garages,
      latitude,
      longitude,
      JSON.stringify(amenities),
      education,
      health,
      transportation,
      floor,
      vr_link,
      status,
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
  minArea,
  maxArea,
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
    select a.id, a.type, a.title, a.description, a.price, a.bedrooms, a.bathrooms, a.area, a.note, a.built_year, a.garages, a.latitude, a.longitude, a.amenities, a.education, a.health, a.transportation , a.floor, vr_link, a.status, a.rate, a.user_id, p.photos, view_count
    from apartment as a
    left join apartment_Photos as p
    on a.id = p.apartment_id
    where 1 = 1`;
  let params = [];
  let apartments = [];

  if (minArea) {
    sql += " and area >= ? ";
    params.push(minSize);
  }
  if (maxArea) {
    sql += " and area <= ? ";
    params.push(maxSize);
  }
  if (minBedrooms) {
    sql += " and bedrooms >= ? ";
    params.push(minBedrooms);
  }
  if (maxBedrooms) {
    sql += " and bedrooms <= ? ";
    params.push(maxBedrooms);
  }
  if (minBathrooms) {
    sql += " and bathrooms >= ? ";
    params.push(minBathrooms);
  }
  if (maxBathrooms) {
    sql += " and bathrooms <= ? ";
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

//not used yet
export const getAllUserApartments = async (user_id) => {
  let apartments = {};

  const sql = `
      select a.id, a.type, a.title, a.description, a.price, a.bedrooms, a.bathrooms, a.area, a.note, a.built_year, a.garages, a.latitude, a.longitude, a.amenities,a.education, a.health, a.transportation , floor, vr_link a.status, a.rate, a.user_id, p.photos, view_count
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
    select a.id, a.type, a.title, a.description, a.price, a.bedrooms, a.bathrooms, a.area, a.note, a.built_year, a.garages, a.latitude, a.longitude, a.amenities, a.education, a.health, a.transportation , a.floor, vr_link, a.status, a.rate, a.user_id, p.photos, view_count
    from apartment as a
    left join apartment_Photos as p
    on a.id = p.apartment_id
    where a.id = ?
  `;

  const connection = await pool.getConnection();
  try {
    connection.beginTransaction();
    await connection.query(
      "update apartment set view_count = view_count +1 where id = ?",
      [apartment_id]
    );
    const [rows] = await connection.query(sql, [apartment_id]);
    connection.commit();

    if (rows.length === 0) {
      throw new AppError(`apartment not found with Id ${apartment_id}`, 400);
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
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const updateApartmentById = async (
  {
    type,
    title,
    description,
    price,
    bedrooms,
    bathrooms,
    area,
    note,
    built_year,
    garages,
    latitude,
    longitude,
    amenities,
    education,
    health,
    transportation,
    floor,
    vr_link,
    status,
    photos,
  },
  apartment_id
) => {
  if (
    !type ||
    !title ||
    !price ||
    !bedrooms ||
    !bathrooms ||
    !area ||
    !built_year ||
    !garages ||
    !latitude ||
    !longitude ||
    !amenities ||
    !status ||
    !photos
  ) {
    throw new AppError("provide all required fields", 400);
  }
  const connection = await pool.getConnection();
  let sql;
  try {
    await connection.beginTransaction();

    sql = `
      update apartment
      set 
          type = ?,
          title = ?,
          description = ?,
          price = ?,
          bedrooms = ?,
          bathrooms = ?,
          area = ?,
          note = ?,
          built_year = ?,
          garages = ?,
          latitude = ?,
          longitude = ?,
          amenities = ?,
          education = ?, 
          health = ?, 
          transportation = ?,
          floor = ?,
          vr_link =? ,
          status = ?,
          photos = ?,
      where id = ?
    `;

    const [result] = await connection.query(sql, [
      type,
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      area,
      note,
      built_year,
      garages,
      latitude,
      longitude,
      amenities,
      education,
      health,
      transportation,
      floor,
      vr_link,
      status,
      photos,
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
    type,
    title,
    description,
    price,
    bedrooms,
    bathrooms,
    area,
    note,
    built_year,
    garages,
    latitude,
    longitude,
    amenities,
    education,
    health,
    transportation,
    floor,
    vr_link,
    status,
    rate,
  },
  apartment_id
) => {
  let updates = [];
  let params = [];

  if (type) {
    updates.push("type = ?");
    params.push(type);
  }
  if (title) {
    updates.push("title = ?");
    params.push(title);
  }
  if (description) {
    updates.push("description = ?");
    params.push(description);
  }
  if (price) {
    updates.push("price = ?");
    params.push(price);
  }
  if (bedrooms) {
    updates.push("bedrooms = ?");
    params.push(bedrooms);
  }
  if (bathrooms) {
    updates.push("bathrooms = ?");
    params.push(bathrooms);
  }
  if (area) {
    updates.push("area = ?");
    params.push(area);
  }
  if (note) {
    updates.push("note = ?");
    params.push(note);
  }
  if (built_year) {
    updates.push("built_year = ?");
    params.push(built_year);
  }
  if (garages) {
    updates.push("garages = ?");
    params.push(garages);
  }
  if (latitude) {
    updates.push("latitude = ?");
    params.push(latitude);
  }
  if (longitude) {
    updates.push("longitude = ?");
    params.push(longitude);
  }
  if (amenities) {
    updates.push("amenities = ?");
    params.push(amenities);
  }
  if (nearby) {
    updates.push("nearby = ?");
    params.push(nearby);
  }
  if (floor) {
    updates.push("floor = ?");
    params.push(floor);
  }
  if (vr_link) {
    updates.push("vr_link = ?");
    params.push(vr_link);
  }
  if (status) {
    updates.push("status = ?");
    params.push(status);
  }
  if (rate) {
    updates.push("rate = ?");
    params.push(rate);
  }
  if (education) {
    updates.push("education = ?");
    params.push(education);
  }
  if (health) {
    updates.push("health = ?");
    params.push(health);
  }
  if (transportation) {
    updates.push("transportation = ?");
    params.push(transportation);
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
