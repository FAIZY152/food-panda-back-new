"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleResturentService = exports.GetOrderService = exports.createRestaurantService = void 0;
const ImageUpload_1 = __importDefault(require("../helper/ImageUpload"));
const OrderSchema_1 = __importDefault(require("../models/OrderSchema"));
const ResturentSchema_1 = __importDefault(require("../models/ResturentSchema"));
const createRestaurantService = async (userId, resturentName, city, country, deliveryPrice, deliveryTime, cusines, file) => {
    if (!file) {
        throw new Error("Restaurant image is required");
    }
    // Check if user already has a restaurant
    const existingRestaurant = await ResturentSchema_1.default.findOne({ user: userId });
    if (existingRestaurant) {
        throw new Error("Restaurant already exists for this user");
    }
    // Convert cuisines from comma-separated string to an array
    const cuisinesArray = cusines.split(",").map((cuisine) => cuisine.trim());
    // Upload image to Cloudinary
    const imageUrl = await (0, ImageUpload_1.default)(file);
    // Create restaurant entry in database
    const restaurant = await ResturentSchema_1.default.create({
        user: userId,
        resturentName,
        city,
        country,
        deliveryTime,
        cusines: cuisinesArray,
        deliveryPrice,
        imageFile: imageUrl,
    });
    return restaurant;
};
exports.createRestaurantService = createRestaurantService;
const GetOrderService = async (userId) => {
    const resturent = await ResturentSchema_1.default.findOne({ user: userId });
    if (!resturent)
        throw new Error("No Restaurant Found");
    return await OrderSchema_1.default.find({ resturent: resturent._id })
        .populate("user")
        .populate("resturent");
};
exports.GetOrderService = GetOrderService;
const GetSingleResturentService = async (restaurantId) => {
    const resturent = await ResturentSchema_1.default.findById(restaurantId).populate({
        path: "menu",
        options: { createdAt: -1 },
    });
    if (!resturent)
        throw new Error("Restaurant Not Found");
    return resturent;
};
exports.GetSingleResturentService = GetSingleResturentService;
