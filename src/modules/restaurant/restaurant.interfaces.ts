import mongoose, { Document, Model } from "mongoose";

import { QueryResult } from "@dinedrop/shared";

export interface IRestaurant {
  name: string;
  email: string;
  cartId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
}

export interface IRestaurantDoc extends IRestaurant, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IRestaurantModel extends Model<IRestaurantDoc> {
  isEmailTaken(
    email: string,
    excludeRestaurantId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export type UpdateRestaurantBody = Partial<IRestaurant>;

export type NewRegisteredRestaurant = Omit<
  IRestaurant,
  "role" | "isEmailVerified"
>;

export type NewCreatedRestaurant = Omit<IRestaurant, "isEmailVerified">;
