const { body } = require('express-validator');

exports.propertyValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('propertyType')
    .isIn(['Apartment', 'Villa', 'Independent House', 'PG', 'Studio', 'Commercial'])
    .withMessage('Invalid property type')
];
