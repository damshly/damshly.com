import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/database"; 
import routes from "./routes/index.routes";
// import { setupSwagger } from "./docs/swagger";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(helmet());


// setupSwagger(app);


app.use("/api", routes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // test database connection on startup
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database Time:", res.rows[0].now);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});

