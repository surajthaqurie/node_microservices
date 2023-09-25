import {
  Publisher,
  Subjects,
  ITicketCreatedEvent,
} from "@ticketing_microservice/common";

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
