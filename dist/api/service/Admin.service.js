"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCaptainService = exports.registerCaptainService = void 0;
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const GenerateToken_1 = require("../utils/GenerateToken");
const HashPasswordUtil_1 = require("../utils/HashPasswordUtil");
const registerCaptainService = async (fullname, email, password, phone, res) => {
    const existingUser = await UserSchema_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
    }
    const hashPassword = await (0, HashPasswordUtil_1.hashedPassword)(password);
    let user = await UserSchema_1.default.create({
        fullname,
        email,
        password: hashPassword,
        phone,
        isAdmin: true,
    });
    await (0, GenerateToken_1.GenerateToken)(res, user);
    return UserSchema_1.default.findOne({ email }).select("-password");
};
exports.registerCaptainService = registerCaptainService;
const loginCaptainService = async (email, password, res) => {
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
    user.isAdmin = true; // Ensure user remains admin
    await user.save();
    return UserSchema_1.default.findOne({ email }).select("-password");
};
exports.loginCaptainService = loginCaptainService;
