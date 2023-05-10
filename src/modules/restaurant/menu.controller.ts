import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync, ApiError, IUserRequest } from "@dinedrop/shared";
import * as menuService from "./menu.service";
import Menu from "./menu.model";
import { getRestaurantById } from "./restaurant.service";

export const addFoodToMenu = catchAsync(async (req: Request, res: Response) => {
  let result;
  if (req.params["menuId"]) {
    result = await menuService.addFoodToMenu(req.params["menuId"], req.body);
  }
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "No food found");
  res.send(result);
});

export const deleteFoodFromMenu = catchAsync(
  async (req: Request, res: Response) => {
    let result;
    if (req.params["menuId"] && req.params["foodId"]) {
      result = await menuService.deleteFoodFromMenu(
        req.params["menuId"],
        req.params["foodId"]
      );
    }
    if (!result) throw new ApiError(httpStatus.NOT_FOUND, "No food found");
    res.send(result);
  }
);

export const updateFoodInMenu = catchAsync(
  async (req: Request, res: Response) => {
    let result;
    if (req.params["menuId"] && req.params["foodId"]) {
      result = await menuService.updateFoodInMenu(
        req.params["menuId"],
        req.params["foodId"],
        req.body
      );
    }
    if (!result) throw new ApiError(httpStatus.NOT_FOUND, "No food found");
    res.send(result);
  }
);

export const getFoodByName = catchAsync(async (req: Request, res: Response) => {
  const result = await menuService.searchFoodByName(req.body.foodName);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "No food found");
  res.send(result);
});

export const checkUserAuthorization = async (
  req: IUserRequest,
  _res: Response,
  next: NextFunction
) => {
  const userId = req.user._id; // assuming you have middleware that sets req.user to the authenticated user object
  const menuId = req.params["menuId"]; // assuming the menu ID is included in the request parameters

  // Retrieve the menu by ID
  const menu = await Menu.findById(menuId);

  // If the menu doesn't exist, return a 404 error
  if (!menu) {
    throw new ApiError(httpStatus.NOT_FOUND, "Menu not found");
  }

  // Retrieve the restaurant associated with the menu
  const restaurant = await getRestaurantById(menu.restaurantId.toString());

  // If the restaurant doesn't exist, return a 404 error
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
  }

  // Check if the authenticated user is authorized to perform operations on the menu
  if (
    !restaurant.userId ||
    restaurant.userId.toString() !== userId.toString()
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  // If the user is authorized, pass control to the next middleware/controller
  next();
};
