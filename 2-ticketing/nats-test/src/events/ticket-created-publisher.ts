import { Publisher } from "./base-publisher";
import { ITicketCreatedEvent } from "../interfaces";
import { Subjects } from "../enums";

export class TIcketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
