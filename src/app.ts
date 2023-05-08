import compression from "compression";
import cors from "cors";
import express, { Express } from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import httpStatus from "http-status";
import xss from "xss-clean";

import config from "./config/config";
import { ApiError, errorConverter, errorHandler } from "@dinedrop/shared";
import { morgan } from "@dinedrop/shared";
import routes from "./routes/v1";
import runConsumer from "./modules/kafka/consumer";

const app: Express = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors());
app.options("*", cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

runConsumer();

// v1 api routes
app.use("/", routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
