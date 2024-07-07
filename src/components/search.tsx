import React, { useState, useEffect } from "react";
import { useGetAllProductsQuery } from "../redux/productsApi";
import { Product } from "../types/types";
import { Grid, Slider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

interface SearchProps {
  searchQuery: string;
}

const Search = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/${searchQuery}`);
      console.log(searchQuery, "searchQuery");
    } else {
      navigate("/products");
    }
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSearch}>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={inputHandler}
        />

        <Link to={`/products/${searchQuery}`}>
          <button>Submit</button>
        </Link>
      </div>
    </form>
  );
};

export default Search;
