"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashedPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashedPassword = async (password) => {
    try {
        // Generate a salt with 10 rounds (or adjust based on security needs)
        const salt = await bcrypt_1.default.genSalt(10);
        // Hash the password using the generated salt
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        throw new Error("Error hashing password");
    }
};
exports.hashedPassword = hashedPassword;
const comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        // Compare the plain password with the hashed password
        const isMatch = await bcrypt_1.default.compare(plainPassword, hashedPassword);
        return isMatch;
    }
    catch (error) {
        throw new Error("Error comparing passwords");
    }
};
exports.comparePasswords = comparePasswords;
