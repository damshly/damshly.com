import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/database"; // استيراد الاتصال
import routes from "./routes/index.routes";
import { setupSwagger } from "./docs/swagger";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());


setupSwagger(app);


app.use("/api", routes);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // اختبار الاتصال بقاعدة البيانات عند بدء التشغيل
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("📅 Database Time:", res.rows[0].now);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});
