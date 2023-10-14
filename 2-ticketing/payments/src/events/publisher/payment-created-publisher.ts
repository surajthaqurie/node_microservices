import { IPaymentCreatedEvent, Publisher, Subjects } from "@ticketing_microservice/common";

export class PaymentCreatedPublisher extends Publisher<IPaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
