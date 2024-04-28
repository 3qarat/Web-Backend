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

export const getAllApartments = catchAsync(async (req, res, next) => {
  const apartments = await apartmentService.getAllApartments(req.user.id);

  res.status(200).json({
    status: "sucess",
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
