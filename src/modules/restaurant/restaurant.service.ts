import { IMenuDoc } from "./menu.interfaces";
import httpStatus from "http-status";
import { ApiError } from "@dinedrop/shared";
import { IOptions, QueryResult } from "@dinedrop/shared";
import { IRestaurant, IRestaurantDoc } from "./restaurant.interfaces";
import Restaurant from "./restaurant.model";
import Menu from "./menu.model";

export const createMenu = async (menuBody: IMenuDoc): Promise<IMenuDoc> => {
  return Menu.create(menuBody);
};

export const createRestaurant = async (
  restaurantBody: IRestaurant
): Promise<IRestaurant> => {
  const restaurant = await Restaurant.create(restaurantBody);
  const menu = await Menu.create({ restaurantId: restaurant._id, food: [] });
  restaurant.menu = menu._id;
  await restaurant.save();
  return restaurant;
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
  id: string
): Promise<IRestaurantDoc | null> => Restaurant.findById(id);

export const getRestaurantByEmail = async (
  email: string
): Promise<IRestaurantDoc | null> => Restaurant.findOne({ email });

export const updateRestaurantById = async (
  restaurantId: string,
  userId: string,
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
  restaurantId: string,
  userId: string
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
