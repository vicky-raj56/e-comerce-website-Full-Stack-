import Breadcrums from "@/components/Breadcrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImage from "@/components/ProductImage";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function SingleProduct() {
  const params = useParams();
  const productId = params.id;
  const { products } = useSelector((state) => state.products);
  const product = products
    ? products.find((product) => product._id === productId)
    : null;

  return (
    <div className="w-full min-h-[calc(100vh-87px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 border h-full py-10">
        <Breadcrums product={product} />
        <div className="grid grid-cols-2 mt-10 items-start">
          <ProductImage productImg={product.productImage} />
          <ProductDesc product={product} />
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
