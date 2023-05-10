import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync, ApiError } from "@dinedrop/shared";
import * as menuService from "./menu.service";

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
