import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { IOrderCreatedEvent, OrderStatus } from "@ticketing_microservice/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../model/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: IOrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "randomTime",
    userId: "randomId",
    status: OrderStatus.Created,
    ticket: {
      id: "randomId",
      price: 10,
    },
  };

  // @ts-expect-error
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
