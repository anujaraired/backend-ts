import express from "express";
import caseStudyRoutes from "./routes/case-study.route";
const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API running");
});
app.use("/case-study", caseStudyRoutes);

export default app; // ✅ REQUIRED
