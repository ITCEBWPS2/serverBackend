import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import loanRoutes from "./routes/loan.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import emailRoutes from "./routes/email.routes.js";
import deathFundRoutes from "./routes/deathFund.routes.js";
import scholarshipRoutes from "./routes/scholarship.routes.js";
import medicalRoutes from "./routes/medical.routes.js";
import refundRoutes from "./routes/refund.routes.js";
import retirementRoutes from "./routes/retirement.routes.js";
import cors from "cors";
import ServerlessHttp from "serverless-http";

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();
const app = express();

app.get("/", (req, res) => {
  return res.json({
    message: "Hello from serverless function !!!",
  });
});
// Extract cookie data from HTTP requests
app.use(cookieParser());
// Middleware for parsing incoming requests with JSON payloads
app.use(express.json());
// Allow sending form data
app.use(express.urlencoded({ extended: true }));



// Set up CORS to allow requests from multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-to-server requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/members", userRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api", emailRoutes);
app.use("/api/deathfunds", deathFundRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/medicals", medicalRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/retirements", retirementRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Export the handler function for use in Netlify Functions
export const handler = async (event, context) => {
  const result = await ServerlessHttp(app)(event, context);
  return result;
};
