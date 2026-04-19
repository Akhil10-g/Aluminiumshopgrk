const express = require('express');
const { addProduct, deleteProduct, getProducts } = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getProducts);
router.post('/', verifyToken, upload.single('image'), addProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
