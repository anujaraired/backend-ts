import mongoose, { Schema, Document, Types } from "mongoose";

/* ===============================
   Section / Body Data Interface
================================ */
export interface ICaseStudyData {
  heading?: string;
  description?: string;
  image?: string | null;
  lists?: string[];
}

/* ===============================
   SEO Interface
================================ */
export interface ISeo {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalLink?: string;
  focusKeyword?: string;
}

/* ===============================
   Case Study Interface
================================ */
export interface ICaseStudy extends Document {
  title: string;
  category?: string;
  slug?: string;
  description?: string; // short description
  projectDescription?: string;
  image?: string | null; // main image
  status?: string;
  bodyData: ICaseStudyData[];
  seo?: ISeo;

  userId?: Types.ObjectId;
}

/* ===============================
   BodyData Schema
================================ */
const BodyDataSchema = new Schema<ICaseStudyData>(
  {
    heading: { type: String },
    description: { type: String },
    image: { type: String, default: null },
    lists: { type: [String] },
  },
  { _id: false },
);

/* ===============================
   SEO Schema
================================ */
const SeoSchema = new Schema<ISeo>(
  {
    title: { type: String },
    description: { type: String },
    keywords: { type: [String] },
    canonicalLink: { type: String },
    focusKeyword: { type: String },
  },
  { _id: false },
);

/* ===============================
   Case Study Schema
================================ */
const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title: { type: String, required: true, unique: true },

    category: { type: String },
    slug: { type: String, index: true },

    description: { type: String }, // short summary
    projectDescription: { type: String },
    image: { type: String, default: null }, // main image

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    bodyData: {
      type: [BodyDataSchema],
      default: [],
    },

    seo: {
      type: SeoSchema,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);
