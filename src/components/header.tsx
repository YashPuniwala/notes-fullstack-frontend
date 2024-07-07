import React, {useState} from "react";
import { Link } from "react-router-dom";
import { User } from "../types/types";
import { useLogoutMutation } from "../redux/userApi";
import { clearUser } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllProductsQuery } from "../redux/productsApi";
import Search from "./search";

interface HeaderTypes {
  user: User | null;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>; // Function to set search query
}

const Header = ({ user, setSearchQuery }: HeaderTypes) => {
  const [logout] = useLogoutMutation();
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    dispatch(clearUser());
    navigate("/login");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    navigate("/products"); // Navigate to products page after setting search query
    setSearchInput("")
  };


  return (
    <div>
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Search products"
        />
        <button onClick={handleSearch}>Search</button>
      <h3>{JSON.stringify(user)}</h3>
      {user ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <Link to="/notes">
            <button>Notes</button>
          </Link>
          <Link to="/products">
            <button>Products</button>
          </Link>
          <Link to="/">
            <button>Welcome</button>
          </Link>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;

// import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import {
//   useCreateProductMutation,
//   useGetAllCategoriesQuery,
//   useGetAllProductsQuery,
// } from "../redux/productsApi";
// import { Category, Product } from "../types/types";
// import { Grid, Slider } from "@mui/material";
// import CreateProduct from "./createProduct";
// import { Select } from "antd";
// // import { Select, Grid, Slider } from "antd";
// const { Option } = Select;

// const Products = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [price, setPrice] = useState<string>("");
//   const [imageFiles, setImageFiles] = useState<FileList | null>(null);
//   const [imagePrevs, setImagePrevs] = useState<string[]>([]);
//   const [category, setCategory] = useState<string[]>([]);
//   const [subcategory, setSubcategory] = useState<string[]>([]);
//   const [brand, setBrand] = useState("");
//   const [sort, setSort] = useState("");
//   const [fetchAllProducts, setFetchAllProducts] = useState<boolean>(true);
//   const [priceRange, setPriceRange] = useState<number[]>([0, 10000]); // Default price range
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // State for selected categories
//   const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
//     []
//   ); // State for selected categories

//   const { data, error, isLoading, refetch } = useGetAllProductsQuery({
//     category: fetchAllProducts ? undefined : category.join(","), // Convert array to string
//     subcategory: fetchAllProducts ? undefined : subcategory.join(","), // Convert array to string
//     brand: fetchAllProducts ? undefined : brand,
//     sort,
//     priceMin: priceRange[0], // Pass minimum price
//     priceMax: priceRange[1],
//   });
//   const {
//     data: categoriesData,
//     error: categoriesError,
//     isLoading: categoriesLoading,
//   } = useGetAllCategoriesQuery();
//   const [createProduct] = useCreateProductMutation();

//   useEffect(() => {
//     if (data) {
//       setProducts(data?.products);
//       refetch();
//     }
//     refetch();
//   }, [data, refetch]);

//   useEffect(() => {
//     if (categoriesData) {
//       setCategories(categoriesData);
//     }
//   }, [categoriesData]);

//   useEffect(() => {
//     setSubcategory([]);
//   }, [category]);

//   const handleCategoryChange = (value: string | string[]) => {
//     const selectedCategory = Array.isArray(value) ? value : [value];
//     setCategory(selectedCategory);
//     setSelectedCategories(selectedCategory);
//     setSubcategory([]); // Reset subcategory when category changes
//     setBrand(""); // Reset brand when category changes
//   };
//   const handleSubcategoryChange = (value: string | string[]) => {
//     // const selectedSubcategory = event.target.value; // Get the selected value
//     // const subcategoryArray = [selectedSubcategory]; // Convert it into an array
//     // setSubcategory(subcategoryArray); // Update the state with the array
//     // setBrand(""); // Reset brand if necessary

//     const selectedSubcategory = Array.isArray(value) ? value : [value];
//     setSubcategory(selectedSubcategory);
//     setSelectedSubcategories(selectedSubcategory);
//     setBrand(""); // Reset brand when category changes
//   };

//   const handleBrandChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setBrand(event.target.value);
//   };

//   const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setSort(event.target.value);
//   };

//   const handlePriceChange = (event: Event, newValue: number | number[]) => {
//     setPriceRange(newValue as number[]);
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = e.target.files;
//       const previews: string[] = [];

//       for (let i = 0; i < files.length; i++) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           if (typeof reader.result === "string") {
//             previews.push(reader.result);
//             if (previews.length === files.length) {
//               setImagePrevs(previews);
//             }
//           }
//         };
//         reader.readAsDataURL(files[i]);
//       }
//       setImageFiles(files);
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("price", price);
//       const categoryArray = Array.isArray(category) ? category : [category];
//       categoryArray.forEach((catId) => formData.append("category", catId));
//       const subcategoryArray = Array.isArray(subcategory)
//         ? subcategory
//         : [subcategory];
//       subcategoryArray.forEach((catId) =>
//         formData.append("subcategory", catId)
//       );
//       formData.append("brand", brand);
//       console.log(category, "category");
//       if (imageFiles) {
//         for (let i = 0; i < imageFiles.length; i++) {
//           formData.append("file", imageFiles[i]); // Use "files" as key for multiple files
//         }
//       }

//       const newProduct = await createProduct(formData);
//       setFetchAllProducts(true);
//       console.log("New Product:", newProduct);
//       refetch();
//     } catch (error) {
//       console.error("Error creating product:", error);
//     }
//   };

//   console.log(products, "categories");

//   return (
//     <div>
//       <h2>Products</h2>
//       <div>
//         {/* <CreateProduct /> */}
//         <div>
//           <form onSubmit={handleSubmit}>
//             <label htmlFor="title">Title:</label>
//             <input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />

//             <label htmlFor="description">Description:</label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             <label htmlFor="price">Price:</label>
//             <input
//               id="price"
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//             />

//             <label htmlFor="category">Category:</label>
//             <Select
//               mode="multiple" // Allow multiple selection
//               placeholder="Select categories"
//               style={{ width: "100%" }}
//               value={selectedCategories}
//               onChange={(value: string[]) => handleCategoryChange(value)}
//             >
//               {categories.map((category) => (
//                 <Option key={category._id} value={category._id}>
//                   {category.name}
//                 </Option>
//               ))}
//             </Select>

//             {selectedCategories.map((selectedCategoryId) => (
//               <div key={selectedCategoryId}>
//                 <label htmlFor="subcategory">Subcategory:</label>
//                 <Select
//                   mode="multiple" // Allow multiple selection
//                   placeholder="Select subcategories"
//                   style={{ width: "100%" }}
//                   value={selectedSubcategories}
//                   onChange={(value: string[]) => handleSubcategoryChange(value)}
//                 >
//                   {categories
//                     .find((cat) => cat._id === selectedCategoryId)
//                     ?.subcategories.map((subcat) => (
//                       <Option key={subcat._id} value={subcat._id}>
//                         {subcat.name}
//                       </Option>
//                     ))}
//                 </Select>
//               </div>
//             ))}

//             {category && (
//               <div>
//                 <label htmlFor="brand">Brand:</label>
//                 <select id="brand" value={brand} onChange={handleBrandChange}>
//                   <option value="">Select Brand</option>
//                   {categories
//                     .find((cat) => category.includes(cat._id)) // Check if the array includes the category ID
//                     ?.brands.map((bran) => (
//                       <option key={bran._id} value={bran._id}>
//                         {bran.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//             )}

//             <div>
//               <label htmlFor="file">Image:</label>
//               <input
//                 required
//                 id="file"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 multiple
//               />
//             </div>

//             <div>
//               {imagePrevs.length > 0 && (
//                 <div>
//                   {imagePrevs.map((preview, index) => (
//                     <img
//                       key={index}
//                       src={preview}
//                       alt={`Preview ${index}`}
//                       style={{
//                         width: "200px",
//                         objectFit: "contain",
//                         marginTop: "30px",
//                       }}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button type="submit">Create Product</button>
//           </form>
//         </div>

//         <div>
//           <label htmlFor="category">Category:</label>
//           {categories &&
//             categories.length > 0 && ( // Check if categories exist and are not empty
//               <select
//                 id="category"
//                 value={category}
//                 onChange={(e) => handleCategoryChange(e.target.value)}
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category._id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             )}
//         </div>

//         <div>
//           <label htmlFor="subcategory">Subcategory:</label>
//           <select
//             id="subcategory"
//             value={subcategory}
//             onChange={(e) => handleSubcategoryChange(e.target.value)}
//           >
//             <option value="">All Subcategories</option>
//             {categories
//               .find((cat) => category.includes(cat._id)) // Check if the array includes the category ID
//               ?.subcategories.map((subcat) => (
//                 <option key={subcat._id} value={subcat._id}>
//                   {subcat.name}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="brand">Brand:</label>
//           <select id="brand" value={brand} onChange={handleBrandChange}>
//             <option value="">All Brands</option>
//             {categories
//               .find((cat) => category.includes(cat._id)) // Check if the array includes the category ID
//               ?.brands.map((bran) => (
//                 <option key={bran._id} value={bran._id}>
//                   {bran.name}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="sort">Sort by:</label>
//           <select id="sort" value={sort} onChange={handleSortChange}>
//             <option value="">None</option>
//             <option value="newest">Newest</option>
//             <option value="oldest">Oldest</option>
//             <option value="az">Alphabetical (A-Z)</option>
//             <option value="za">Alphabetical (Z-A)</option>
//             <option value="high">Price Hight To Low</option>
//             <option value="low">Price Low To High</option>
//           </select>
//         </div>

//         <div style={{ width: 700 }}>
//           <Slider
//             value={priceRange}
//             onChange={handlePriceChange}
//             valueLabelDisplay="auto"
//             aria-labelledby="range-slider"
//             min={0}
//             max={10000}
//           />
//           <p>
//             Price Range: ${priceRange[0]} - ${priceRange[1]}
//           </p>

//           <div>
//             <Grid container spacing={2}>
//               {" "}
//               {/* Using Grid container */}
//               {products && products.length > 0 ? (
//                 products.map((product) => (
//                   <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
//                     {" "}
//                     {/* Grid item */}
//                     <div>
//                       <h3>{product.title}</h3>
//                       <p>Description: {product.description}</p>
//                       <p>Price: {product.price}</p>
//                     </div>
//                   </Grid>
//                 ))
//               ) : (
//                 <p>No products found</p>
//               )}
//             </Grid>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;

// import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import {
//   useCreateProductMutation,
//   useGetAllCategoriesQuery,
//   useGetAllProductsQuery,
// } from "../redux/productsApi";
// import { Category, Product } from "../types/types";
// import { Grid, Slider } from "@mui/material";
// import CreateProduct from "./createProduct";

// const Products = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [price, setPrice] = useState<string>("");
//   const [imageFiles, setImageFiles] = useState<FileList | null>(null);
//   const [imagePrevs, setImagePrevs] = useState<string[]>([]);
//   const [category, setCategory] = useState("");
//   const [subcategory, setSubcategory] = useState("");
//   const [brand, setBrand] = useState("");
//   const [sort, setSort] = useState("");
//   const [fetchAllProducts, setFetchAllProducts] = useState<boolean>(true);
//   const [priceRange, setPriceRange] = useState<number[]>([0, 10000]); // Default price range

//   const { data, error, isLoading, refetch } = useGetAllProductsQuery({
//     category: fetchAllProducts ? undefined : category,
//     subcategory: fetchAllProducts ? undefined : subcategory,
//     brand : fetchAllProducts ? undefined : brand,
//     sort,
//     priceMin: priceRange[0], // Pass minimum price
//     priceMax: priceRange[1],
//   });
//   const {
//     data: categoriesData,
//     error: categoriesError,
//     isLoading: categoriesLoading,
//   } = useGetAllCategoriesQuery();
//   const [createProduct] = useCreateProductMutation();

//   useEffect(() => {
//     if (data) {
//       setProducts(data?.products);
//       refetch();
//     }
//     refetch();
//   }, [data, refetch]);

//   useEffect(() => {
//     if (categoriesData) {
//       setCategories(categoriesData);
//     }
//   }, [categoriesData]);

//   useEffect(() => {
//     setSubcategory("");
//   }, [category]);

//   const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setCategory(event.target.value);
//     setSubcategory("");
//     setBrand("");
//     setFetchAllProducts(false)
//   };

//   const handleSubcategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setSubcategory(event.target.value);
//     setBrand("");
//     setFetchAllProducts(false)
//   };

//   const handleBrandChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setBrand(event.target.value);
//     setFetchAllProducts(false)
//   };

//   const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setSort(event.target.value);
//   };

//   const handlePriceChange = (event: Event, newValue: number | number[]) => {
//     setPriceRange(newValue as number[]);
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = e.target.files;
//       const previews: string[] = [];

//       for (let i = 0; i < files.length; i++) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           if (typeof reader.result === "string") {
//             previews.push(reader.result);
//             if (previews.length === files.length) {
//               setImagePrevs(previews);
//             }
//           }
//         };
//         reader.readAsDataURL(files[i]);
//       }
//       setImageFiles(files);
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("price", price);
//       formData.append("category", category);
//       formData.append("subcategory", subcategory);
//       formData.append("brand", brand);

//       if (imageFiles) {
//         for (let i = 0; i < imageFiles.length; i++) {
//         formData.append("file", imageFiles[i]); // Use "files" as key for multiple files
//         }
//       }

//       const newProduct = await createProduct(formData);
//       setFetchAllProducts(true);
//       console.log("New Product:", newProduct);
//       refetch()
//     } catch (error) {
//       console.error("Error creating product:", error);
//     }
//   };

//   console.log(products, "categories");

//   return (
//     <div>
//       <h2>Products</h2>
//       <div>

//         {/* <CreateProduct /> */}
//         {/* <div>
//           <form onSubmit={handleSubmit}>
//             <label htmlFor="title">Title:</label>
//             <input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />

//             <label htmlFor="description">Description:</label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             <label htmlFor="price">Price:</label>
//             <input
//               id="price"
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//             />

//             <label htmlFor="category">Category:</label>
//             <select
//               id="category"
//               value={category}
//               onChange={handleCategoryChange}
//             >
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>

//             {category && (
//               <div>
//                 <label htmlFor="subcategory">Subcategory:</label>
//                 <select
//                   id="subcategory"
//                   value={subcategory}
//                   onChange={handleSubcategoryChange}
//                 >
//                   <option value="">Select Subcategory</option>
//                   {categories
//                     .find((cat) => cat._id === category)
//                     ?.subcategories.map((subcat) => (
//                       <option key={subcat._id} value={subcat._id}>
//                         {subcat.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//             )}

//             {category && (
//               <div>
//                 <label htmlFor="brand">Brand:</label>
//                 <select id="brand" value={brand} onChange={handleBrandChange}>
//                   <option value="">Select Brand</option>
//                   {categories
//                     .find((cat) => cat._id === category)
//                     ?.brands.map((brand) => (
//                       <option key={brand._id} value={brand._id}>
//                         {brand.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//             )}

//             <div>
//               <label htmlFor="file">Image:</label>
//               <input
//                 required
//                 id="file"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 multiple
//               />
//             </div>

//             <div>
//               {imagePrevs.length > 0 && (
//                 <div>
//                   {imagePrevs.map((preview, index) => (
//                     <img
//                       key={index}
//                       src={preview}
//                       alt={`Preview ${index}`}
//                       style={{
//                         width: "200px",
//                         objectFit: "contain",
//                         marginTop: "30px",
//                       }}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button type="submit">Create Product</button>
//           </form>
//         </div> */}

//         <div>
//           <label htmlFor="category">Category:</label>
//           {categories &&
//             categories.length > 0 && ( // Check if categories exist and are not empty
//               <select
//                 id="category"
//                 value={category}
//                 onChange={handleCategoryChange}
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category._id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             )}
//         </div>

//         <div>
//           <label htmlFor="subcategory">Subcategory:</label>
//           <select
//             id="subcategory"
//             value={subcategory}
//             onChange={handleSubcategoryChange}
//           >
//             <option value="">All Subcategories</option>
//             {categories
//               .find((cat) => cat._id === category)
//               ?.subcategories.map((subcategory) => (
//                 <option key={subcategory._id} value={subcategory._id}>
//                   {subcategory.name}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="brand">Brand:</label>
//           <select id="brand" value={brand} onChange={handleBrandChange}>
//             <option value="">All Brands</option>
//             {categories
//               .find((cat) => cat._id === category)
//               ?.brands.map((brand) => (
//                 <option key={brand._id} value={brand._id}>
//                   {brand.name}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="sort">Sort by:</label>
//           <select id="sort" value={sort} onChange={handleSortChange}>
//             <option value="">None</option>
//             <option value="newest">Newest</option>
//             <option value="oldest">Oldest</option>
//             <option value="az">Alphabetical (A-Z)</option>
//             <option value="za">Alphabetical (Z-A)</option>
//             <option value="high">Price Hight To Low</option>
//             <option value="low">Price Low To High</option>
//           </select>
//         </div>

//         <div style={{ width: 700 }}>
//           <Slider
//             value={priceRange}
//             onChange={handlePriceChange}
//             valueLabelDisplay="auto"
//             aria-labelledby="range-slider"
//             min={0}
//             max={10000}
//           />
//           <p>
//             Price Range: ${priceRange[0]} - ${priceRange[1]}
//           </p>

//           <div>
//             <Grid container spacing={2}>
//               {" "}
//               {/* Using Grid container */}
//               {products && products.length > 0 ? (
//                 products.map((product) => (
//                   <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
//                     {" "}
//                     {/* Grid item */}
//                     <div>
//                       <h3>{product.title}</h3>
//                       <p>Description: {product.description}</p>
//                       <p>Price: {product.price}</p>
//                     </div>
//                   </Grid>
//                 ))
//               ) : (
//                 <p>No products found</p>
//               )}
//             </Grid>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;
