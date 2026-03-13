import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export async function connectCloudinary() {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  } catch (error) {
    console.log("cloudinary connect error:", error);
  }
}

export async function uploadImage(file) {
  if (!file) return null; // Agar file path hi nahi hai toh return null

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "e-commerce/userProfile",
      quality: "auto",
      fetch_format: "auto",
    });

    // File sync unlink tabbhi karen jab file exist kare
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    return result;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    // Error aane par bhi local temp file delete karna zaroori hai
    if (fs.existsSync(file)) fs.unlinkSync(file);
    return null;
  }
}

export async function uploadMultipleImages(fileArray) {
  const uploadedResults = [];

  try {
    for (const file of fileArray) {
      // console.log(`Uploading: ${file.originalname}`); // Debugging ke liye

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "e-commerce/products",
        resource_type: "auto",
        timeout: 120000,
      });

      // Upload successful hone par result push hog
      uploadedResults.push({
        url: result.secure_url,
        publicId: result.public_id,
      });

      // Local file delete kar
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    return uploadedResults;
  } catch (error) {
    console.error("Cloudinary Multi Upload Error:", error);

    // Agar error aaye, toh baaki bachi hui temp files ko bhi delete karein taaki storage na bhare
    for (const file of fileArray) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    return []; // Khali array return karein taaki controller crash na ho
  }
}

// 3. Destroy/Delete Image Function
export async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
}
