import { Request, Response } from "express";
import CaseStudy from "../models/case-study.model";

/* -------- Request Body Type -------- */
interface RawSection {
  heading: string;
  description: string;
  hasImage: boolean;
  lists?: string[];
}

/* ===============================
   BodyData Type
================================ */
interface RawBodyData {
  heading?: string;
  description?: string;
  lists?: string[];
  hasImage?: boolean; // only for frontend mapping
}

/* ===============================
   Create CaseStudy Controller
================================ */
export const createCaseStudy = async (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      slug,
      description,
      projectDescription,
      bodyData,
      seo,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        status: "error",
        message: "Title is required",
      });
    }

    /* ---------- Parse bodyData ---------- */
    let parsedBodyData: RawBodyData[] = [];

    if (bodyData) {
      try {
        parsedBodyData = JSON.parse(bodyData);
      } catch {
        return res.status(400).json({
          status: "error",
          message: "Invalid bodyData JSON",
        });
      }
    }

    /* ---------- Check duplicate title ---------- */
    const exists = await CaseStudy.findOne({ title });
    if (exists) {
      return res.status(409).json({
        status: "error",
        message: "CaseStudy already exists",
      });
    }

    /* ---------- Files ---------- */
    const files = req.files as {
      image?: Express.Multer.File[];
      sectionImages?: Express.Multer.File[];
    };

    const blogImage = files?.image?.[0]?.path || null;
    const sectionImages = files?.sectionImages || [];

    let imgIndex = 0;

    /* ---------- Map BodyData ---------- */
    const updatedBodyData = parsedBodyData.map((item) => {
      let image: string | null = null;

      if (item.hasImage) {
        image = sectionImages[imgIndex]?.path || null;
        imgIndex++;
      }

      return {
        heading: item.heading,
        description: item.description,
        lists: item.lists,
        image,
      };
    });

    /* ---------- Create CaseStudy ---------- */
    const caseStudy = await CaseStudy.create({
      title,
      category,
      slug,
      description,
      projectDescription,
      image: blogImage,
      status,
      bodyData: updatedBodyData,
      seo: seo ? JSON.parse(seo) : undefined,
      // userId: req.user?._id, // if auth middleware exists
    });

    return res.status(201).json({
      status: "success",
      message: "CaseStudy created successfully",
      data: caseStudy,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAllCaseStudies = async (_req: Request, res: Response) => {
  try {
    const caseStudies = await CaseStudy.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      status: "success",
      count: caseStudies.length,
      data: caseStudies,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getSingleCaseStudy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findById(id);

    if (!caseStudy) {
      return res.status(404).json({
        status: "error",
        message: "CaseStudy not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: caseStudy,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getSingleCaseStudyBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    console.log(slug,"slug>>>DAIN")

    const caseStudy = await CaseStudy.findOne({ slug });

    if (!caseStudy) {
      return res.status(404).json({
        status: "error",
        message: "CaseStudy not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: caseStudy,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* -------- Raw bodyData coming from frontend -------- */
interface RawBodyData {
  heading?: string;
  description?: string;
  hasImage?: boolean;
  lists?: string[];
}

export const updateCaseStudy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, bodyData } = req.body;

    /* -------- Find CaseStudy -------- */
    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      return res.status(404).json({
        status: "error",
        message: "CaseStudy not found",
      });
    }

    /* -------- Parse bodyData if provided -------- */
    let parsedBodyData: RawBodyData[] | null = null;

    if (bodyData) {
      try {
        parsedBodyData = JSON.parse(bodyData);
      } catch {
        return res.status(400).json({
          status: "error",
          message: "Invalid bodyData JSON",
        });
      }
    }

    /* -------- Multer files -------- */
    const files = req.files as {
      image?: Express.Multer.File[];
      sectionImages?: Express.Multer.File[];
    };

    /* -------- Update main image (optional) -------- */
    if (files?.image?.[0]) {
      caseStudy.image = files.image[0].path;
    }

    /* -------- Update basic fields -------- */
    if (title) caseStudy.title = title;
    if (description) caseStudy.description = description;

    /* -------- Update bodyData (optional) -------- */
    if (parsedBodyData) {
      const sectionImages = files?.sectionImages || [];
      let imgIndex = 0;

      caseStudy.bodyData = parsedBodyData.map((item, index) => {
        let image = caseStudy.bodyData[index]?.image || null;

        if (item.hasImage && sectionImages[imgIndex]) {
          image = sectionImages[imgIndex].path;
          imgIndex++;
        }

        return {
          heading: item.heading,
          description: item.description,
          image,
          lists: item.lists || [],
        };
      });
    }

    /* -------- Save -------- */
    await caseStudy.save();

    return res.status(200).json({
      status: "success",
      message: "CaseStudy updated successfully",
      data: caseStudy,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteCaseStudy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findByIdAndDelete(id);

    if (!caseStudy) {
      return res.status(404).json({
        status: "error",
        message: "CaseStudy not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "CaseStudy deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
