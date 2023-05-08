import { QueryResult } from "@dinedrop/shared";
import { Model, Types, Document } from "mongoose";

export interface IReviewDoc extends Document {
  name: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFoodDoc extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  reviews?: IReviewDoc[];
}

export interface IMenuDoc extends Document {
  restaurant: Types.ObjectId;
  food: IFoodDoc[];
}

export interface IMenuModel extends Model<IMenuDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}
