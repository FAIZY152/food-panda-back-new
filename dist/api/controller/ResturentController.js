"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleResturent = exports.searchByCuisines = exports.searchByCityOrRestaurantName = exports.searchByLocation = exports.updateStatus = exports.GetOrders = exports.UpdateResturent = exports.GetResturent = exports.CreateResturent = void 0;
const ResturentSchema_1 = __importDefault(require("../models/ResturentSchema"));
const ImageUpload_1 = __importDefault(require("../helper/ImageUpload"));
const OrderSchema_1 = __importDefault(require("../models/OrderSchema"));
const RestaurentSchema_1 = require("../schema/RestaurentSchema");
const Restaurent_service_1 = require("../service/Restaurent.service");
const CreateResturent = async (req, res) => {
    try {
        // Validate request body using Zod
        RestaurentSchema_1.createRestaurantSchema.parse(req.body);
        const { resturentName, city, country, deliveryPrice, deliveryTime, cusines, } = req.body;
        const file = req.file;
        const restaurant = await (0, Restaurent_service_1.createRestaurantService)(req.id, resturentName, city, country, deliveryPrice, deliveryTime, cusines, file);
        return res.status(200).json({
            message: "Restaurant Created Successfully",
            success: true,
            restaurant,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message, success: false });
    }
};
exports.CreateResturent = CreateResturent;
const GetResturent = async (req, res) => {
    try {
        console.log("Fetching restaurant for user:", req.id);
        const resturent = await ResturentSchema_1.default.findOne({ user: req.id }).populate("menu");
        if (!resturent) {
            return res.status(400).json({
                message: "No Resturent Found",
                success: false,
                resturent: null,
            });
        }
        return res.status(200).json({
            resturent,
            success: true,
        });
    }
    catch (error) {
        console.error("Error fetching restaurant:", error);
        return res.status(500).json({
            message: "Error Occured",
            success: false,
        });
    }
};
exports.GetResturent = GetResturent;
const UpdateResturent = async (req, res) => {
    try {
        const { resturentName, city, country, deliveryPrice, deliveryTime, cusines, } = req.body;
        let file = req.file;
        const resturent = await ResturentSchema_1.default.findOne({ user: req.id });
        if (!resturent) {
            return res.status(400).json({
                message: "No Resturent Found",
                success: false,
            });
        }
        const cuisinesArray = cusines
            .split(",")
            .map((cuisine) => cuisine.trim());
        resturent.resturentName = resturentName;
        resturent.city = city;
        resturent.country = country;
        resturent.deliveryTime = deliveryTime;
        resturent.deliveryPrice = deliveryPrice;
        resturent.cusines = cuisinesArray;
        if (file) {
            const imageUrl = await (0, ImageUpload_1.default)(file);
            resturent.imageFile = imageUrl;
        }
        await resturent.save();
        return res.status(200).json({
            message: "Resturent Updated Successfully",
            success: true,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error Occured to update Resturent",
            success: false,
        });
    }
};
exports.UpdateResturent = UpdateResturent;
const GetOrders = async (req, res) => {
    try {
        const orders = await (0, Restaurent_service_1.GetOrderService)(req.id);
        return res.status(200).json({
            success: true,
            orders,
            message: "Orders Fetched Successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};
exports.GetOrders = GetOrders;
const updateStatus = async (req, res) => {
    try {
        let { orderid } = req.params;
        let { status } = req.body;
        // order ko le aww konsa order ka status update karna ha
        const order = await OrderSchema_1.default.findById(orderid);
        if (!order) {
            return res.status(400).json({
                message: "No Order Found",
                success: false,
            });
        }
        order.status = status;
        await order.save();
        return res.status(200).json({
            message: "Status Updated Successfully",
            success: true,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error Occured to update Status",
            success: false,
        });
    }
};
exports.updateStatus = updateStatus;
const searchByLocation = async (req, res) => {
    const { mainSearch } = req.query;
    try {
        if (typeof mainSearch !== "string") {
            return res.status(400).json({ message: "searchQuery is required" });
        }
        const searchRegex = new RegExp(mainSearch, "i"); // Case-insensitive search
        // Search for either restaurantName or city
        const restaurants = await ResturentSchema_1.default.find({
            $or: [{ resturentName: searchRegex }, { country: searchRegex }],
        });
        console.log("Search Query:", { mainSearch });
        return res.status(200).json({
            success: true,
            data: restaurants,
        });
    }
    catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Error fetching restaurants", error });
    }
};
exports.searchByLocation = searchByLocation;
const searchByCityOrRestaurantName = async (req, res) => {
    const { searchQuery } = req.query; // This will be the single input for both city and restaurantName
    try {
        if (typeof searchQuery !== "string") {
            return res.status(400).json({ message: "searchQuery is required" });
        }
        const searchRegex = new RegExp(searchQuery, "i"); // Case-insensitive search
        // Search for either restaurantName or city
        const restaurants = await ResturentSchema_1.default.find({
            $or: [
                { resturentName: searchRegex },
                { city: searchRegex },
                { cusines: searchRegex },
            ],
        });
        console.log("Search Query:", { searchQuery });
        console.log("Found Restaurants:", restaurants);
        return res.status(200).json({
            success: true,
            data: restaurants,
        });
    }
    catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Error fetching restaurants", error });
    }
};
exports.searchByCityOrRestaurantName = searchByCityOrRestaurantName;
const searchByCuisines = async (req, res) => {
    const { cuisines } = req.body;
    try {
        let query = {};
        if (cuisines && cuisines.length > 0) {
            query.cusines = { $in: cuisines };
        }
        const restaurants = await ResturentSchema_1.default.find(query);
        console.log("Cusine body :", cuisines);
        return res.status(200).json({
            success: true,
            data: restaurants,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching restaurants",
        });
    }
};
exports.searchByCuisines = searchByCuisines;
const GetSingleResturent = async (req, res) => {
    try {
        const resturent = await (0, Restaurent_service_1.GetSingleResturentService)(req.params.resturenId);
        return res.status(200).json({
            success: true,
            message: "Restaurant Fetched Successfully",
            resturent,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};
exports.GetSingleResturent = GetSingleResturent;
