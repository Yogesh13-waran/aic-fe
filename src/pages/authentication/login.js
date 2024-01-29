import React, { useState } from "react";
import LogoImage from "../../assets/aictec.png";
import "./login.css";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    setName(e.target.value);
  };

  // handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    if (name.length > 2) {
      try {
        const response = await axios.post("http://localhost:7000/login", {
          name: name,
        });

        // Handle the response accordingly
        message.success(response.data.message);

        // Store credentials in local storage
        localStorage.setItem(
          "credentials",
          JSON.stringify(response.data.response)
        );

        navigate("/calendar");
        // You may want to redirect or perform other actions here
      } catch (error) {
        // Handle errors, e.g., display an error message
        if (error.response.status === 400) {
          message.error(error.response.data.message);
          navigate("/register");
        }
        if (error.response.status === 500) {
          message.error("Something went wrong. Try again later");
        }
      }
    } else {
      message.warning(
        "Please enter a valid name. It should be at least 3 letters"
      );
      return;
    }
  };

  return (
    <>
      <div className="loginOutline">
        <img src={LogoImage} alt="logoImage" />
        <form onSubmit={handleLoginSubmit}>
          <input
            className="login-input"
            value={name}
            onChange={handleLogin}
            placeholder="Enter your name"
          />
          <br />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
