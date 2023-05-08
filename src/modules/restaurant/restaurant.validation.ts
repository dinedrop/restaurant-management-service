import Joi from "joi";

import { objectId } from "@dinedrop/shared";
import { IRestaurant } from "./restaurant.interfaces";

const createRestaurantBody: Record<keyof IRestaurant, any> = {
  name: Joi.string().required(),
  description: Joi.string(),
  address: Joi.string(),
  location: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }),
  cuisine: Joi.string(),
  menu: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().required(),
    })
  ),
};

export const createRestaurant = {
  body: Joi.object().keys(createRestaurantBody),
};

export const getRestaurants = {
  query: Joi.object().keys({
    name: Joi.string(),
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
};

export const deleteRestaurant = {
  params: Joi.object().keys({
    restaurantId: Joi.string().custom(objectId),
  }),
};
