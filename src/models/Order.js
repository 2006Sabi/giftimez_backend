const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: String,
            required: true
        },
        customization: {
            text: { type: String, default: '' },
            color: { type: String, default: '' },
            font: { type: String, default: '' },
            size: { type: String, default: '' },
            hasImage: { type: Boolean, default: false }
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: true // Simulating paid immediately for now
    },
    paidAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
