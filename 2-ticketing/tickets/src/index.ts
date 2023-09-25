import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  try {
    await natsWrapper.connect("ticketing", "laskjf", "http://nats-server:4222");
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed !");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("connected to mongodb...");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000 !!");
  });
};

start();
