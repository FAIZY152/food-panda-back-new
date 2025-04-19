"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cloudinary_1 = __importDefault(require("../utils/Cloudinary"));
const CloudinaryImage = async (file) => {
    try {
        let base64 = Buffer.from(file.buffer).toString("base64");
        let dataUri = `data:${file.mimetype};base64,${base64}`;
        const updateResponse = await Cloudinary_1.default.uploader.upload(dataUri, {
            folder: "food-panda",
        });
        return updateResponse.secure_url;
    }
    catch (error) {
        console.log(error.message);
        throw new Error("Image upload failed");
    }
};
exports.default = CloudinaryImage;
