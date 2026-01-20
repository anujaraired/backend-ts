import mongoose, { Schema, Document, Types } from "mongoose";

/* ===============================
   Section / Body Data Interface
================================ */
export interface IBodyData {
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
   Blog Interface
================================ */
export interface IBlog extends Document {
  title: string;
  category?: string;
  slug?: string;
  description?: string; // short description
  image?: string | null; // main image
  status?: string;
  bodyData: IBodyData[];
  seo?: ISeo;

  userId?: Types.ObjectId;
}

/* ===============================
   BodyData Schema
================================ */
const BodyDataSchema = new Schema<IBodyData>(
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
   Blog Schema
================================ */
const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, unique: true },

    category: { type: String },
    slug: { type: String, index: true },

    description: { type: String }, // short summary
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

export default mongoose.model<IBlog>("Blog", BlogSchema);
