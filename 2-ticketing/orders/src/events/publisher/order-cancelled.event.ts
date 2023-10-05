import {
  Publisher,
  IOrderCancelledEvent,
  Subjects,
} from "@ticketing_microservice/common";

export class OrderCancelledPublisher extends Publisher<IOrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
