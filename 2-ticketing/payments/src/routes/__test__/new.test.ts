import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../model/order";
import { OrderStatus } from "@ticketing_microservice/common";
import { Payment } from "../../model/payment";

import { stripe } from "../../stripe";

it("returns a 404 when purchasing an order that does not exits", async () => {
  await request(app)
    .post("/api/payments")
    //@ts-expect-error
    .set("Cookie", global.signin())
    .send({
      token: "randomToken",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesn't belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    //@ts-expect-error
    .set("Cookie", global.signin())
    .send({
      token: "randomToken",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    userId,
    version: 0,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    // @ts-expect-error
    .set("Cookie", global.signin(userId))
    .send({
      token: "randomToken",
      orderId: order.id,
    })
    .expect(400);
});

/*
 jest.mock("../../stripe");

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    userId,
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    // @ts-expect-error
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargesOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargesOptions.source).toEqual("tok_visa");
  expect(chargesOptions.amount).toEqual(order.price * 100);
  expect(chargesOptions.currency).toEqual("usd");
});
 */

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price,
    userId,
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    // @ts-expect-error
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const stripeChargers = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeChargers.data.find((charge) => charge.amount == price * 100);

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");

  const payment = await Payment.findOne({ orderId: order.id, stripeId: stripeCharge!.id });
  expect(payment).not.toBeNull();
});
