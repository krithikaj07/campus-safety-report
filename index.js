const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setAdminStatus = functions.https.onCall(async (data, context) => {
  // Check if the user making the request is an admin.
  if (context.auth?.token.isAdmin !== true) {
    return {
      error: 'Request is not authorized.  Only admins can set admin status.',
    };
  }

  // Get the UID of the user to make an admin.
  const uid = data.uid;

  if (!uid) {
    return {
      error: 'Please provide a user ID (uid).',
    };
  }

  try {
    // Set the custom claim 'isAdmin' to true.
    await admin.auth().setCustomUserClaims(uid, {
      isAdmin: true,
    });
    return {
      message: `Successfully set admin status for user ${uid}`,
    };
  } catch (error) {
    return {
      error: `Error setting admin status: ${error.message}`,
    };
  }
});