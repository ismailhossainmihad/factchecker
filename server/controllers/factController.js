const FactCheck = require('../models/FactCheck');
const { validationResult } = require('express-validator');

// @desc    Create a new fact
// @route   POST /api/facts
// @access  Private
exports.createFact = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, category, verdict } = req.body;
    const fact = await FactCheck.create({
      title,
      description,
      category,
      verdict,
      createdBy: req.user._id,
    });
    res.status(201).json(fact);
  } catch (err) {
    next(err);
  }
};

// @desc    Get facts with optional search and filters
// @route   GET /api/facts
// @access  Public
exports.getFacts = async (req, res, next) => {
  try {
    const { search, category, verdict, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query.category = category;
    }
    if (verdict) {
      query.verdict = verdict;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const facts = await FactCheck.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await FactCheck.countDocuments(query);
    res.json({
      data: facts,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single fact by ID
// @route   GET /api/facts/:id
// @access  Public
exports.getFactById = async (req, res, next) => {
  try {
    const fact = await FactCheck.findById(req.params.id).populate(
      'createdBy',
      'username email'
    );
    if (!fact) {
      return res.status(404).json({ message: 'Fact not found' });
    }
    res.json(fact);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a fact
// @route   PUT /api/facts/:id
// @access  Private (owner only)
exports.updateFact = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const fact = await FactCheck.findById(req.params.id);
    if (!fact) {
      return res.status(404).json({ message: 'Fact not found' });
    }
    if (fact.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const { title, description, category, verdict } = req.body;
    fact.title = title;
    fact.description = description;
    fact.category = category;
    fact.verdict = verdict;
    await fact.save();
    res.json(fact);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a fact
// @route   DELETE /api/facts/:id
// @access  Private (owner only)
exports.deleteFact = async (req, res, next) => {
  try {
    const fact = await FactCheck.findById(req.params.id);
    if (!fact) {
      return res.status(404).json({ message: 'Fact not found' });
    }
    if (fact.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await fact.deleteOne();
    res.json({ message: 'Fact deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get facts created by the authenticated user
// @route   GET /api/facts/mine
// @access  Private
exports.getMyFacts = async (req, res, next) => {
  try {
    const facts = await FactCheck.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(facts);
  } catch (err) {
    next(err);
  }
};