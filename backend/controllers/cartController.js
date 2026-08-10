import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import { localUsers } from "./userController.js";

// Helper to find user in memory store
const findLocalUserById = (userId) => {
    for (let u of localUsers.values()) {
        if (u._id === userId || u._id?.toString() === userId) {
            return u;
        }
    }
    return null;
};

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;
        let userData = null;

        if (mongoose.connection.readyState === 1) {
            try {
                userData = await userModel.findById(userId).maxTimeMS(3000);
            } catch (err) {}
        }

        if (!userData) {
            userData = findLocalUserById(userId) || { cartData: {} };
        }

        let cartData = userData.cartData || {};

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        if (mongoose.connection.readyState === 1 && userData._id) {
            try {
                await userModel.findByIdAndUpdate(userId, { cartData });
            } catch (err) {}
        }
        userData.cartData = cartData;

        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// update user cart
const updateToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        let userData = null;

        if (mongoose.connection.readyState === 1) {
            try {
                userData = await userModel.findById(userId).maxTimeMS(3000);
            } catch (err) {}
        }

        if (!userData) {
            userData = findLocalUserById(userId) || { cartData: {} };
        }

        let cartData = userData.cartData || {};
        if (!cartData[itemId]) cartData[itemId] = {};
        cartData[itemId][size] = quantity;

        if (mongoose.connection.readyState === 1 && userData._id) {
            try {
                await userModel.findByIdAndUpdate(userId, { cartData });
            } catch (err) {}
        }
        userData.cartData = cartData;

        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        let userData = null;

        if (mongoose.connection.readyState === 1) {
            try {
                userData = await userModel.findById(userId).maxTimeMS(3000);
            } catch (err) {}
        }

        if (!userData) {
            userData = findLocalUserById(userId) || { cartData: {} };
        }

        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateToCart, getUserCart };