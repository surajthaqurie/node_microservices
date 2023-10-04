import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();

  //@ts-expect-error
  const user = global.signin();

  // make a request to build on order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchOrder.id).toEqual(order.id);
});

it("return an error if one user tries to fetch another users order", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();

  //@ts-expect-error
  const userOne = global.signin();
  //@ts-expect-error
  const userTwo = global.signin();

  // make a request to build on order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .send()
    .expect(401);
});
