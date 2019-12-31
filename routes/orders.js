const {Router} = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');

const router = Router();

router.post('/', auth, async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.items.course_id').execPopulate();

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {
                ...i.course_id._doc
            }
        }));

        const order = new Order({
            user: {
                name: req.user.name,
                user_id: req.user
            },
            courses,
        });

        await order.save();
        await req.user.clearCart();

        res.redirect('/orders');
    } catch (e) {
        console.log(e);
    }
});


router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({'user.user_id': req.user._id})
            .populate('user.user_id');

        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map((o) => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        });
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;