import s3 from "../util/s3Config";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

export const uploadMultipleImagesToS3 = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  // Create an array of promises, one for each file upload
  const uploadPromises = files.map(async (file) => {
    // 1. Generate a unique file name
    const fileExtension = file.originalname.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    const targetFolder = process.env.HOTEL_FOLDER;
    const mimeType = file?.mimetype;
    const fileName = file?.originalname;
    const fileKey = `${targetFolder}/${uuidv4()}-${fileName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const params: any = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: file?.buffer,
      ContentType: mimeType,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    // 4. Return the public URL
    //return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/room-categories/${uniqueFileName}`;
  });

  // Wait for all uploads to complete
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
};
