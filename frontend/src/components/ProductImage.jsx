import React, { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

function ProductImage({ productImg }) {
  const [mainImage, setMainImage] = useState(productImg[0]?.url);
  return (
    <div className="flex gap-5 w-max ">
      <div className="flex flex-col gap-5 ">
        {productImg.map((image) => (
          <img
            src={image?.url}
            alt=""
            key={image._id}
            className="w-20 h-20 border shadow-lg cursor-pointer rounded "
            onClick={() => setMainImage(image?.url)}
          />
        ))}
      </div>

      <Zoom>
        <img
          src={mainImage}
          alt=""
          className=" w-125 rounded h-105 border shadow-lg object-center "
        />
      </Zoom>
    </div>
  );
}

export default ProductImage;
