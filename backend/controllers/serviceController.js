const Service = require('../models/Service');

// ✅ Create a new service (Admin only)
exports.createService = async (req, res) => {
  try {
    console.log('Incoming service data:', req.body);
    console.log('Authenticated user:', req.user);

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admins can add services' });
    }

    const { name, description, price, category } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      price === undefined || price === '' ||
      !category?.trim()
    ) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const service = new Service({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      provider: req.user.id
    });

    await service.save();
    res.status(201).json({ msg: 'Service created', service });
  } catch (err) {
    console.error('❌ Error creating service:', err.message);
    res.status(400).json({ msg: 'Error creating service', error: err.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('provider', 'name email');
    res.json(services);
  } catch (err) {
    console.error('❌ Error fetching services:', err.message);
    res.status(500).json({ msg: 'Failed to fetch services', error: err.message });
  }
};

// ✅ Delete service (Admin only)
exports.deleteService = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admins can delete services' });
    }

    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    res.json({ msg: 'Service deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting service:', err.message);
    res.status(500).json({ msg: 'Failed to delete service', error: err.message });
  }
};

// ✅ Update service (Admin only)
exports.updateService = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admins can update services' });
    }

    const { id } = req.params;
    const { name, price, description, category } = req.body;

    const updated = await Service.findByIdAndUpdate(
      id,
      { name, price, description, category },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    res.json({ msg: 'Service updated successfully', service: updated });
  } catch (err) {
    console.error('❌ Error updating service:', err.message);
    res.status(500).json({ msg: 'Failed to update service', error: err.message });
  }
};
