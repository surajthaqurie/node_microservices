import express, { Request, Response } from "express";
const router = express.Router();
import { currentUser, requireAuth } from "@ticketing_microservice/common";
// import { requireAuth } from "../middlewares/require-auth";

router.get(
  "/api/users/current-user",
  [currentUser /* requireAuth */],
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
