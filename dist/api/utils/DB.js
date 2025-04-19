"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// db.js
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
const connectDB = async () => {
    try {
        const dbUri = process.env.MONGO_URl;
        if (!dbUri) {
            throw new Error("MONGO_URL is not defined in environment variables.");
        }
        await mongoose_1.default
            .connect(dbUri)
            .then(() => {
            console.log("✅ Database connection successful.");
        })
            .catch((error) => {
            console.error(`❌ Database connection error: ${error.message}`);
        });
    }
    catch (error) {
        console.error(`❌ Database connection error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};
exports.default = connectDB;
