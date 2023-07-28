import mongoose from "mongoose";
import config from "../../config";
import logger from "../../logger";

const MAX_ATTEMPTS = 10;
const RETRY_INTERVAL = 5000;

if (config.get("NODE_ENV") !== "production") {
  mongoose.set("debug", true);
}

type StopCallback = () => void;

const connectDb = (stopCallback: StopCallback, interator = 0) => {
  mongoose
    .connect(config.get("MONGO_HOST") || "")
    .then(() =>
      logger.info(`Connected to mongoDB ${config.get("MONGO_HOST") || ""}`)
    )
    .catch((err: Error) => {
      logger.error(`MongoDB connection error: ${err}`);
      if (interator < MAX_ATTEMPTS) {
        setTimeout(
          () => connectDb(stopCallback, interator + 1),
          RETRY_INTERVAL
        );
      } else {
        logger.error("MongoDB connection error: Too many connections attempt");
        stopCallback();
      }
    });
};

export default connectDb;
