import { Router } from "express";
import upload from "../config/multer";
import {
  createCaseStudy,
  deleteCaseStudy,
  getAllCaseStudies,
  getSingleCaseStudy,
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

/* ---------------- GET SINGLE BLOG ---------------- */
router.get("/:id", getSingleCaseStudy);

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
