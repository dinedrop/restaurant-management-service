import Menu from "./menu.model";
import { IMenuDoc } from "./menu.interfaces";
import { Types } from "mongoose";

export async function searchFoodByName(
  foodName: string
): Promise<{ restaurantId: Types.ObjectId; food: IMenuDoc["food"][0] }[]> {
  const regex = new RegExp(`.*${foodName}.*`, "i");

  const menus = await Menu.find({ "food.name": regex }).populate(
    "restaurant",
    "name"
  );

  const results = menus.reduce<
    { restaurantId: Types.ObjectId; food: IMenuDoc["food"][0] }[]
  >((acc, menu) => {
    const matchingFoods = menu.food.filter((food) => regex.test(food.name));
    if (matchingFoods.length > 0) {
      matchingFoods.forEach((food) => {
        acc.push({
          restaurantId: menu.restaurant._id,
          food,
        });
      });
    }
    return acc;
  }, []);

  return results;
}
