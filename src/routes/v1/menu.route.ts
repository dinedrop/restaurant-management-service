import { auth, validate } from "@dinedrop/shared";
import express, { Router } from "express";
import { menuController, menuValidation } from "../../modules/restaurant";

const router: Router = express.Router();

router
  .route("/")
  .get(validate(menuValidation.getFoodByName), menuController.getFoodByName);

router
  .route("/:menuId")
  .post(
    auth("manageRestaurant"),
    validate(menuValidation.addFoodToMenu),
    menuController.addFoodToMenu
  );

router
  .route("/:menuId/:foodId")
  .delete(
    auth("manageRestaurant"),
    validate(menuValidation.deleteFoodFromMenu),
    menuController.deleteFoodFromMenu
  )
  .patch(
    auth("manageRestaurant"),
    validate(menuValidation.updateFoodInMenu),
    menuController.updateFoodInMenu
  );

export default router;
