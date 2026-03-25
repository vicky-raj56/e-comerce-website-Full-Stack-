import { uploadMultipleImages } from "../configs/cloudinary.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { client } from "../redis/redisClient.js";
// redis cache key for all products
const cacheKey = "all-Products";

// redis error handling
const clearCache = async () => {
  try {
    await client.del(cacheKey);
    console.log("Cache cleared successfully");
  } catch (err) {
    console.error("Redis Clear Error (Skipped):", err);
  }
};

const addProduct = async (req, res) => {
  try {
    const { productName, productDescription, productPrice, category, brand } =
      req.body;
    const id = req.user.userId;

    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !category ||
      !brand
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    // Max 5 images check (Multer middleware se bhi handle ho hoga)
    const uploadedImages = await uploadMultipleImages(req.files);

    if (uploadedImages.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Images not upload please try again .",
      });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    const newProduct = new productModel({
      productName,
      productDescription,
      productPrice,
      category,
      brand,
      // Images array jisme URL aur Public ID dono hain
      productImage: uploadedImages,
      userId: req.user.userId,
    });

    const savedProduct = await newProduct.save();

    // Update the cache after adding a new product
    await clearCache(); // Clear the old cache

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.log("addProduct Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const cachedProducts = await client.get(cacheKey);
    if (cachedProducts) {
      console.log("product fetched from cache");
      return res.status(200).json({
        success: true,
        message: "all product fetched",
        products: JSON.parse(cachedProducts),
      });
    }
    const products = await productModel.find({});

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Not any product found",
        products: [],
      });
    }
    await client.set(cacheKey, JSON.stringify(products), { EX: 3600 });
    return res
      .status(200)
      .json({ success: true, message: "all product fetched", products });
  } catch (error) {
    console.log("getAllProducts Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// delete product

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }

    // delete images from cloudinary
    if (product.productImage && product.productImage.length > 0) {
      for (let img of product.productImage) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    // product delete from db
    await productModel.findByIdAndDelete(productId);
    // Update the cache after deleting the product
    await clearCache(); // Clear the old cache

    return res
      .status(200)
      .json({ success: true, message: "product deleted successfully" });
  } catch (error) {
    console.log("deleteProduct Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update product

// const updateProduct = async (req, res) => {
//   try {
//     const {
//       productName,
//       productDescription,
//       productPrice,
//       category,
//       brand,
//       existingImages,
//     } = req.body;
//     const { productId } = req.params;
//     // console.log(existingImages)

//     const product = await productModel.findById(productId);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "product not found" });
//     }

//     // 1. Existing images handle (Frontend se bachi hui images)
//     let parsedExisting = [];
//     if (existingImages) {
//       parsedExisting =
//         typeof existingImages === "string"
//           ? JSON.parse(existingImages)
//           : existingImages;
//     }

//     // 2. Jo images hatayi gayi hain unhe Cloudinary se delete
//     const deleteImages = product.productImage.filter((oldImage) => {
//       const match = parsedExisting.find(
//         (newImage) => newImage.publicId === oldImage.publicId,
//       );
//       return !match;
//     });

//     for (const img of deleteImages) {
//       await cloudinary.uploader.destroy(img.publicId);
//     }

//     // 3. Nayi images upload karo (sirf tabhi jab bheji gayi hon)
//     let uploadedImages = [];
//     if (req.files && req.files.length > 0) {
//       uploadedImages = await uploadMultipleImages(req.files);

//       // Agar upload fail ho jaye toh error return karein
//       if (!uploadedImages || uploadedImages.length === 0) {
//         return res
//           .status(500)
//           .json({ success: false, message: "Cloudinary upload failed" });
//       }
//     }

//     // 4. Sab merge karke final array
//     let finalImages = [...parsedExisting, ...uploadedImages];

//     //  Agar galti se saari images delete ho gayi hain
//     if (finalImages.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one product image is required",
//       });
//     }

//     // 5. Update Data Object
//     const updateData = {
//       productName: productName || product.productName,
//       productDescription: productDescription || product.productDescription,
//       productPrice: Number(productPrice) || product.productPrice,
//       category: category || product.category,
//       brand: brand || product.brand,
//       productImage: finalImages,
//     };

//     const updatedProduct = await productModel.findByIdAndUpdate(
//       productId,
//       updateData,
//       { returnDocument: "after" },
//     );
//     // Update the cache after updating the product
//     await clearCache(); // Clear the old cache

//     return res.status(200).json({
//       success: true,
//       message: "product updated successfully",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.log("updateProduct Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const updateProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      category,
      brand,
      existingImages, // Ye stringified array of publicIds hai
    } = req.body;
    const { productId } = req.params;

    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }

    // 1. Existing images handle (Parse safety)
    let publicIdsKeep = [];
    if (existingImages) {
      try {
        publicIdsKeep =
          typeof existingImages === "string"
            ? JSON.parse(existingImages)
            : existingImages;
      } catch (e) {
        console.log("JSON Parse Error:", e);
        publicIdsKeep = [];
      }
    }

    // 2. Cloudinary se delete karo jo remove ho gayi hain
    // Hum product.productImage (DB wale objects) ko check karenge
    const imagesToDelete = product.productImage.filter(
      (oldImg) => !publicIdsKeep.includes(oldImg.publicId),
    );

    for (const img of imagesToDelete) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    // 3. Database ke liye wo objects rakho jo delete nahi hue
    const keptImages = product.productImage.filter((oldImg) =>
      publicIdsKeep.includes(oldImg.publicId),
    );

    // 4. Nayi images upload karo
    let newlyUploaded = [];
    if (req.files && req.files.length > 0) {
      newlyUploaded = await uploadMultipleImages(req.files);
    }

    // 5. Final Merge (Purane Objects + Naye Objects)
    const finalImages = [...keptImages, ...newlyUploaded];

    if (finalImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // 6. Update Data
    const updateData = {
      productName: productName || product.productName,
      productDescription: productDescription || product.productDescription,
      productPrice: Number(productPrice) || product.productPrice,
      category: category || product.category,
      brand: brand || product.brand,
      productImage: finalImages,
    };

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }, // Mongoose mein 'new: true' use hota hai updated doc ke liye
    );

    // Cache clearing logic
    if (typeof clearCache === "function") await clearCache();

    return res.status(200).json({
      success: true,
      message: "product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("updateProduct Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export { addProduct, getAllProducts, deleteProduct, updateProduct };
