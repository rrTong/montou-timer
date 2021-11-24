import crypto from "crypto";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 8080;

// Notification request headers
const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP =
  "Twitch-Eventsub-Message-Timestamp".toLowerCase();
const TWITCH_MESSAGE_SIGNATURE =
  "Twitch-Eventsub-Message-Signature".toLowerCase();
const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
const MESSAGE_TYPE_NOTIFICATION = "notification";
const MESSAGE_TYPE_REVOCATION = "revocation";

// Prepend this string to the HMAC that you create from the message
const HMAC_PREFIX = "sha256=";

app.use(express.json());

app.post("/eventsub", (req, res) => {
  let secret = getSecret();
  let message = getHmacMessage(req);
  let hmac = HMAC_PREFIX + getHmac(secret, message);

  if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
    if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
      // TODO: Do something with event's data.
      console.log(`Event type: ${req.body.subscription.type}`);
      console.log(JSON.stringify(req.body.event, null, 4));
      res.sendStatus(204);
    } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
      res.status(200).send(req.body.challenge);
    } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
      console.log(`${req.body.subscription.type} notifications revoked!`);
      console.log(`reason: ${req.body.subscription.status}`);
      console.log(
        `condition: ${JSON.stringify(req.body.subscription.condition, null, 4)}`
      );
      res.sendStatus(204);
    } else {
      console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
      res.sendStatus(204);
    }
  } else {
    console.log("verifyMessage false");
    res.sendStatus(403);
  }
});

app.listen(port, () => {
  console.log(`Montou Timer Backend listening on port ${port}!`);
});

const getSecret = () => {
  return process.env.CLIENT_SECRET;
};

// Build the message used to get the HMAC.
const getHmacMessage = (request) => {
  return (
    request.headers[TWITCH_MESSAGE_ID] +
    request.headers[TWITCH_MESSAGE_TIMESTAMP] +
    JSON.stringify(request.body)
  );
};

// Get the HMAC.
const getHmac = (secret, message) => {
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
};

// Verify whether your signature matches Twitch's signature.
const verifyMessage = (hmac, verifySignature) => {
  return crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(verifySignature)
  );
};
