import mongoose from "mongoose";

// PDF Upload Schema
const pdfUploadSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    filePath: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create model
export const PDFUpload =
  mongoose.models.PDFUpload || mongoose.model("PDFUpload", pdfUploadSchema);

// PDF Upload service methods
export class PDFUploadService {
  static async create(data: {
    filename: string;
    originalName: string;
    size: number;
    type: string;
    path: string;
    filePath: string;
  }) {
    const upload = new PDFUpload(data);
    return await upload.save();
  }

  static async getByFilename(filename: string) {
    return await PDFUpload.findOne({ filename });
  }

  static async getAll(limit = 50, skip = 0) {
    return await PDFUpload.find()
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  static async deleteByFilename(filename: string) {
    return await PDFUpload.findOneAndDelete({ filename });
  }

  static async count() {
    return await PDFUpload.countDocuments();
  }
}
