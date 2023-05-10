import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync, ApiError, IOptions, IUserRequest } from "@dinedrop/shared";
import { pick } from "@dinedrop/shared";
import * as restaurantService from "./restaurant.service";

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
      req.params["restaurantId"]
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
        req.params["restaurantId"],
        req.user._id.toString(),
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
        req.params["restaurantId"],
        req.user._id.toString()
      );
      res.status(httpStatus.NO_CONTENT).send();
    }
  }
);
