import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../assets/aictec.png";
import "./register.css";
import axios from "axios";
import { message } from "antd";

const Register = () => {
  const url="http://35.154.36.162:3103"

  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    setName(e.target.value);
  };

  // handle registration submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    if (name.length > 2) {
      try {
        const response = await axios.post(`${url}/register`, {
          name: name,
        });

        // Handle the response accordingly
        message.success(response.data.message);

        // You may want to redirect or perform other actions here
        navigate("/");
      } catch (error) {
        // Handle errors, e.g., display an error message
        if (error.response.status === 400) {
          message.error(error.response.data.message);
          navigate('/')
        }
        if (error.response.status === 500) {
          message.error("Something went wrong. Try again later");
        }
      }
    } else {
      message.warning("Please enter a valid name. It should be at least 3 letters");
      return;
    }
  };

  return (
    <>
      <div className="loginOutline">
        <img src={LogoImage} alt="logoImage" />
        <form onSubmit={handleRegisterSubmit}>
          <input
            className="login-input"
            value={name}
            onChange={handleLogin}
            placeholder="Enter your name"
          />
          <br />
          <button type="submit" className="login-btn">
            Signup
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
