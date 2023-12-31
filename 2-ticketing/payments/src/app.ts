import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@ticketing_microservice/common";

import { createChargeRouter } from "./routes/new";
// import { showTicketRouter } from "./routes/show";
// import { indexTicketRouter } from "./routes";
// import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createChargeRouter);
// app.use(showTicketRouter);
// app.use(indexTicketRouter);
// app.use(updateTicketRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
