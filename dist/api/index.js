"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const ResturentRoutes_1 = require("./routes/ResturentRoutes");
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const MenuRoute_1 = __importDefault(require("./routes/MenuRoute"));
const DB_1 = __importDefault(require("./utils/DB"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Connect to database
(0, DB_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5200;
// ✅ 1️⃣ Define Allowed Origins
const allowedOrigins = ["https://foodpandalike.vercel.app"];
// ✅ 2️⃣ Configure CORS Properly
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://foodpandalike.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});
app.use(body_parser_1.default.json({ limit: "10mb" })); // Parses JSON requests
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// ✅ 5️⃣ Sample Route to Check CORS
app.get("/api/v1/auth/cors", (req, res) => {
    res.json({ message: "CORS is working!" });
});
let backendReady = false;
app.get("/api/status", async (req, res) => {
    if (!backendReady) {
        console.log("⏳ Warming up backend...");
        // Simulate warm-up (e.g. connect to DB, load models, etc.)
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sec delay
        backendReady = true;
        console.log("✅ Backend is ready!");
    }
    res.status(200).json({ status: "ready" });
});
// ✅ 6️⃣ Define API Routes
app.use("/api/v1/auth", UserRoute_1.default);
app.use("/api/v1/resturent", ResturentRoutes_1.resturentRoute);
app.use("/api/v1/menu", MenuRoute_1.default);
app.use("/api/v1/order", orderRoute_1.default);
// ✅ 7️⃣ Global Middleware to Ensure CORS Headers are Present in All Responses
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://foodpandalike.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// ✅ 8️⃣ Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
