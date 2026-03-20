import React, { useEffect, useState } from "react";
import FilterSidebar from "../components/FilterSidebar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "@/app/features/productSlice";
import SkeletonCard from "@/components/SkeletonCard";

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getAllProducts() {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/product/get-product`);

        if (response.data.success) {
          // toast.success(response.data.message)
          setAllProducts(response.data.products);
          dispatch(setProduct(response.data.products));
          setLoading(false);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "something went wrong");
        console.log("productFetched Error:", error);
      } finally {
        setLoading(false);
      }
    }
    getAllProducts();
  }, []);

  // filtered logic
  useEffect(() => {
    let filteredData = [...allProducts];

    if (search !== "") {
      filteredData = filteredData.filter((product) =>
        product.productName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "all") {
      filteredData = filteredData.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (brand !== "all") {
      filteredData = filteredData.filter(
        (product) => product.brand.toLowerCase() === brand,
      );
    }

    filteredData = filteredData.filter(
      (product) =>
        product.productPrice >= priceRange[0] &&
        product.productPrice <= priceRange[1],
    );

    if (sortOrder === "lowToHigh") {
      filteredData = filteredData.sort(
        (a, b) => a.productPrice - b.productPrice,
      );
    } else if (sortOrder === "highToLow") {
      filteredData = filteredData.sort(
        (a, b) => b.productPrice - a.productPrice,
      );
    }

    dispatch(setProduct(filteredData));
  }, [search, category, brand, priceRange, sortOrder, dispatch, allProducts]);
  
  return (
    <div className="py-5 relative w-full min-h-screen">
      <div className="max-w-7xl mx-auto flex gap-7 relative items-start ">
        {/* Side Bar */}
        <FilterSidebar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
          setPriceRange={setPriceRange}
          allProducts={allProducts}
          priceRange={priceRange}
        />

        {/* Main Product Section  */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-full max-w-50">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">Price: Low to high</SelectItem>
                  <SelectItem value="highToLow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading //skeleton lag hu loading ke liy
              ? [...Array(8)].map((_, index) => <SkeletonCard key={index} />)
              : products.map((product) => (
                  <div key={product._id}>
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
