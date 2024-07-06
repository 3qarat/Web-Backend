import pool from "../../database/index.js";
import AppError from "../../../utils/appError.js";

export const createPlace = async (
  {
    type,
    title,
    description,
    price,
    area,
    note,
    latitude,
    longitude,
    address,
    floor_num,
    vr_link,
    status,
  },
  photos,
  userId
) => {
  if (
    !type ||
    !title ||
    !price ||
    !area ||
    !latitude ||
    !longitude ||
    !floor_num ||
    !status ||
    !photos ||
    !address
  ) {
    throw new AppError(
      "please provide all require fields [type, title, price, area, latitude, longitude, floor_num, status]",
      400
    );
  }
  const photosPaths = photos.map((photo) => `uploads/${photo.filename}`);
  const connection = await pool.getConnection();
  let sql;

  try {
    await connection.beginTransaction();

    sql = `
        insert into places (type, title, description, price,  area,  note,  latitude,longitude,address,  floor_num,  vr_link, status, user_id)
        values (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const [rows] = await connection.query(sql, [
      type,
      title,
      description,
      price,
      area,
      note,
      latitude,
      longitude,
      address,
      floor_num,
      vr_link,
      status,
      userId,
    ]);

    sql = `
        insert into place_photos (place_id, photo)
        values (?, ?)
    `;

    const placePhotosPromises = photosPaths.map((photo) =>
      connection.query(sql, [rows.insertId, photo])
    );

    await Promise.all(placePhotosPromises);

    await connection.commit();
    return rows.insertId;
  } catch (err) {
    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const getAllPlaces = async ({
  minPrice,
  maxPrice,
  minArea,
  maxArea,
  minRate,
  maxRate,
  view_count,
  address,
}) => {
  const sql = `
      select u.id as user_id, u.username, u.profile_picture, p.id as place_id , p.type, p.title, p.description, p.area, p.note, p.latitude, p.longitude, p.address, p.floor_num, p.vr_link, p.status, p.rate, p.view_count, i.photo
      from places as p
      inner join user as u
      on p.user_id = u.id
      left join place_photos as i
      on p.id = i.place_id
      where 1 = 1 `;

  let params = [];
  let places = {};

  if (minPrice) {
    sql += " and p.price >= ?";
    params.push(minPrice);
  }
  if (maxPrice) {
    sql += " and p.price <= ?";
    params.push(maxPrice);
  }
  if (minArea) {
    sql += " and p.area >= ?";
    params.push(minArea);
  }
  if (maxArea) {
    sql += " and p.area <= ?";
    params.push(maxArea);
  }
  if (minRate) {
    sql += " and p.rate >= ?";
    params.push(minRate);
  }
  if (maxRate) {
    sql += " and p.rate <= ?";
    params.push(maxRate);
  }
  if (view_count) {
    sql += " and p.view_count > ?";
    params.push(view_count);
  }
  if (address) {
    sql += " and p.address = ?";
    params.push(address);
  }

  const [rows] = await pool.query(sql, params);

  rows.forEach((row) => {
    if (!places[row.place_id]) {
      places[row.place_id] = {
        ...row,
        photos: [],
      };
    }

    if (row.photo) {
      places[row.place_id].photos.push(row.photo);
    }
  });

  const placesArr = Object.values(places);
  return placesArr;
};

export const getPlaceById = async (placeId) => {
  const sql = `
  select u.id as user_id, u.username, u.profile_picture, p.id as place_id , p.type, p.title, p.description, p.area, p.note, p.latitude, p.longitude, p.address, p.floor_num, p.vr_link, p.status, p.rate, p.view_count, i.photo
  from places as p
  inner join user as u
  on p.user_id = u.id
  left join place_photos as i
  on p.id = i.place_id
  where p.id = ?`;
  let places = {};

  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    //update view_count
    const [result] = await connection.query(
      "update places set view_count = 1 + view_count where id = ?",
      [placeId]
    );
    const [rows] = await connection.query(sql, [placeId]);
    connection.commit();

    if (rows.length === 0) {
      throw new AppError(`place not found with Id ${placeId}`, 400);
    }

    rows.forEach((row) => {
      if (!places[row.placeId]) {
        places[row.placeId] = {
          ...row,
          photos: [],
        };
      }

      if (row.photo) {
        places[row.placeId].photos.push(row.photo);
      }
    });

    const placeArr = Object.values(places);
    return placeArr;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const updatePlaceById = async (
  {
    type,
    title,
    description,
    price,
    area,
    note,
    latitude,
    longitude,
    address,
    floor_num,
    vr_link,
    status,
  },
  placeId
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
  if (area) {
    updates.push("area = ?");
    params.push(area);
  }
  if (note) {
    updates.push("note = ?");
    params.push(note);
  }
  if (latitude) {
    updates.push("latitude = ?");
    params.push(latitude);
  }
  if (longitude) {
    updates.push("longitude = ?");
    params.push(longitude);
  }
  if (address) {
    updates.push("address = ?");
    params.push(address);
  }
  if (floor_num) {
    updates.push("floor_num = ?");
    params.push(floor_num);
  }
  if (vr_link) {
    updates.push("vr_link = ?");
    params.push(vr_link);
  }
  if (status) {
    updates.push("status = ?");
    params.push(status);
  }

  if (updates.length == 0) {
    throw new AppError("no valid fields provided for update.");
  }

  params.push(placeId);

  const sql = `update places set ${updates.join(", ")} where id = ?`;

  const [result] = await pool.query(sql, params);

  if (result.affectedRows === 0) {
    throw new AppError(`no apartment found with ID ${placeId}`, 400);
  }
  return placeId;
};

export const deletePlaceById = async (placeId) => {
  const sql = `
    delete 
    from places
    where id = ?
  `;

  await pool.query(sql, [placeId]);
};
