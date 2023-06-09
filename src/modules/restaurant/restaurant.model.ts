import mongoose from "mongoose";
import { paginate } from "@dinedrop/shared";
import { toJSON } from "@dinedrop/shared";
import { IRestaurantDoc, IRestaurantModel } from "./restaurant.interfaces";

const restaurantSchema = new mongoose.Schema<IRestaurantDoc, IRestaurantModel>(
  {
    name: { type: String, required: true },
    description: String,
    address: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    cuisine: String,
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
restaurantSchema.plugin(toJSON);
restaurantSchema.plugin(paginate);

const Restaurant = mongoose.model<IRestaurantDoc, IRestaurantModel>(
  "Restaurant",
  restaurantSchema
);

export default Restaurant;
