import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux"
import { useLoginMutation } from "../redux/userApi";
import { User } from "../types/types";
import { setUser } from "../redux/reducer/userReducer";
import { MessageResponse, UserResponse } from "../types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// import { useLoginMutation } from "../redux/userApi";
// import {setUser} from "../redux/reducer/userReducer"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loginResult = await login({ email, password });
      
      if ("data" in loginResult) {
        const { user } = loginResult.data;
        dispatch(setUser(user));
        console.log("Login successful!");
        navigate("/notes");
      } else {
        console.error("Login failed:", loginResult.error);
        if ('status' in loginResult.error) {
          console.error('Error status:', loginResult.error.status);
          console.error('Error data:', loginResult.error.data);
        } else {
          console.error('Error:', loginResult.error.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Login</h3>
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

      <button type="submit">Submit</button>
    </form>
  );
};

export default Login;
