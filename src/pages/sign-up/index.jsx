import { TextField } from "@mui/material";
import React, { useState } from "react";
import { auth } from "../../service";
import VerifyCodeModal from "../../components/VerifyCodeModal";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Index = () => {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      validatePassword(value);
    } else if (name === "phone_number") {
      validatePhoneNumber(value);
    }
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= minLength;

    const isValidPassword = hasUpperCase && hasNumber && isValidLength;
    setPasswordError(!isValidPassword);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const isValidUzbekPhoneNumber = /^(\+998)?\d{9}$/.test(phoneNumber);
    setPhoneError(!isValidUzbekPhoneNumber);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await auth.sign_up(form);
      if (response.status === 200) {
        setModalOpen(true);
        toast.info("Email ga kod yuborildi!", {});
        localStorage.setItem("email", form.email);
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.error);
        toast.error("Nimadir xato ketdi!", {});
        console.log(data.error);
      } else {
        console.log("Signup failed");
        toast.error("Nimadir xato ketdi!", {});
      }
    } catch (error) {
      console.log("Error during signup:", error);
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const moveRegister = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg">
        <VerifyCodeModal isOpen={modalOpen} toggle={toggleModal} />
        <div className="card mb-4">
          <h1 className="text-2xl border-none font-bold text-center text-gray-800">
            Sign-Up
          </h1>
        </div>
        <div className="login_body w-full">
          <form
            className="space-y-2 md:space-y-4"
            id="submit"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="Email"
              name="email"
              onChange={handleChange}
              type="text"
              id="email"
              className="my-2"
              required
            />
            <TextField
              fullWidth
              label="Fullname"
              name="full_name"
              onChange={handleChange}
              type="text"
              id="full_name"
              className="my-2"
              required
            />
            <div className="my-2">
              <TextField
                fullWidth
                label="Password"
                name="password"
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                id="password"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <p
                className={`text-xs text-rose-600 ${
                  passwordError ? "flex" : "hidden"
                }`}
              >
                Parolda kamida bitta katta harf va raqam qatnashgan bo'lishi
                shart!
              </p>
            </div>
            <div className="my-2">
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                onChange={handleChange}
                type="text"
                id="phone_number"
                required
                className="mt-2"
              />
              <p
                className={`text-xs text-rose-600 ${
                  phoneError ? "flex" : "hidden"
                }`}
              >
                Faqat O'zbek raqamlari ro'yxatdan o'tishi mumkin
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <a
                onClick={moveRegister}
                href="#"
                className="text-blue-500 hover:underline text-center w-1/4 mx-auto"
              >
                Login
              </a>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                SignUp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
