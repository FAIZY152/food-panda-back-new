import express from "express";
import userRoute from "./routes/UserRoute";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { resturentRoute } from "./routes/ResturentRoutes";
import orderRoute from "./routes/orderRoute";
import menuRoute from "./routes/MenuRoute";
import connectDB from "./utils/DB";
import dotenv from "dotenv";
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5200;

const allowedOrigins = ["https://dep-app-taupe.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://dep-app-taupe.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.use(bodyParser.json({ limit: "10mb" })); // Parses JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/v1/auth/cors", (req, res) => {
  res.json({ message: "CORS is working!" });
});
let backendReady = false;

app.get("/api/status", async (req, res) => {
  if (!backendReady) {
    console.log("⏳ Warming up backend...");
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sec delay
    backendReady = true;
    console.log("✅ Backend is ready!");
  }

  res.status(200).json({ status: "ready" });
});
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/resturent", resturentRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://dep-app-taupe.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
