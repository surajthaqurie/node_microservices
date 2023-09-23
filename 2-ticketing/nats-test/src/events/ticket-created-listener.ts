import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

import { ITicketCreatedEvent } from "../interfaces";
import { Subjects } from "../enums";

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  onMessage(data: ITicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data !", data);

    msg.ack();
  }
}
