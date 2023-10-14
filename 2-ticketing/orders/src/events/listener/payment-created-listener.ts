import { IPaymentCreatedEvent, Listener, OrderStatus, Subjects } from "@ticketing_microservice/common";
import { queueGroupName } from "./queue_group_name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<IPaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  queueGroupName: string = queueGroupName;
  async onMessage(data: IPaymentCreatedEvent["data"], msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
