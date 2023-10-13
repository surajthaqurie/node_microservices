import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../model/order";
import { OrderStatus } from "@ticketing_microservice/common";

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
    .expect(401);
  // .expect(400);
});
