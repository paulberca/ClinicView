import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./routes/patients";
import doctorRoutes from "./routes/doctors";
import authRoutes from "./routes/auth";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
