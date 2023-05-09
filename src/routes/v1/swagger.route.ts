import config from "../../config/config";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { getSwagger } from "@dinedrop/shared";

const router = express.Router();
const swaggerDefinition = getSwagger(config.port);

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ["packages/components.yaml", "dist/routes/v1/*.js"],
});

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

export default router;
