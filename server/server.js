import express from "express";
import cors from "cors";
import { router } from "./routes.js";
import "dotenv/config";
import connectDB from "./config.js";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
