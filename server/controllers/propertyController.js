const { validationResult } = require('express-validator');
const Property = require('../models/Property');
require('../models/User');

// @desc    Get all approved properties with filters, search, pagination
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    const {
      city,
      location,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      bathrooms,
      furnishing,
      parking,
      sort,
      page = 1,
      limit = 9,
      q
    } = req.query;

    const query = { status: 'Approved' };

    if (city) query.city = new RegExp(city, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (propertyType) query.propertyType = new RegExp(`^${propertyType}$`, 'i');
    if (furnishing) query.furnishing = new RegExp(`^${furnishing}$`, 'i');
    if (parking !== undefined && parking !== '') query.parking = parking === 'true';
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (q && q.trim() !== '') {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
        { location: searchRegex },
        { state: searchRegex },
        { propertyType: searchRegex },
        { furnishing: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 }; // Latest by default
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price_low') sortOption = { price: 1 };
    if (sort === 'price_high') sortOption = { price: -1 };

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'fullname email phone')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Property.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'fullname email phone'
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property listing
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const property = await Property.create({
      ...req.body,
      amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
      images,
      owner: req.user.id
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property (owner or admin only)
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    const updateData = { ...req.body };
    if (req.body.amenities) updateData.amenities = JSON.parse(req.body.amenities);
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    // Editing resets status to Pending for re-review, unless admin
    if (req.user.role !== 'Admin') {
      updateData.status = 'Pending';
    }

    property = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property (owner or admin only)
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties owned by logged-in user
// @route   GET /api/properties/my/listings
// @access  Private
exports.getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error) {
    next(error);
  }
};
