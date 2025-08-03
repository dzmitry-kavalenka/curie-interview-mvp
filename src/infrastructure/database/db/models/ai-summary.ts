import mongoose from "mongoose";

// AI Summary Schema
const aiSummarySchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    textLength: {
      type: Number,
      required: true,
    },
    processingTime: {
      type: Number,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create model
export const AISummary =
  mongoose.models.AISummary || mongoose.model("AISummary", aiSummarySchema);

// AI Summary service methods
export class AISummaryService {
  static async create(data: {
    filename: string;
    summary: string;
    fileSize: number;
    textLength: number;
    processingTime?: number;
  }) {
    const summary = new AISummary(data);
    return await summary.save();
  }

  static async getByFilename(filename: string) {
    return await AISummary.findOne({ filename });
  }

  static async getAll(limit = 50, skip = 0) {
    return await AISummary.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  static async deleteByFilename(filename: string) {
    return await AISummary.findOneAndDelete({ filename });
  }

  static async count() {
    return await AISummary.countDocuments();
  }
}
