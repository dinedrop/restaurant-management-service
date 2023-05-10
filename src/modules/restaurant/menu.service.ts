import httpStatus from "http-status";
import { ApiError } from "@dinedrop/shared";
import Menu from "./menu.model";
import { IFoodDoc, IMenuDoc } from "./menu.interfaces";
import { Schema } from "mongoose";

// export async function searchFoodByName(foodName: string) {}

export const addFoodToMenu = async (
  menuId: string,
  food: IFoodDoc
): Promise<IMenuDoc> => {
  const menu = await Menu.findById(menuId);
  if (!menu) throw new ApiError(httpStatus.NOT_FOUND, "Menu not found!");
  menu.food.push(food);
  return menu.save();
};

export const deleteFoodFromMenu = async (
  menuId: string,
  foodId: string
): Promise<IMenuDoc> => {
  const menu = await Menu.findById(menuId);
  if (!menu) throw new Error("Menu not found");
  menu.food = menu.food.filter((food) => food.id !== foodId);
  return menu.save();
};

export const updateFoodInMenu = async (
  menuId: string,
  foodId: string,
  update: Partial<IFoodDoc>
): Promise<IMenuDoc> => {
  const menu = await Menu.findById(menuId);
  if (!menu) throw new ApiError(httpStatus.NOT_FOUND, "Menu not found!");

  const foodIndex = menu.food.findIndex(
    (food) => food._id.toString() === foodId
  );
  if (foodIndex === -1)
    throw new ApiError(httpStatus.NOT_FOUND, "Food not found!");

  // Merge the existing food object with the update object
  const updatedFood = Object.assign(
    {},
    menu.food[foodIndex]?.toObject(),
    update
  );

  // Update the food object in the menu
  menu.food[foodIndex] = updatedFood;

  // Save the updated menu and return it
  return menu.save();
};

export const searchFoodByName = async (
  name: string
): Promise<
  Array<{
    restaurant: Schema.Types.ObjectId;
    food: IFoodDoc;
  }>
> => {
  // Find all menus that contain a food item with the given name
  const menus = await Menu.find({
    "food.name": { $regex: new RegExp(name, "i") },
  }).populate("restaurantId");

  // Create an array of objects with restaurant and food details
  const results = menus.flatMap((menu: IMenuDoc) => {
    const restaurant = menu.restaurantId;
    const foods = menu.food.filter((food: IFoodDoc) =>
      food.name.toLowerCase().includes(name.toLowerCase())
    );
    return foods.map((food: IFoodDoc) => ({ restaurant, food }));
  });

  return results;
};
