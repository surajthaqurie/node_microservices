import { IOrderCreatedEvent, Listener, OrderStatus, Subjects } from "@ticketing_microservice/common";
import { Order } from "../../model/order";
import { queueGroupName } from "./queue_group_name";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: IOrderCreatedEvent["data"], msg: Message): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}
