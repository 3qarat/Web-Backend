import e from "express";
import catchAsync from "../../../utils/catchAsync.js";
import * as apartmentService from "./apartment.service.js";

export const createApartment = catchAsync(async (req, res, next) => {
  const apartment_id = await apartmentService.createApartment(
    req.body,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    data: {
      apartment_id,
    },
  });
});

export const getAllApartmentsBasedOnFilters = catchAsync(
  async (req, res, next) => {
    const apartments = await apartmentService.getAllApartmentsBasedOnFilters(
      req.query
    );

    res.status(200).json({
      status: "success",
      data: {
        apartments,
      },
    });
  }
);

export const getAllUserApartments = catchAsync(async (req, res, next) => {
  const apartments = await apartmentService.getAllUserApartments(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      apartments,
    },
  });
});

export const getApartmentById = catchAsync(async (req, res, next) => {
  const apartment = await apartmentService.getApartmentById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      apartment,
    },
  });
});

export const updateApartmentById = catchAsync(async (req, res, next) => {
  const affectedRows = await apartmentService.updateApartmentById(
    req.body,
    req.params.id
  );

  res.status(200).json({
    status: "success",
    data: {
      affectedRows,
    },
  });
});

export const dynamicUpdateApartmentById = catchAsync(async (req, res, next) => {
  const affectedRows = await apartmentService.dynamicUpdateApartmentById(
    req.body,
    req.params.id
  );

  res.status(200).json({
    status: "success",
    data: {
      affectedRows,
    },
  });
});

export const deleteApartmentById = catchAsync(async (req, res, next) => {
  await apartmentService.deleteApartmentById(req.params.id);

  res.status(200).json({
    status: "success",
  });
});

