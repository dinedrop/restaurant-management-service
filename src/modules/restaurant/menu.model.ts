import mongoose, { Schema } from "mongoose";
import { paginate } from "@dinedrop/shared";
import { toJSON } from "@dinedrop/shared";
import { IReviewDoc, IFoodDoc, IMenuDoc, IMenuModel } from "./menu.interfaces";

const reviewSchema = new Schema<IReviewDoc>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const foodSchema = new Schema<IFoodDoc>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  reviews: [reviewSchema],
});

const menuSchema = new Schema<IMenuDoc, IMenuModel>({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  food: [foodSchema],
});

// add plugin that converts mongoose to json
menuSchema.plugin(toJSON);
menuSchema.plugin(paginate);

const Menu = mongoose.model<IMenuDoc, IMenuModel>("Menu", menuSchema);

export default Menu;
