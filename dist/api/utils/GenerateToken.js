"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenerateToken = async (res, user) => {
    try {
        const token = await jsonwebtoken_1.default.sign({ userid: user._id }, process.env.JWT_TOKEN, {
            expiresIn: "1d",
        });
        if (res) {
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            });
        }
        return token;
    }
    catch (error) {
        if (res) {
            return res.status(500).json({ message: error.message });
        }
    }
};
exports.GenerateToken = GenerateToken;
