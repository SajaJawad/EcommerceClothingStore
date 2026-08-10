import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";
import { initialProducts } from "../config/sampleProducts.js";

// Local in-memory store for products when MongoDB is offline
export let localProducts = [...initialProducts];

// function for add product
const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
        } = req.body;

        let imagesUrl = [];
        if (req.files) {
            const image1 = req.files.image1 && req.files.image1[0];
            const image2 = req.files.image2 && req.files.image2[0];
            const image3 = req.files.image3 && req.files.image3[0];
            const image4 = req.files.image4 && req.files.image4[0];

            const images = [image1, image2, image3, image4].filter(
                (item) => item !== undefined
            );

            try {
                imagesUrl = await Promise.all(
                    images.map(async (image) => {
                        let result = await cloudinary.uploader.upload(image.path, {
                            resource_type: "image",
                        });
                        return result.secure_url;
                    })
                );
            } catch (cloudErr) {
                console.log("Cloudinary upload fallback:", cloudErr.message);
                imagesUrl = ["https://via.placeholder.com/150"];
            }
        }

        if (imagesUrl.length === 0) {
            imagesUrl = ["https://via.placeholder.com/150"];
        }

        const productData = {
            _id: Date.now().toString(),
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: bestseller === "true" || bestseller === true ? true : false,
            sizes: typeof sizes === 'string' ? JSON.parse(sizes) : (sizes || []),
            image: imagesUrl,
            date: Date.now(),
        };

        if (mongoose.connection.readyState === 1) {
            try {
                const product = new productModel(productData);
                await product.save();
            } catch (dbErr) {
                console.log("MongoDB product save error:", dbErr.message);
            }
        }

        localProducts.unshift(productData);

        res.json({
            success: true,
            message: "Product added successfully",
            product: productData,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for list products
const listProducts = async (req, res) => {
    try {
        let products = [];
        if (mongoose.connection.readyState === 1) {
            try {
                products = await productModel.find({}).maxTimeMS(3000);
            } catch (error) {
                console.log("MongoDB product fetch error:", error.message);
            }
        }

        if (!products || products.length === 0) {
            products = localProducts;
        }

        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for removing product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (mongoose.connection.readyState === 1) {
            try {
                await productModel.findByIdAndDelete(id);
            } catch (dbErr) {}
        }

        localProducts = localProducts.filter(p => String(p._id) !== String(id));

        res.json({ success: true, message: "Product removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        let product = null;

        if (mongoose.connection.readyState === 1) {
            try {
                product = await productModel.findById(productId).maxTimeMS(3000);
            } catch (error) {}
        }

        if (!product) {
            product = localProducts.find(p => String(p._id) === String(productId));
        }

        res.json({ success: true, product });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProducts, removeProduct, singleProduct };