"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptainLogin = exports.CaptainRegister = exports.UpdateProfile = exports.CheckAuth = exports.forgotPassword = exports.logout = exports.UserLogin = exports.UserRegister = void 0;
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const User_service_1 = require("../service/User.service");
const express_validator_1 = require("express-validator");
const Admin_service_1 = require("../service/Admin.service");
const UserRegister = async (req, res) => {
    console.log("Received Request Body:", req.body);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, phone } = req.body;
    try {
        const user = await (0, User_service_1.createUser)(fullname, email, password, phone, res);
        return res.status(200).json({
            user,
            message: "User Created Successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error during user registration:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};
exports.UserRegister = UserRegister;
const UserLogin = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log("Received Data:", req.body);
    const { email, password } = req.body;
    try {
        const user = await (0, User_service_1.LoginService)(email, password, res);
        return res.status(200).json({
            user,
            message: "User Login Successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error during user registration:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
};
exports.UserLogin = UserLogin;
const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
        });
        // Send a success response
        return res
            .status(200)
            .json({ success: true, message: "Logout Successfully" });
    }
    catch (error) {
        // Handle errors gracefully
        console.error("Logout Error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    const { email, fullname, newPassword } = req.body;
    try {
        const response = await (0, User_service_1.forgotPasswordService)(email, fullname, newPassword);
        return res.status(201).send(response);
    }
    catch (error) {
        return res.status(400).send({ success: false, message: error.message });
    }
};
exports.forgotPassword = forgotPassword;
const CheckAuth = async (req, res) => {
    try {
        let userid = req.id;
        const user = await UserSchema_1.default.findById(userid).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "User is not found",
                success: false,
            });
        }
        return res.status(200).json({ user, success: true });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.CheckAuth = CheckAuth;
// update profile
const UpdateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { fullname, email, address, city, country, phone, profilePicture } = req.body;
        const user = await (0, User_service_1.UpdateService)(userId, fullname, email, address, city, country, phone, profilePicture);
        return res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.UpdateProfile = UpdateProfile;
//  Admin Authentication
const CaptainRegister = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, phone } = req.body;
    try {
        const captain = await (0, Admin_service_1.registerCaptainService)(fullname, email, password, phone, res);
        return res.status(200).json({
            captain,
            message: "User Created Successfully",
            success: true,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.CaptainRegister = CaptainRegister;
const CaptainLogin = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const captain = await (0, Admin_service_1.loginCaptainService)(email, password, res);
        if (!captain) {
            return res
                .status(400)
                .json({ message: "Captain not found", success: false });
        }
        return res.status(200).json({
            captain,
            message: `Welcome Back ${captain.fullname}`,
            success: true,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message, success: false });
    }
};
exports.CaptainLogin = CaptainLogin;
