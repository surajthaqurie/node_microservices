import { IOrderCancelledEvent, Listener, Subjects, OrderStatus } from "@ticketing_microservice/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";
import { queueGroupName } from "./queue_group_name";

export class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(data: IOrderCancelledEvent["data"], msg: Message): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
