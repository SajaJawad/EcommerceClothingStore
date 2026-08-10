import orderModel from './../models/orderModel.js';
import userModel from './../models/userModel.js';
import Stripe from 'stripe';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import { localUsers } from './userController.js';

dotenv.config();

// global variables
const currency = 'inr';
const deliveryCharge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

// local in-memory fallback for orders when MongoDB is offline
export const localOrders = [];

// placing orders using COD method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            _id: Date.now().toString(),
            userId,
            items,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
            status: 'Order Placed'
        };

        if (mongoose.connection.readyState === 1) {
            try {
                const newOrder = new orderModel(orderData);
                await newOrder.save();
                await userModel.findByIdAndUpdate(userId, { cartData: {} });
            } catch (dbErr) {
                console.log("MongoDB order save error, fallback to memory:", dbErr.message);
            }
        }

        localOrders.push(orderData);

        // Clear cart for local user if offline
        for (let u of localUsers.values()) {
            if (u._id === userId || u._id?.toString() === userId) {
                u.cartData = {};
            }
        }

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// placing orders using Stripe method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            _id: Date.now().toString(),
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now(),
            status: 'Order Placed'
        };

        if (mongoose.connection.readyState === 1) {
            try {
                const newOrder = new orderModel(orderData);
                await newOrder.save();
            } catch (dbErr) {
                console.log("MongoDB order save error, fallback to memory:", dbErr.message);
            }
        }

        localOrders.push(orderData);

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        let session_url = `${origin}/orders`;
        try {
            const session = await stripe.checkout.sessions.create({
                success_url: `${origin}/verify?success=true&orderId=${orderData._id}`,
                cancel_url: `${origin}/verify?success=false&orderId=${orderData._id}`,
                line_items,
                mode: 'payment'
            });
            session_url = session.url;
        } catch (stripeErr) {
            console.log("Stripe session error, fallback URL:", stripeErr.message);
        }

        res.json({ success: true, session_url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (success === "true") {
            if (mongoose.connection.readyState === 1) {
                try {
                    await orderModel.findByIdAndUpdate(orderId, { payment: true });
                    await userModel.findByIdAndUpdate(userId, { cartData: {} });
                } catch (dbErr) {}
            }
            const localOrder = localOrders.find(o => o._id === orderId);
            if (localOrder) localOrder.payment = true;

            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {
    res.json({ success: false, message: "Razorpay not implemented" });
};

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        let orders = [];
        if (mongoose.connection.readyState === 1) {
            try {
                orders = await orderModel.find({}).maxTimeMS(3000);
            } catch (dbErr) {
                console.log("MongoDB fetch orders error, fallback to memory:", dbErr.message);
            }
        }
        if (!orders || orders.length === 0) {
            orders = localOrders;
        }

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User orders data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        let orders = [];

        if (mongoose.connection.readyState === 1) {
            try {
                orders = await orderModel.find({ userId }).maxTimeMS(3000);
            } catch (dbErr) {
                console.log("MongoDB fetch user orders error, fallback to memory:", dbErr.message);
            }
        }

        if (!orders || orders.length === 0) {
            orders = localOrders.filter(o => o.userId === userId || o.userId?.toString() === userId);
        }

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// update order status for Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (mongoose.connection.readyState === 1) {
            try {
                await orderModel.findByIdAndUpdate(orderId, { status });
            } catch (dbErr) {}
        }
        const localOrder = localOrders.find(o => String(o._id) === String(orderId));
        if (localOrder) localOrder.status = status;

        res.json({ success: true, message: 'Status Updated' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe };