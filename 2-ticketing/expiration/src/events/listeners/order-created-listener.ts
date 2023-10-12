import { Listener, IOrderCreatedEvent, Subjects } from "@ticketing_microservice/common";
import { queueGroupName } from "./queue_group_name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues";

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName: string = queueGroupName;

  async onMessage(data: IOrderCreatedEvent["data"], msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log("Waiting this many milliseconds to process the job:", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
