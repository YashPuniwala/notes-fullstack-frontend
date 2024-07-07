import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  useCreateProductMutation,
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
} from "../redux/productsApi";
import { Category, Product } from "../types/types";
import { Grid, Slider } from "@mui/material";
import CreateProduct from "./createProduct";
import { Select } from "antd";
import { useParams } from "react-router-dom";
// import { Select, Grid, Slider } from "antd";
const { Option } = Select;

interface ProductsProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>; // Function to set search query
}

const Products = ({searchQuery, setSearchQuery}: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePrevs, setImagePrevs] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [subcategory, setSubcategory] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [sort, setSort] = useState("");
  const [fetchAllProducts, setFetchAllProducts] = useState<boolean>(true);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]); // Default price range
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  ); // State for selected subcategories
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // State for selected subcategories
  const { data, error, isLoading, refetch } = useGetAllProductsQuery({
    category: category.join(","),
    subcategory: subcategory.join(","),
    brand: brand.join(","),
    sort,
    priceMin: priceRange[0], // Pass minimum price
    priceMax: priceRange[1],
    search: searchQuery // Include search query in the query object
});
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetAllCategoriesQuery();
  const [createProduct] = useCreateProductMutation();

  useEffect(() => {
    if (data) {
      setProducts(data?.products);
      refetch();
    }
    refetch();
  }, [data, refetch]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  useEffect(() => {
    setSubcategory([]);
  }, [category]);

  useEffect(() => {
    refetch(); // Refetch products whenever searchQuery changes
  }, [searchQuery, refetch]);

console.log(searchQuery, "searchQuery")

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCategory([value]);
    setSubcategory([])
    setBrand([])
    // setFetchAllProducts(false)
  };

  const handleSubcategoryChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSubcategory([value]);
    // setFetchAllProducts(false)
  };

  const handleBrandChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setBrand([value]);
    // setFetchAllProducts(false)
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleRemoveFilter = () => {
    setCategory([])
    setSubcategory([])
    setBrand([])
    setPriceRange([0, 10000]);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setSearchQuery(""); // Reset the search query
  }

  console.log(products, "categories");

  return (
    <div>
      <h2>Products</h2>
      <div>
        {/* <CreateProduct /> */}
        <CreateProduct categories={categories} refetchProduct={refetch}/>
    <div>
      <button onClick={handleRemoveFilter}>Remove Filter</button>
    </div>
        <div>
          <label htmlFor="category">Category:</label>
          {categories &&
            categories.length > 0 && ( // Check if categories exist and are not empty
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
        </div>

        <label htmlFor="subcategory">Subcategory:</label>
        <select
          id="subcategory"
          value={subcategory}
          onChange={handleSubcategoryChange}
        >
          <option value="">All Subcategories</option>
          {categories
            .find((cat) => category.includes(cat._id))
            ?.subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
        </select>

        <div>
          <label htmlFor="brand">Brand:</label>
          <select id="brand" value={brand} onChange={handleBrandChange}>
            <option value="">All Brands</option>
            {categories
            .find((cat) => category.includes(cat._id))
            ?.brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sort} onChange={handleSortChange}>
            <option value="">None</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Alphabetical (A-Z)</option>
            <option value="za">Alphabetical (Z-A)</option>
            <option value="high">Price Hight To Low</option>
            <option value="low">Price Low To High</option>
          </select>
        </div>

        <div style={{ width: 700 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={10000}
          />
          <p>
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </p>

          <div>
            <Grid container spacing={2}>
              {" "}
              {/* Using Grid container */}
              {products && products.length > 0 ? (
                products.map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                    {" "}
                    {/* Grid item */}
                    <div>
                      <h3>{product.title}</h3>
                      <p>Description: {product.description}</p>
                      <p>Price: {product.price}</p>
                    </div>
                  </Grid>
                ))
              ) : (
                <p>No products found</p>
              )}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
