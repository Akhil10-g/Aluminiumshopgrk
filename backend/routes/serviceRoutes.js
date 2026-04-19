const express = require('express');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');
const { addService, getServices, updateService, deleteService } = require('../controllers/serviceController');

const router = express.Router();

router.get('/', getServices);
router.post('/', verifyToken, upload.single('image'), addService);
router.put('/:id', verifyToken, upload.single('image'), updateService);
router.delete('/:id', verifyToken, deleteService);

module.exports = router;
