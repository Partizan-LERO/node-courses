const {Router} = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = Router();

function mapCartItems(cart) {
    return cart.items.map((c) => ({
        ...c.course_id._doc,
        id: c.course_id.id,
        count: c.count
    }));
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0);
}

router.post('/add', auth, async (req, res, next) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);

    res.redirect('/cart');
});

router.delete('/remove/:id', auth, async (req, res) => {
   await req.user.removeFromCart(req.params.id);
   const user = await req.user.populate('cart.items.course_id').execPopulate();

   const courses = mapCartItems(user.cart);

   const cart = {
        courses,
        price: computePrice(courses),
   };

   res.json(cart);
});

router.get('/', auth, async (req, res) => {
    const user = await req.user.populate('cart.items.course_id').execPopulate();
    const courses = mapCartItems(user.cart);

    res.render('cart', {
        isCart: true,
        title: 'Cart',
        courses,
        price: computePrice(courses),
    });
});

module.exports = router;