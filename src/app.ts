import express from "express";
import caseStudyRoutes from "./routes/case-study.route";
const app = express();
import cors from 'cors'

app.use(express.json());
app.use(cors())
app.get("/", (_req, res) => {
  res.send("API running");
});
app.use("/case-study", caseStudyRoutes);

export default app; // ✅ REQUIRED
