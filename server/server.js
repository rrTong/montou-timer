import express from "express";

const app = express();
const port = 8080;

app.use(express.json());

// Notification request headers
const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();

// Notification message types
const MESSAGE_TYPE_NOTIFICATION = "notification";
const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
const MESSAGE_TYPE_REVOCATION = "revocation";

app.post("/eventsub", (req, res) => {
  console.log(`Request: ${JSON.stringify(req.body)}`);
  if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
    // TODO: Do something with event's data.
    console.log(`Event type: ${req.body.subscription.type}`);
    console.log(JSON.stringify(req.body.event, null, 4));

    res.sendStatus(204);
  } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
    res.status(200).send(req.body.challenge);
  } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
    res.sendStatus(204);

    console.log(`${req.body.subscription.type} notifications revoked!`);
    console.log(`reason: ${req.body.subscription.status}`);
    console.log(
      `condition: ${JSON.stringify(req.body.subscription.condition, null, 4)}`
    );
  } else {
    res.sendStatus(204);
    console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
  }
});

app.listen(port, () => {
  console.log(`Montou Timer Backend listening on port ${port}!`);
});
