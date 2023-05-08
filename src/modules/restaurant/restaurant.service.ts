import httpStatus from "http-status";
import mongoose from "mongoose";

import { ApiError } from "@dinedrop/shared";
import { IOptions, QueryResult } from "@dinedrop/shared";
import {
  IRestaurantDoc,
  NewCreatedRestaurant,
  NewRegisteredRestaurant,
  UpdateRestaurantBody,
} from "./restaurant.interfaces";
import Restaurant from "./restaurant.model";

/**
 * Create a restaurant
 * @param {NewCreatedRestaurant} restaurantBody
 * @returns {Promise<IRestaurantDoc>}
 */
export const createRestaurant = async (
  restaurantBody: NewCreatedRestaurant
): Promise<IRestaurantDoc> => {
  return Restaurant.create(restaurantBody);
};

/**
 * Register a restaurant
 * @param {NewRegisteredRestaurant} restaurantBody
 * @returns {Promise<IRestaurantDoc>}
 */
export const registerRestaurant = async (
  restaurantBody: NewRegisteredRestaurant
): Promise<IRestaurantDoc> => {
  if (await Restaurant.isEmailTaken(restaurantBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return Restaurant.create(restaurantBody);
};

/**
 * Query for restaurants
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryRestaurants = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  const restaurants = await Restaurant.paginate(filter, options);
  return restaurants;
};

/**
 * Get restaurant by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IRestaurantDoc | null>}
 */
export const getRestaurantById = async (
  id: mongoose.Types.ObjectId
): Promise<IRestaurantDoc | null> => Restaurant.findById(id);

/**
 * Get restaurant by email
 * @param {string} email
 * @returns {Promise<IRestaurantDoc | null>}
 */
export const getRestaurantByEmail = async (
  email: string
): Promise<IRestaurantDoc | null> => Restaurant.findOne({ email });

/**
 * Update restaurant by id
 * @param {mongoose.Types.ObjectId} restaurantId
 * @param {UpdateRestaurantBody} updateBody
 * @returns {Promise<IRestaurantDoc | null>}
 */
export const updateRestaurantById = async (
  restaurantId: mongoose.Types.ObjectId,
  updateBody: UpdateRestaurantBody
): Promise<IRestaurantDoc | null> => {
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
  }
  if (
    updateBody.email &&
    (await Restaurant.isEmailTaken(updateBody.email, restaurantId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(restaurant, updateBody);
  await restaurant.save();
  return restaurant;
};

/**
 * Delete restaurant by id
 * @param {mongoose.Types.ObjectId} restaurantId
 * @returns {Promise<IRestaurantDoc | null>}
 */
export const deleteRestaurantById = async (
  restaurantId: mongoose.Types.ObjectId
): Promise<IRestaurantDoc | null> => {
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
  }
  await restaurant.deleteOne();
  return restaurant;
};
