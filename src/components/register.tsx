import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "../redux/userApi";
import { User } from "../types/types";
import { setUser } from "../redux/reducer/userReducer";
import { MessageResponse, UserResponse } from "../types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// import { useLoginMutation } from "../redux/userApi";
// import {setUser} from "../redux/reducer/userReducer"

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const registerResult = await register({ name, email, password, role });

      if ("data" in registerResult) {
        const { user } = registerResult.data;
        dispatch(setUser(user));
        console.log("Register successful!");
        navigate("/notes");
      } else {
        console.error("Login failed:", registerResult.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Register</h3>
      <label>Name</label>
      <input
        type="text"
        name="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Email</label>
      <input
        type="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password</label>
      <input
        type="password"
        name="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label>Role</label>
      <input
        type="text"
        name="role"
        required
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Login;
