import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./routes/patients";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/patients", patientRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
