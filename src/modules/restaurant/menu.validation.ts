import Joi from "joi";
import { objectId } from "@dinedrop/shared";
// import { IFoodDoc } from "./menu.interfaces";

export const getFoodByName = {
  body: Joi.object().keys({
    foodName: Joi.string().required(),
  }),
};

export const addFoodToMenu = {
  params: Joi.object().keys({
    menuId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required(),
    image: Joi.string().uri(),
  }),
};

export const deleteFoodFromMenu = {
  params: Joi.object().keys({
    menuId: Joi.string().custom(objectId),
    foodId: Joi.string().custom(objectId),
  }),
};

export const updateFoodInMenu = {
  params: Joi.object().keys({
    menuId: Joi.string().custom(objectId),
    foodId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    image: Joi.string().uri(),
  }),
};

export const searchFoodByName = {
  query: Joi.object().keys({
    q: Joi.string().required(),
  }),
};
