import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ITicketCreatedEvent,
} from "@ticketing_microservice/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue_group_name";

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName; //

  async onMessage(
    data: ITicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
