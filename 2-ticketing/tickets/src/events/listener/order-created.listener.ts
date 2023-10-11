import { IOrderCreatedEvent, Listener, OrderStatus, Subjects } from "@ticketing_microservice/common";
import { queueGroupName } from "./queue_group_name";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher";

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName: string = queueGroupName;

  // data: comes from publisher (here, order created)
  async onMessage(data: IOrderCreatedEvent["data"], msg: Message): Promise<void> {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) throw new Error("Ticket not find");

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();

    // re-publish (own event) for updated version
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}
