import mongoose from "mongoose";
import validator from "validator";
import { paginate } from "@dinedrop/shared";
import { toJSON } from "@dinedrop/shared";
import { IRestaurantDoc, IRestaurantModel } from "./restaurant.interfaces";

const restaurantSchema = new mongoose.Schema<IRestaurantDoc, IRestaurantModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
restaurantSchema.plugin(toJSON);
restaurantSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The restaurant's email
 * @param {ObjectId} [excludeRestaurantId] - The id of the restaurant to be excluded
 * @returns {Promise<boolean>}
 */
restaurantSchema.static(
  "isEmailTaken",
  async function (
    email: string,
    excludeRestaurantId: mongoose.ObjectId
  ): Promise<boolean> {
    const restaurant = await this.findOne({
      email,
      _id: { $ne: excludeRestaurantId },
    });
    return !!restaurant;
  }
);

const Restaurant = mongoose.model<IRestaurantDoc, IRestaurantModel>(
  "Restaurant",
  restaurantSchema
);

export default Restaurant;
