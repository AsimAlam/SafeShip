const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Get delivery person location
router.get('/delivery-person', async (req, res) => {
  try {
    const doc = await admin.firestore().collection('locations').doc('deliveryPerson').get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update delivery person location
router.post('/delivery-person', async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    await admin.firestore().collection('locations').doc('deliveryPerson').set({
      latitude,
      longitude,
    });

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
