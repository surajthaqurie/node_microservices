import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  // @ts-expect-error
  const cookie = await signin();
  const response = await request(app)
    .get("/api/users/current-user")
    .send()
    .set("Cookie", cookie)
    .expect(200);

  //   console.log(response.body);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/current-user")
    .send()
    .expect(401);

  // console.log(response.body.errors);

  expect(response.body.errors[0].message).toEqual("Not authorized");
});
