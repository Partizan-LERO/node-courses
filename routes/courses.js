const Course = require("../models/course");
const { Router } = require('express');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { courseValidators } = require('../utils/validators');
const router = Router();

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('price title image');

        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses: courses,
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/edit', auth, async (req, res, next) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }

    try {
        const course = await Course.findById(req.params.id);

        if (!isOwner(course, req)) {
            return res.redirect('/courses');
        }

        res.render('edit', {
            title: `Edit ${course.name}`,
            course: course,
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/:id/edit', auth, courseValidators, async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${req.params.id}/edit?allow=true`)
    }

    try {
        const course = await Course.findById(req.params.id);

        if (!isOwner(course, req)) return res.redirect('/courses');

        Object.assign(course, req.body);
        await course.save();

        return res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        res.render('course', {
            layout: 'empty',
            title: course.name,
            course: course,
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/remove/:id', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        return res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;