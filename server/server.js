import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from 'serverless-http'
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { setup } from "./config/db.js";
import creationRoute from "./route/createtionRoute.js";
import userRoute from "./route/userCreationRoute.js";

dotenv.config();

const app = express();
app.use(cors(
    {origin:"http://localhost:5173"}
));
app.use(express.json());
app.use(clerkMiddleware());
const PORT = process.env.PORT || 3000;
setup();
creationRoute(app);
userRoute(app);

export const handler = serverless(app);