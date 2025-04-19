"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenus = exports.deleteMenu = exports.editMenu = exports.addMenu = void 0;
const ImageUpload_1 = __importDefault(require("../helper/ImageUpload"));
const MenuSchema_1 = __importDefault(require("../models/MenuSchema"));
const ResturentSchema_1 = __importDefault(require("../models/ResturentSchema"));
const addMenu = async (req, res) => {
    try {
        let { name, description, price } = req.body;
        let file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Image is Required",
                success: false,
            });
        }
        const imageUrl = await (0, ImageUpload_1.default)(file);
        const menu = await MenuSchema_1.default.create({
            name,
            description,
            price,
            image: imageUrl,
        });
        // get the user resturent and add this menu to that resturent
        const resturent = await ResturentSchema_1.default.findOne({ user: req.id });
        if (resturent) {
            resturent.menu.push(menu._id);
            await resturent.save();
            //2nd way
            //   await ResturentModel.findById(resturent._id).updateOne({
            //     $push: { menu: menu._id },
            //   });
        }
        return res.status(200).json({
            message: "Menu Added Successfully",
            success: true,
            menu,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error Occured to add Menu",
            success: false,
        });
    }
};
exports.addMenu = addMenu;
const editMenu = async (req, res) => {
    try {
        let { id } = req.params;
        const { name, description, price } = req.body;
        let file = req.file;
        const menu = await MenuSchema_1.default.findById(id);
        if (!menu) {
            return res.status(404).json({
                message: "Menu not found",
                success: false,
            });
        }
        if (name)
            menu.name = name;
        if (description)
            menu.description = description;
        if (price)
            menu.price = price;
        if (file) {
            let imageUrl = await (0, ImageUpload_1.default)(file);
            menu.image = imageUrl;
        }
        return res.status(200).json({
            message: "Menu Updated Successfully",
            success: true,
            menu,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error Occured to update Menu",
            success: false,
        });
    }
};
exports.editMenu = editMenu;
const deleteMenu = async (req, res) => {
    const { restaurantId, menuId } = req.params;
    try {
        // Find the restaurant by ID and update its menu array
        const updatedResturent = await ResturentSchema_1.default.findByIdAndUpdate(restaurantId, { $pull: { menu: menuId } }, // Removes the menuId from the menu array
        { new: true } // Return the updated document
        );
        if (!updatedResturent) {
            return res
                .status(404)
                .json({ success: false, message: "Restaurant not found" });
        }
        // Delete from menu colllection
        await MenuSchema_1.default.findByIdAndDelete(menuId);
        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully",
            resturent: updatedResturent,
        });
    }
    catch (error) {
        console.error("Error deleting menu item:", error.message);
        res
            .status(500)
            .json({ success: false, message: "Failed to delete menu item" });
    }
};
exports.deleteMenu = deleteMenu;
const getMenus = async (req, res) => {
    try {
        const menus = await MenuSchema_1.default.find();
        return res.status(200).json({
            message: "Menus Fetched Successfully",
            success: true,
            menus,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error Occured to get Menus",
            success: false,
        });
    }
};
exports.getMenus = getMenus;
