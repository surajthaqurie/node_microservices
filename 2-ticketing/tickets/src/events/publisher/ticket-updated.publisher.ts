import {
  Publisher,
  Subjects,
  ITicketUpdatedEvent,
} from "@ticketing_microservice/common";

export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
