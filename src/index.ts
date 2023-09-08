import express from "express";
import { config } from "dotenv";

config();

const app = express();

const port = process.env.APP_PORT || 3000;

app.listen(port, () => console.log(`chat socketio running on port ${port}`));
