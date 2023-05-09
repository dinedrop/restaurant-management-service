import httpStatus from "http-status";
import mongoose from "mongoose";

import { ApiError } from "@dinedrop/shared";
import { IOptions, QueryResult } from "@dinedrop/shared";
import { IRestaurant, IRestaurantDoc } from "./restaurant.interfaces";
import Restaurant from "./restaurant.model";

export const createRestaurant = async (
  restaurantBody: IRestaurant
): Promise<IRestaurant> => {
  return Restaurant.create(restaurantBody);
};

export const registerRestaurant = async (
  restaurantBody: IRestaurant
): Promise<IRestaurantDoc> => {
  return Restaurant.create(restaurantBody);
};

export const queryRestaurants = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  const restaurants = await Restaurant.paginate(filter, options);
  return restaurants;
};

export const getRestaurantById = async (
  id: mongoose.Types.ObjectId
): Promise<IRestaurantDoc | null> => Restaurant.findById(id);

export const getRestaurantByEmail = async (
  email: string
): Promise<IRestaurantDoc | null> => Restaurant.findOne({ email });

export const updateRestaurantById = async (
  restaurantId: mongoose.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  updateBody: IRestaurantDoc
): Promise<IRestaurantDoc | null> => {
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
  }
  if (!restaurant.userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  if (restaurant.userId.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  Object.assign(restaurant, updateBody);
  await restaurant.save();
  return restaurant;
};

export const deleteRestaurantById = async (
  restaurantId: mongoose.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId
): Promise<IRestaurantDoc | null> => {
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
  }
  if (!restaurant.userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  if (restaurant.userId.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  await restaurant.deleteOne();
  return restaurant;
};
