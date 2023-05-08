import { Document, Model } from "mongoose";

import { QueryResult } from "@dinedrop/shared";

export interface IRestaurant {
  name: string;
  description?: string;
  address?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  cuisine?: string;
  menu?: {
    name: string;
    description?: string;
    price: number;
  }[];
}

export interface IRestaurantDoc extends IRestaurant, Document {}

export interface IRestaurantModel extends Model<IRestaurantDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}
