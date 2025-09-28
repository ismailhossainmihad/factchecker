const express = require('express');
const { body } = require('express-validator');
const {
  createFact,
  getFacts,
  getFactById,
  updateFact,
  deleteFact,
  getMyFacts,
} = require('../controllers/factController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getFacts);
router.get('/:id', getFactById);

// Protected routes
router.get('/mine', protect, getMyFacts);
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category')
      .isIn(['Politics', 'Health', 'Science', 'Technology'])
      .withMessage('Invalid category'),
    body('verdict')
      .isIn(['True', 'False', 'Misleading', 'Unverified'])
      .withMessage('Invalid verdict'),
  ],
  createFact
);
router.put(
  '/:id',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category')
      .isIn(['Politics', 'Health', 'Science', 'Technology'])
      .withMessage('Invalid category'),
    body('verdict')
      .isIn(['True', 'False', 'Misleading', 'Unverified'])
      .withMessage('Invalid verdict'),
  ],
  updateFact
);
router.delete('/:id', protect, deleteFact);

module.exports = router;