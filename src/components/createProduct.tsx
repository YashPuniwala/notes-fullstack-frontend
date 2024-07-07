import React, { ChangeEvent, FormEvent, useState } from "react";
import { Select } from "antd";
import { Category } from "../types/types";
import { useCreateProductMutation, useGetAllProductsQuery } from "../redux/productsApi";

const { Option } = Select;

interface CreateProductProps {
  categories: Category[];
  refetchProduct: () => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({ categories, refetchProduct }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [subcategory, setSubcategory] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePrevs, setImagePrevs] = useState<string[]>([]);

  const [newProduct] = useCreateProductMutation();
  
  // const { data, error, isLoading, refetch } = useGetAllProductsQuery();

  const handleCategoryChange = (value: string[]) => {
    setCategory(value);
    setSubcategory([]);
    setBrand([]);
  };

  const handleSubcategoryChange = (value: string | string[]) => {
    const selectedSubcategory = Array.isArray(value)
      ? value
      : [value as string];
    setSubcategory(selectedSubcategory);
  };

  const handleBrandChange = (value: string | string[]) => {
    const selectedBrand = Array.isArray(value) ? value : [value as string];
    setBrand(selectedBrand);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      const previews: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            previews.push(reader.result);
            if (previews.length === files.length) {
              setImagePrevs(previews);
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
      setImageFiles(files);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      const categoryArray = Array.isArray(category) ? category : [category];
      categoryArray.forEach((catId) => formData.append("category", catId));
      const subcategoryArray = Array.isArray(subcategory)
        ? subcategory
        : [subcategory];
      subcategoryArray.forEach((catId) =>
        formData.append("subcategory", catId)
      );
      const brandArray = Array.isArray(brand) ? brand : [brand];
      brandArray.forEach((catId) => formData.append("brand", catId));

      if (imageFiles) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append("file", imageFiles[i]);
        }
      }

      const product = await newProduct(formData);
      console.log("New Product", product)
      refetchProduct()

    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="price">Price:</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label htmlFor="category">Category:</label>
        <Select
          placeholder="Select categories"
          style={{ width: "100%" }}
          value={category}
          onChange={(value: string[]) => handleCategoryChange(value)}
        >
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>

        <label htmlFor="subcategory">Subcategory:</label>
        <Select
          mode="multiple"
          placeholder="Select subcategories"
          style={{ width: "100%" }}
          value={subcategory}
          onChange={(value: string[]) => handleSubcategoryChange(value)}
        >
          {categories
            .filter((cat) => category.includes(cat._id)) // Filter subcategories based on selected category
            .map((cat) => cat.subcategories)
            .flat() // Flatten the array of arrays
            .map((subcat) => (
              <Option key={subcat._id} value={subcat._id}>
                {subcat.name}
              </Option>
            ))}
        </Select>

        <label htmlFor="brand">Brand:</label>
        <Select
          mode="multiple"
          placeholder="Select Brands"
          style={{ width: "100%" }}
          value={brand}
          onChange={(value: string[]) => handleBrandChange(value)}
        >
          {categories
            .filter((cat) => category.includes(cat._id)) // Filter subcategories based on selected category
            .map((cat) => cat.brands)
            .flat() // Flatten the array of arrays
            .map((subcat) => (
              <Option key={subcat._id} value={subcat._id}>
                {subcat.name}
              </Option>
            ))}
        </Select>

        <label htmlFor="file">Image:</label>
        <input
          required
          id="file"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          multiple
        />

        {imagePrevs.length > 0 && (
          <div>
            {imagePrevs.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index}`}
                style={{
                  width: "200px",
                  objectFit: "contain",
                  marginTop: "30px",
                }}
              />
            ))}
          </div>
        )}

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
