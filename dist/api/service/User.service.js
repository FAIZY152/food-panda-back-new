"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateService = exports.forgotPasswordService = exports.LoginService = exports.createUser = void 0;
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const GenerateToken_1 = require("../utils/GenerateToken");
const HashPasswordUtil_1 = require("../utils/HashPasswordUtil");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Cloudinary_1 = __importDefault(require("../utils/Cloudinary"));
const createUser = async (fullname, email, password, phone, res) => {
    let user = await UserSchema_1.default.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const hashPassword = await (0, HashPasswordUtil_1.hashedPassword)(password);
    user = await UserSchema_1.default.create({
        fullname,
        email,
        password: hashPassword,
        phone,
    });
    await (0, GenerateToken_1.GenerateToken)(res, user);
    return UserSchema_1.default.findOne({ email }).select("-password");
};
exports.createUser = createUser;
const LoginService = async (email, password, res) => {
    const user = await UserSchema_1.default.findOne({ email });
    if (!user) {
        throw new Error("Email not found");
    }
    const IsMatch = await (0, HashPasswordUtil_1.comparePasswords)(password, user.password);
    if (!IsMatch) {
        throw new Error("Password is not correct");
    }
    await (0, GenerateToken_1.GenerateToken)(res, user);
    user.lastLogin = new Date();
    await user.save(); // Save the last login update
    return UserSchema_1.default.findOne({ email }).select("-password");
};
exports.LoginService = LoginService;
const forgotPasswordService = async (email, fullname, newPassword) => {
    if (!email) {
        throw new Error("E-mail is Required!");
    }
    if (!fullname) {
        throw new Error("Your Full Name is Required!");
    }
    if (!newPassword) {
        throw new Error("Write The New Password!");
    }
    const user = await UserSchema_1.default.findOne({ email, fullname });
    if (!user) {
        throw new Error("Email and Full Name is not correct");
    }
    const hashPassword = await bcrypt_1.default.hash(newPassword, 10);
    await UserSchema_1.default.findByIdAndUpdate(user._id, { password: hashPassword });
    return { success: true, message: "Password Reset Successfully" };
};
exports.forgotPasswordService = forgotPasswordService;
const UpdateService = async (userId, fullname, email, address, city, country, phone, profilePicture) => {
    let cloudResponse;
    if (profilePicture) {
        cloudResponse = await Cloudinary_1.default.uploader.upload(profilePicture);
        profilePicture = cloudResponse.secure_url; // Use the uploaded image URL
    }
    const updatedData = {
        fullname,
        email,
        address,
        city,
        phone,
        country,
        profilePicture,
    };
    return await UserSchema_1.default.findByIdAndUpdate(userId, updatedData, {
        new: true,
    }).select("-password");
};
exports.UpdateService = UpdateService;
