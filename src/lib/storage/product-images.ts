import "server-only";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2BucketName, getR2PublicUrl } from "./r2-client";

const MAX_WIDTH = 1500;
const WEBP_QUALITY = 80;

export async function uploadProductImage(fileBuffer: Buffer): Promise<string> {
  const resized = await sharp(fileBuffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const key = `products/${randomUUID()}.webp`;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: resized,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${getR2PublicUrl()}/${key}`;
}

export async function deleteProductImage(url: string): Promise<void> {
  const publicUrl = getR2PublicUrl();
  if (!url.startsWith(publicUrl)) return;
  const key = url.slice(publicUrl.length + 1);
  try {
    await getR2Client().send(new DeleteObjectCommand({ Bucket: getR2BucketName(), Key: key }));
  } catch (error) {
    console.error("[deleteProductImage]", error);
  }
}
