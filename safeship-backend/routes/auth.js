const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// User signup
router.post('/signup', async (req, res) => {
  const { email, password, dob } = req.body;

  if (isUnderage(dob)) {
    return res.status(400).json({ error: 'You must be 18 years or older to sign up.' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      dob,
      ageVerified: false,
      emailVerified: false,
    });

    res.status(201).json({ uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const isUnderage = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 18;
};

module.exports = router;
