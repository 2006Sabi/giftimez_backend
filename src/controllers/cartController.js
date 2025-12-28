const User = require('../models/User');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    const { productId, name, image, price, category, customization } = req.body;

    try {
        const user = await User.findById(req.user.id);

        // For customized products, always add as new item (don't check for duplicates)
        // For non-customized products, check if item already exists
        if (customization && (customization.text || customization.color || customization.hasImage)) {
            // Customized product - add as new item
            user.cart.push({
                productId,
                name,
                image,
                price,
                category,
                quantity: 1,
                customization
            });
        } else {
            // Non-customized product - check for duplicates
            const itemIndex = user.cart.findIndex(item =>
                item.productId === productId &&
                item.category === category &&
                !item.customization?.text &&
                !item.customization?.color &&
                !item.customization?.hasImage
            );

            if (itemIndex > -1) {
                // Item exists, update quantity
                user.cart[itemIndex].quantity += 1;
            } else {
                // Item does not exist, push new item
                user.cart.push({ productId, name, image, price, category, quantity: 1 });
            }
        }

        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:productId
// @access  Private
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    const { productId } = req.params;

    try {
        const user = await User.findById(req.user.id);
        const itemIndex = user.cart.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity = quantity;
            if (quantity <= 0) {
                user.cart.splice(itemIndex, 1);
            }
            await user.save();
            res.status(200).json(user.cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    try {
        const user = await User.findById(req.user.id);
        user.cart = user.cart.filter(item => item.productId !== productId);

        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
};
