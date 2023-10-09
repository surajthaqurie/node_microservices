import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ITicketUpdatedEvent,
} from "@ticketing_microservice/common";

import { Ticket } from "../../models/ticket";

export { queueGroupName } from "./queue_group_name";

export class TicketUpdatedListener extends Listener<ITicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = this.queueGroupName;

  async onMessage(
    data: ITicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    // const ticket = await Ticket.findById(data.id);
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error("Ticket not found");

    const { title, price } = data;
    ticket.set({ title, price });
    ticket.save();

    msg.ack();
  }
}
