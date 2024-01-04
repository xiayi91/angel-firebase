// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, collection, getDocs } = require("firebase-admin/firestore");

initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({ uppercase }, { merge: true });
});

exports.getForumsByLanguage = onRequest(async (request, response) => {
  try {
    const languageCode = request.query.language; // 获取 language code，作为查询参数传递
    if (!languageCode) {
      response.status(400).send('Language code is required.');
      return;
    }

    const forumsCollection = await getFirestore().collection("forums")
    const forumsSnapshot = await forumsCollection.get();

    const forumsList = [];

    forumsSnapshot.forEach((doc) => {
      const documentId = doc.id;
      const languageField = languageCode;

      // 检查文档是否包含指定语言的字段
      if (doc.data()[languageField]) {
        const value = doc.data()[languageField];
        forumsList.push({ forumId: documentId, [languageCode]: value });
      }
    });

    console.log(forumsList); // 注意这里使用 console.log() 打印日志，而不是 print()，你可以根据需要进行修改

    response.status(200).json(forumsList);
  } catch (error) {
    console.error('Error fetching forums:', error);
    response.status(500).send('Internal Server Error');
  }
});