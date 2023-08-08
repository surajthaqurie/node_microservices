import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  return (
    request(app)
      .post("/api/tickets")
      //@ts-expect-error
      .set("Cookie", global.signin())
      .send({
        title: "ticket title",
        price: 20,
      })
      .expect(201)
  );
};

it("can fetch a list of ticket", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
