import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  //@ts-expect-error
  const user = global.signin();

  // make a request to create an Order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  // expectation to make sure the things is cancelled
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  //@ts-expect-error
  const user = global.signin();

  // make a request to create an Order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  // expectation to make sure the things is cancelled
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
