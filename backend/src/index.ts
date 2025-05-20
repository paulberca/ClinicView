import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./routes/patients";
import doctorRoutes from "./routes/doctors";
import authRoutes from "./routes/auth";
import logsRoutes from "./routes/logs";
import { detectSuspiciousUsers } from "./tasks/detectSuspiciousUsers";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/logs", logsRoutes);

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);

  // initial scan for suspicious activity
  // (async () => {
  //   try {
  //     await detectSuspiciousUsers();
  //     console.log("Initial suspicious activity scan complete.");
  //   } catch (err) {
  //     console.error("Initial scan failed:", err);
  //   }
  // })();

  // // periodic scan
  // setInterval(async () => {
  //   console.log("Checking for suspicious activity...");
  //   try {
  //     await detectSuspiciousUsers();
  //   } catch (err) {
  //     console.error("Error detecting suspicious activity:", err);
  //   }
  // }, 60 * 1000); // Every minute
});
