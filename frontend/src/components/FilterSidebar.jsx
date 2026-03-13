import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function FilterSidebar({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  setPriceRange,
  allProducts,
  priceRange,
}) {
  const categories = allProducts.map((product) =>
    product.category.toLowerCase(),
  );
  const uniqueCategory = ["all", ...new Set(categories)];

  const brands = allProducts.map((product) => product.brand.toLowerCase());
  const uniqueBrand = ["all", ...new Set(brands)];
  // console.log(uniqueBrand);

  const handleCategoryClick = (value) => {
    setCategory(value);
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };

  const handleMinChange = (event) => {
    const value = Number(event.target.value);
    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxChange = (event) => {
    const value = Number(event.target.value);
    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value]);
    }
  };

  const resetFilter = () => {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setPriceRange([0, 999999]);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md hidden md:block w-64 sticky top-25">
      {/* search bar  */}
      <Input
        type="text"
        placeholder="search... "
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        className="bg-white p-2 rounded-md border-2 w-full border-gray-200"
      />
      {/* category */}
      <h1 className="mt-5 font-semibold text-xl">Category</h1>
      <div className="flex flex-col mt-2  gap-3">
        {uniqueCategory.map((item, idx) => (
          <div key={idx} className=" flex items-center gap-2">
            <input
              type="radio"
              id={item}
              checked={category.toLowerCase() === item}
              onChange={() => {
                handleCategoryClick(item);
              }}
            />
            <label className="capitalize" htmlFor={item}>
              {item}
            </label>
          </div>
        ))}
      </div>

      {/* Brands  */}
      <h1 className="mt-5 font-semibold text-xl">Brands</h1>
      <select
        className="w-full p-2 border-2 mt-1 border0gray-200 rounded-md  bg-white cursor-pointer text-bold "
        value={brand}
        onChange={handleBrandChange}
      >
        {uniqueBrand.map((item, idx) => (
          <option key={idx} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Price Range  */}
      <h1 className="mt-5 mb-3 text-xl font-semibold capitalize">
        Price range
      </h1>
      <div className="flex flex-col gap-2">
        <label>
          Price range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            max="999999"
            value={priceRange[0]}
            onChange={handleMinChange}
            className="w-20 p-1 border border-gray-300 rounded"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            max="999999"
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="w-20 p-1 border border-gray-300 rounded"
          />
        </div>

        <input
          type="range"
          min="0"
          max="999999"
          step="100"
          className="w-full cursor-pointer"
          value={priceRange[0]}
          onChange={handleMinChange}
        />
        <input
          type="range"
          min="0"
          max="999999"
          step="100"
          value={priceRange[1]}
          onChange={handleMaxChange}
          className="w-full cursor-pointer"
        />
      </div>
      {/* reset button  */}
      <Button
        className="mt-5 bg-pink-600 w-full text-white  text-lg font-semibold cursor-pointer"
        onClick={resetFilter}
      >
        Reset Filter
      </Button>
    </div>
  );
}

export default FilterSidebar;
