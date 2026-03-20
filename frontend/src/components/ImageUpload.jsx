import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";

function ImageUpload({ productData, setProductData }) {
  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []); // img ko array me convert ki
    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, ...files],
      }));
    }
  };

  const removeImage = (index) => {
    setProductData((prev) => {
      const updatedImage = prev.productImage.filter((_, idx) => idx !== index);
      return { ...prev, productImage: updatedImage };
    });
  };
  return (
    <div className="grid gap-2">
      <Label>Image Upload</Label>
      <Input
        type="file"
        id="image-upload"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <Button variant="outline" className="cursor-pointer">
        <Label htmlFor="image-upload" className="cursor-pointer">
          Image Uploads
        </Label>
      </Button>
      {/* image preview */}
      {productData.productImage.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 ">
          {productData.productImage.map((file, idx) => {
            // check if files is already a file (from input ) or  a DB object/string

            let preview;

            if (file instanceof File) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === "string") {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }

            return (
              <Card className="relative group overflow-hidden " key={idx}>
                <CardContent>
                  <img
                    src={preview}
                    alt=""
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  {/* {remove  button} */}
                  <button
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer "
                    onClick={() => removeImage(idx)}
                  >
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
