import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';

// Memory store fallback when MongoDB Atlas is disconnected/offline
export const localUsers = new Map();

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret');
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = null;

        if (mongoose.connection.readyState === 1) {
            try {
                user = await userModel.findOne({ email }).maxTimeMS(3000);
            } catch (dbError) {
                console.log("MongoDB query error, fallback to memory:", dbError.message);
            }
        }

        if (!user) {
            user = localUsers.get(email);
        }

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for user Register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // validating email format & password length
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (at least 8 characters)" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = null;
        let userId = Date.now().toString();

        if (mongoose.connection.readyState === 1) {
            try {
                const exists = await userModel.findOne({ email }).maxTimeMS(3000);
                if (exists) {
                    return res.json({ success: false, message: 'User already exists' });
                }
                const newUser = new userModel({
                    name,
                    email,
                    password: hashedPassword,
                    cartData: {}
                });
                user = await newUser.save();
                userId = user._id;
            } catch (dbError) {
                console.log("MongoDB save error, fallback to local memory store:", dbError.message);
            }
        }

        if (!user) {
            if (localUsers.has(email)) {
                return res.json({ success: false, message: 'User already exists' });
            }
            user = { _id: userId, name, email, password: hashedPassword, cartData: {} };
            localUsers.set(email, user);
        }

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET || 'secret');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin };