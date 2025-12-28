const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
    const { id, category, title, price, image, src, alt } = req.body;

    try {
        const user = await User.findById(req.user.id);

        // Check if item already exists
        const exists = user.wishlist.find(item => item.id === id && item.category === category);

        if (exists) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }

        user.wishlist.push({ id, category, title, price, image, src, alt });
        await user.save();

        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/remove/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter(item => item.id !== id);

        await user.save();
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
