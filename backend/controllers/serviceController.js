const Service = require('../models/Service');

const addService = async (req, res) => {
  try {
    const title = String(req.body.title || '').trim();
    const description = String(req.body.description || '').trim();
    const imageFile = req.file;

    if (!title) {
      return res.status(400).json({ message: 'Service title is required' });
    }

    if (!description) {
      return res.status(400).json({ message: 'Service description is required' });
    }

    if (!imageFile) {
      return res.status(400).json({ message: 'Service image is required' });
    }

    const service = await Service.create({
      title,
      description,
      image: `/uploads/${imageFile.filename}`,
    });

    return res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to create service' });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({ services });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch services' });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const nextTitle = req.body.title !== undefined ? String(req.body.title || '').trim() : service.title;
    const nextDescription =
      req.body.description !== undefined ? String(req.body.description || '').trim() : service.description;

    if (!nextTitle) {
      return res.status(400).json({ message: 'Service title is required' });
    }

    if (!nextDescription) {
      return res.status(400).json({ message: 'Service description is required' });
    }

    service.title = nextTitle;
    service.description = nextDescription;

    if (req.file) {
      service.image = `/uploads/${req.file.filename}`;
    }

    const updatedService = await service.save();

    return res.status(200).json({
      message: 'Service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to update service' });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to delete service' });
  }
};

module.exports = {
  addService,
  getServices,
  updateService,
  deleteService,
};
