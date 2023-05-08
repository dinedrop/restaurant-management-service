import { IRestaurantDoc } from "./modules/restaurant/restaurant.interfaces";

declare module "express-serve-static-core" {
  export interface Request {
    restaurant: IRestaurantDoc;
  }
}
