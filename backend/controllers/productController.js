const Product = require('../models/Product');

const starterProducts = [
  {
    name: 'Architectural Aluminium Profile',
    category: 'Aluminium',
    price: 450,
    image:
      'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Premium ACP Sheet',
    category: 'ACP',
    price: 850,
    image:
      'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d74?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Framed Office Partition Panel',
    category: 'Partitions',
    price: 1250,
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80',
  },
];

const getProducts = async (req, res) => {
  try {
    let products = await Product.find().sort({ createdAt: -1 });

    if (products.length === 0) {
      await Product.insertMany(starterProducts);
      products = await Product.find().sort({ createdAt: -1 });
    }

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch products' });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'name, category and price are required' });
    }

    const normalizedPrice = Number(price);
    if (Number.isNaN(normalizedPrice) || normalizedPrice < 0) {
      return res.status(400).json({ message: 'price must be a valid non-negative number' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const product = await Product.create({
      name: String(name).trim(),
      category: String(category).trim(),
      price: normalizedPrice,
      image: imagePath,
      description: String(description || '').trim(),
    });

    return res.status(201).json({
      message: 'Material saved successfully',
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to save material' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Material not found' });
    }

    return res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to delete material' });
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  getProducts,
};
