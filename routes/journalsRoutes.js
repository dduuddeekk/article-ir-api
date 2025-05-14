const express = require('express');
const router = express.Router();
const { searchJournals } = require('../controllers/journalsController');

router.get('/search', searchJournals);

module.exports = router;