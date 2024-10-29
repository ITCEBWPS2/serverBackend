import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import cors from "cors";
import ServerlessHttp from "serverless-http";

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();
const app = express();

app.get("/.netlify/functions/api", (req, res) => {
  return res.json({
    message: "Hello from serverless function",
  });
});

// Middleware for parsing incoming requests with json payloads
app.use(express.json());
// Allow sending form data
app.use(express.urlencoded({ extended: true }));

// Extract cookie data from HTTP requests
app.use(cookieParser());

app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

app.use("/api/members", userRoutes);
app.use("/api/loans", loanRoutes);

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
