const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
    category: { type: String },
    price: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    customization: {
        text: { type: String, default: '' },
        color: { type: String, default: '' },
        font: { type: String, default: '' },
        size: { type: String, default: '' },
        hasImage: { type: Boolean, default: false }
    }
}, { _id: false });

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: [cartItemSchema],
    wishlist: [{
        id: String,
        category: String,
        title: String,
        price: String,
        image: String,
        src: String, // Handling both service images (image) and gallery images (src)
        alt: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
