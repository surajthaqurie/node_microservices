import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed !");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

/* 
 // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true) // 30 sec automatically
  //   .setDeliverAllAvailable() // re-deliver
  //   .setDurableName("accounting-service");

  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   "orders-service-queue-group", // queue group name
  //   options
  // );

  // subscription.on("message", (msg: Message) => {
  //   console.log("Messaged received");
  //   const data = msg.getData();
  //   if (typeof data === "string") {
  //     console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
  //   }

  //   msg.ack();
  // });
  
*/
