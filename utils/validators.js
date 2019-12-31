const {body} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Email is incorrect')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value});
                if (user) {
                    return Promise.reject('A user with this email already exists');
                }

                return true;
            } catch (e) {
                console.log(e);
            }
        }).normalizeEmail(),
    body('password', 'Password should contain more than 5 symbols')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Password and confirm are different!')
            }

            return true;
        }).trim(),
    body('name', 'Name should contain more than 2 symbols')
        .isLength({min: 3})
        .trim(),
];

exports.loginValidators = [
    body('email')
        .isEmail()
        .withMessage('Email is incorrect')
        .custom(async (value, req) => {
            try {
                const user = await User.findOne({email: value});
                if (!user) {
                    return Promise.reject('A user with this email does not exists');
                }

                return true;
            } catch (e) {
                console.log(e);
            }
        })
        .trim(),
    body('password', 'Password is incorrect')
        .isAlphanumeric()
        .trim(),
];

exports.courseValidators = [
    body('title', 'The title should contain more than 3 symbols')
        .isLength({ min: 3 })
        .trim(),
    body('price', 'Enter correct price').isNumeric(),
    body('image', 'Enter correct image url').isURL(),
];
