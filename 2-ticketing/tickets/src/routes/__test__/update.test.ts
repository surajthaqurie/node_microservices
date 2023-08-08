import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exits", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const title = "concert";
  const price = 20;

  await request(app)
    .put(`/api/tickets/${id}`)
    //@ts-expect-error
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const title = "concert";
  const price = 20;
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title,
      price,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    //@ts-expect-error
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    //@ts-expect-error
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const title = "concert";
  const price = 20;
  //@ts-expect-error
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price: -10,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const title = "concert";
  const price = 20;

  //@ts-expect-error
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new concert",
      price: 200,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new concert");
  expect(ticketResponse.body.price).toEqual(200);
});
