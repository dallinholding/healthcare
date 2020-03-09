const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

admin.initializeApp();

const db = admin.firestore();

/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
const createProfile = (userRecord, context) => {
  const { email, uid } = userRecord;

  return db
    .collection("users")
    .doc(uid)
    .set({ email })
    .catch(console.error);
};

const accountSid = "AC89f20deff61195f655bb475b1c59b229";
const authToken = "5b3ca36fc9d5fcdd97f5f76ac46ca75d";
const client = new twilio(accountSid, authToken);

const sendSMS = (to, body) => {
  client.messages.create({
    body: body,
    to: "+1" + to,
    from: "+18302754263"
  });
};

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile),
  // sendReminder: functions.pubsub.schedule("every day 09:00").onRun(context => {
  //   sendSMS(
  //     "8015413344",
  //     "Hey, do your survey. https://healthcare-749ac.web.app"
  //   );
  //   return null;
  // }),
  sendTwilio: functions.https.onCall((data, context) => {
    sendSMS(data.to, data.body);
    return "SMS Sent";
  })
};
