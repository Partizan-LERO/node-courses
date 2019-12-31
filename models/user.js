const {Schema, model} = require('mongoose');

const user = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: String,
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
    password: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1,
            },
            course_id: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true,
            }
        }]
    }
});

user.methods.addToCart = function(course) {
    const items = [...this.cart.items];
    const index = items.findIndex((c) => {
       return c.course_id.toString() === course._id.toString();
    });

    if (index >= 0) {
        items[index].count += 1;
    } else {
        items.push({
           course_id: course._id,
           count: 1
        });
    }

    this.cart = {items};

    return this.save();
};

user.methods.removeFromCart = function(courseId) {
    let items = [...this.cart.items];
    const index = items.findIndex(c => c.course_id.toString() === courseId.toString());

    if (items[index].count === 1) {
        items = items.filter(i => i.course_id.toString() !== courseId.toString());
    } else {
        items[index].count -= 1;
    }

    this.cart = {items};
    return this.save();
};

user.methods.clearCart = function(courseId) {
    this.cart = {items: []};
    return this.save();
};

module.exports = model('User', user);