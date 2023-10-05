import {
  Publisher,
  IOrderCreatedEvent,
  Subjects,
} from "@ticketing_microservice/common";

export class OrderCreatedPublisher extends Publisher<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
