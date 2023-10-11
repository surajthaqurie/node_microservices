import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { ITicketUpdatedEvent } from "@ticketing_microservice/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated.listener";

const setup = async () => {
  // creates an instance of the Listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
  });

  await ticket.save();

  // create a fake data event
  const data: ITicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "new concert",
    version: ticket.version + 1,
    price: 202,
    userId: "randomId",
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return {
    listener,
    data,
    ticket,
    msg,
  };
};

it("finds, updates, saves a tickets", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does bot call ack if the event has a skipped version number", async () => {
  const { msg, data, ticket, listener } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
