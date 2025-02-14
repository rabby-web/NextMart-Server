import { Schema, model, Document, Types } from "mongoose";
import { ICategory } from "./category.interface";

// Extend Mongoose Document with ICategory
interface ICategoryDocument extends Document, ICategory { }

// Define the schema
const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre<ICategory>("validate", function (next) {
  if (this instanceof Document) {
    if (this.isModified("name") && !this.slug) {
      this.slug = this.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }
  }
  next();
});

export const Category = model<ICategoryDocument>("Category", categorySchema);
