import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import cors from "cors";
import helmet from "helmet";

import siteRoutes from "./routes/sites.js";
import exchangeRoutes from "./routes/exchanges.js";
import userRoutes from "./routes/users.js";
import invertoryRoutes from "./routes/inventories.js";
import stockRoutes from "./routes/stocks.js";
import authRoutes from "./routes/auth.js";
import homeRoutes from "./routes/home.js";

// CONFIGURATION
const app = express();
app.use(express.json());
dotenv.config();
app.use(helmet()); // if not used with helmet, cors will not work
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something broke!");
});

// ROUTES
app.use("/sites", siteRoutes);
app.use("/exchanges", exchangeRoutes);
app.use("/users", userRoutes);
app.use("/inventories", invertoryRoutes);
app.use("/stocks", stockRoutes);
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);

app.listen(3002, () => console.log("Server started on port 3002"));
