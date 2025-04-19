"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
dotenv_1.default.config();
const IsAuthenticated = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token)
            return res
                .status(401)
                .json({ error: "User is Not Authenticated", success: false });
        const jwtToken = process.env.JWT_TOKEN;
        if (!jwtToken) {
            throw new Error("JWT token is not defined");
        }
        // verify the token with decode
        const decode = (await jsonwebtoken_1.default.verify(token, jwtToken));
        if (!decode) {
            return res
                .status(401)
                .json({ error: "User is Not Authenticated", success: false });
        }
        req.id = decode.userid;
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ error: "User is Not Authenticated", success: false });
    }
};
// Adjust the path as needed
const IsAdmin = async (req, res, next) => {
    try {
        // Get token from headers or cookies
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res
                .status(401)
                .json({ error: "User is Not Authenticated", success: false });
        }
        const jwtToken = process.env.JWT_TOKEN;
        if (!jwtToken) {
            throw new Error("JWT token is not defined");
        }
        // Verify the token
        const decode = jsonwebtoken_1.default.verify(token, jwtToken);
        // Attach user ID from decoded token to request
        req.id = decode.userid;
        // Find the user in the database
        const user = await UserSchema_1.default.findById(req.id);
        if (!user || !user.isAdmin) {
            return res
                .status(403)
                .json({ error: "Access Denied: Admin Only", success: false });
        }
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ error: "User is Not Authenticated", success: false });
    }
};
exports.IsAdmin = IsAdmin;
exports.default = IsAuthenticated;
