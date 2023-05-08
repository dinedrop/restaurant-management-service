import Joi from "joi";

import { objectId, password } from "@dinedrop/shared";
import { NewCreatedRestaurant } from "./restaurant.interfaces";

const createRestaurantBody: Record<keyof NewCreatedRestaurant, any> = {
  email: Joi.string().required().email(),
  name: Joi.string().required(),
  cartId: Joi.string().custom(objectId),
  orderId: Joi.string().custom(objectId),
};

export const createRestaurant = {
  body: Joi.object().keys(createRestaurantBody),
};

export const getRestaurants = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getRestaurant = {
  params: Joi.object().keys({
    restaurantId: Joi.string().custom(objectId),
  }),
};

export const updateRestaurant = {
  params: Joi.object().keys({
    restaurantId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

export const deleteRestaurant = {
  params: Joi.object().keys({
    restaurantId: Joi.string().custom(objectId),
  }),
};
