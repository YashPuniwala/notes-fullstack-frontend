import "./App.css";
import Welcome from "./components/welcome";
import Login from "./components/login";
import Register from "./components/register"
import Header from "./components/header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useGetUserQuery } from "./redux/userApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/reducer/userReducer";
import { RootState } from "./redux/store";
import axios from "axios";
import Notes from "./components/notes";
import Products from "./components/products";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  const { data: userData } = useGetUserQuery();
  const user = useSelector((state: RootState) => state.user.user); // Provide RootState type
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  ); // Access isAuthenticated from Redux state
  // const isAuthenticated = !!user; // Update isAuthenticated based on the presence of user

  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData?.user));
    } else {
      console.log("Not authenticated for App.tsx")
    }
  }, [dispatch, userData]);
  console.log(user, "user app")
  console.log(userData, "userData app")
  const refreshToken = async () => {
    try {
      const res = await axios.get("https://notes-fullstack-xgv2.onrender.com/api/refresh", {
        withCredentials: true,
      });
      const data = res?.data;
      console.log(data, "refresh");
      return data;
    } catch (error) {
      console.log("Error refreshing token:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      if (userData?.user) {
        // Check if userData.user is not undefined
        await dispatch(setUser(userData.user));
      }
    };

    fetchUserData();

    if (userData) {
      const intervalId = setInterval(async () => {
        const refreshedData = await refreshToken();
        if (!refreshedData) {
          clearInterval(intervalId);
        } else {
          if (userData.user) {
            // Check if userData.user is not undefined
            await dispatch(setUser(userData.user));
          }
        }
      }, 1000 * 60 * 4);

      return () => clearInterval(intervalId);
    } else {
      console.log("Something");
    }
  }, [dispatch, userData]);

  if (isAuthenticated) {
    console.log(user, "user");
  } else {
    console.log("Not Authenticated!");
  }

  const [searchQuery, setSearchQuery] = useState(""); // State for search query


  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Header user={user} setSearchQuery={setSearchQuery}/>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={user ? true : false}>
                  <Welcome user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute
                  isAuthenticated={user ? false : true}
                  redirect="/"
                >
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute
                  isAuthenticated={user ? false : true}
                  redirect="/"
                >
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute isAuthenticated={user ? true : false}>
                  <Notes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute
                  isAuthenticated={user ? true : false}
                  adminRoute={true}
                  isAdmin={user?.role === "admin" ? true : false}
                >
                  <Products searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
