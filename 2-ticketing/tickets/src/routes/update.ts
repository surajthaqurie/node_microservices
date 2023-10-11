import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import { requireAuth, NotFoundError, validateRequest, NotAuthorizedError, BadRequestError } from "@ticketing_microservice/common";
import { TicketUpdatedPublisher } from "../events/publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [body("title").not().isEmpty().withMessage("Title is required"), body("price").isFloat({ gt: 0 }).withMessage("Price must be provided and must be greater than zero")],
  validateRequest,

  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();

    if (ticket.orderId) throw new BadRequestError("Cannot edit a reserved ticket");
    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    ticket.set({ title, price });
    await ticket.save();

    // publish an event
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.send(ticket);
  }
);

export { router as updateTicketRouter };
