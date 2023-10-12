import { Listener, IOrderCancelledEvent, Subjects } from "@ticketing_microservice/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue_group_name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher";

export class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(data: IOrderCancelledEvent["data"], msg: Message): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      price: ticket.price,
      userId: ticket.userId,
      title: ticket.title,
      version: ticket.version,
    });

    msg.ack();
  }
}
