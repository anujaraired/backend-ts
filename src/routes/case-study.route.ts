import { Router } from "express";
import upload from "../config/multer";
import {
  createCaseStudy,
  deleteCaseStudy,
  getAllCaseStudies,
  getSingleCaseStudy,
  getSingleCaseStudyBySlug,
  updateCaseStudy,
} from "../controllers/case-study.controller";

const router = Router();

router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "sectionImages", maxCount: 10 },
  ]),
  createCaseStudy,
);
router.get("/", getAllCaseStudies);

// ✅ single by ID
router.get("/id/:id", getSingleCaseStudy);

// ✅ single by SLUG
router.get("/slug/:slug", getSingleCaseStudyBySlug);

/* ---------------- UPDATE BLOG ---------------- */
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "sectionImages", maxCount: 20 },
  ]),
  updateCaseStudy,
);

/* ---------------- DELETE BLOG ---------------- */
router.delete("/:id", deleteCaseStudy);

export default router;
