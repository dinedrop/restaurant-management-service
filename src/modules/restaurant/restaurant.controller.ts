import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";

import { catchAsync, ApiError, IOptions, IUserRequest } from "@dinedrop/shared";
import { pick } from "@dinedrop/shared";
import * as restaurantService from "./restaurant.service";
import * as foodService from "./food.service";

export const createRestaurant = catchAsync(
  async (req: IUserRequest, res: Response) => {
    req.body.userId = req.user._id;
    const restaurant = await restaurantService.createRestaurant(req.body);
    res.status(httpStatus.CREATED).send(restaurant);
  }
);

export const getRestaurants = catchAsync(
  async (req: Request, res: Response) => {
    const filter = pick(req.query, ["name", "role"]);
    const options: IOptions = pick(req.query, [
      "sortBy",
      "limit",
      "page",
      "projectBy",
    ]);
    const result = await restaurantService.queryRestaurants(filter, options);
    res.send(result);
  }
);

export const getRestaurant = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params["restaurantId"] === "string") {
    const restaurant = await restaurantService.getRestaurantById(
      new mongoose.Types.ObjectId(req.params["restaurantId"])
    );
    if (!restaurant) {
      throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
    }
    res.send(restaurant);
  }
});

export const updateRestaurant = catchAsync(
  async (req: IUserRequest, res: Response) => {
    if (typeof req.params["restaurantId"] === "string") {
      const restaurant = await restaurantService.updateRestaurantById(
        new mongoose.Types.ObjectId(req.params["restaurantId"]),
        req.user._id,
        req.body
      );
      res.send(restaurant);
    }
  }
);

export const deleteRestaurant = catchAsync(
  async (req: IUserRequest, res: Response) => {
    if (typeof req.params["restaurantId"] === "string") {
      await restaurantService.deleteRestaurantById(
        new mongoose.Types.ObjectId(req.params["restaurantId"]),
        req.user._id
      );
      res.status(httpStatus.NO_CONTENT).send();
    }
  }
);

export const getFoodList = catchAsync(async (req: Request, res: Response) => {
  const foodItem = req.body.foodItem;
  const result = await foodService.searchFoodByName(foodItem);
  if (!result) {
    new ApiError(httpStatus.NOT_FOUND, "Food not found");
  }
  res.send(result);
});
