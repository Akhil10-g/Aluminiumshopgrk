const express = require('express');
const { getHomepage, updateHomepage } = require('../controllers/homepageController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getHomepage);
router.put(
  '/',
  verifyToken,
  upload.fields([
    { name: 'founderImage', maxCount: 1 },
    { name: 'workImages', maxCount: 10 },
    { name: 'serviceImages', maxCount: 100 },
    { name: 'materialImages', maxCount: 30 },
  ]),
  updateHomepage
);

module.exports = router;
