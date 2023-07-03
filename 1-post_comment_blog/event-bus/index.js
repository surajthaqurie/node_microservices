const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

// event bus data store
const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  // axios.post("http://localhost:4000/events", event); // post service

  axios.post("http://posts-clusterip-srv:4000/events", event); // post service
  axios.post("http://comments-srv:4001/events", event); // comment service
  axios.post("http://query-srv:4002/events", event); // query service
  axios.post("http://moderation-srv:4003/events", event); // moderation comment service

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log(`Listening on 4005`);
});
