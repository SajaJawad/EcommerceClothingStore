import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

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

        console.log('reqqq', req.body);
        

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(
            (item) => item !== undefined
        );

        let imagesUrl = await Promise.all(
            images.map(async (image) => {
                let result = await cloudinary.uploader.upload(image.path, {
                    resource_type: "image",
                });
                return result.secure_url;
            })
        );

        console.log('sssss', imagesUrl);

        // to save the product data in the mongo database

        const productData = {
            name,
            description,
            price: Number(price), // converting price to number
            category,
            subCategory,
            bestseller: bestseller === "true" ? true : false, // converting bestseller to boolean
            sizes: JSON.parse(sizes), //
            image: imagesUrl,
            date: Date.now(),
        };

        console.log(productData);
        console.log("Uploaded image URLs:", imagesUrl);
        console.log("req.files", req.files);

        const product = new productModel(productData);
        await product.save(); // saving the product in the database

        res.json({
            success: true,
            message: "Product added successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for list products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
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
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

};

export { addProduct, listProducts, removeProduct, singleProduct };