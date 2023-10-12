import { Subjects, Publisher, IExpirationCompleteEvent } from "@ticketing_microservice/common";

export class ExpirationCompletePublisher extends Publisher<IExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
