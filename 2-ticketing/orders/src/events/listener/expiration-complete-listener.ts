import { IExpirationCompleteEvent, Listener, Subjects } from "@ticketing_microservice/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue_group_name";
import { Order, OrderStatus } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher";

export class ExpirationCompleteListener extends Listener<IExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;

  async onMessage(data: IExpirationCompleteEvent["data"], msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new Error("Order not found");

    if (order.status === OrderStatus.Complete) return msg.ack();

    order.set({ status: OrderStatus.Cancelled });
    order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
