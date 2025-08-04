import { existsSync } from "fs";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

import { logger } from "@/shared/utils/logger";

import { s3Service } from "./s3-client";

export class StorageService {
  private isProduction = process.env.NODE_ENV === "production";
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = this.isProduction
      ? "/tmp/uploads"
      : join(process.cwd(), "uploads");
  }

  async uploadFile(
    filename: string,
    buffer: Buffer,
    contentType: string
  ): Promise<{ url: string; key: string }> {
    if (this.isProduction) {
      const s3Key = `uploads/${filename}`;
      const s3Url = await s3Service.uploadFile(s3Key, buffer, contentType);
      return { url: s3Url, key: s3Key };
    } else {
      return await this.uploadToLocal(filename, buffer);
    }
  }

  async getFileUrl(filename: string): Promise<string> {
    if (this.isProduction) {
      const s3Key = `uploads/${filename}`;
      return await s3Service.getSignedUrl(s3Key, 3600);
    } else {
      return `/api/files/${filename}`;
    }
  }

  async deleteFile(filename: string): Promise<void> {
    if (this.isProduction) {
      const s3Key = `uploads/${filename}`;
      await s3Service.deleteFile(s3Key);
    } else {
      logger.info(`Local file deletion not implemented: ${filename}`);
    }
  }

  private async uploadToLocal(
    filename: string,
    buffer: Buffer
  ): Promise<{ url: string; key: string }> {
    if (!existsSync(this.uploadsDir)) {
      await mkdir(this.uploadsDir, { recursive: true });
    }

    const filePath = join(this.uploadsDir, filename);
    await writeFile(filePath, buffer);

    logger.info(`File uploaded locally: ${filename}`);
    return { url: `/api/files/${filename}`, key: filePath };
  }

  async getLocalFileBuffer(filename: string): Promise<Buffer> {
    if (this.isProduction) {
      throw new Error("Local file access not available in production");
    }

    const filePath = join(this.uploadsDir, filename);

    if (!existsSync(filePath)) {
      throw new Error("File not found");
    }

    return await readFile(filePath);
  }
}

export const storageService = new StorageService();
