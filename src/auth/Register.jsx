import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./api";

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formRegist, setFormRegist] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [errors, setErrors] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (showLogin == true) {
      navigate("/");
    }
  });

  const handleRegist = (e) => {
    const { name, value } = e.target;
    setFormRegist({ ...formRegist, [name]: value });
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const registrasi = useMutation({
    mutationFn: (regist) => {
      return axiosInstance.post("/users/register", regist);
    },
    onSuccess: () => {
      alert("registration success");
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["regist"] });
      setFormRegist({
        email: "",
        password: "",
        username: "",
      });
    },
    onError: (error) => {
      console.error(error);
      const newErrors = error.response?.data?.errors;
      console.log("isi errors dari backend:", newErrors);

      const newError = {};

      if (newErrors) {
        newErrors.forEach((item) => {
          const namaField = Object.keys(item)[0];
          const pesan = item[namaField];

          console.log("field:", namaField, "| pesan:", pesan);

          if (!newError[namaField]) {
            newError[namaField] = [];
          }
          newError[namaField].push(pesan);
        });
      }

      console.log("error setelah transform:", newError);
      setErrors(newError);
      alert("failed regist");
    },
  });

  const registUser = (e) => {
    e.preventDefault();
    setErrors(null);
    registrasi.mutate(formRegist);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Register
        </h2>
        <form onSubmit={registUser} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formRegist.email}
              placeholder="Enter your email"
              onChange={handleRegist}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors?.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors?.email && (
              <div className="text-red-500 text-sm mt-1">
                {errors.email.map((msg, idx) => (
                  <div key={idx}>• {msg}</div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formRegist.password}
              placeholder="Create a password"
              onChange={handleRegist}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors?.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors?.password && (
              <div className="text-red-500 text-sm mt-1">
                {errors.password.map((msg, idx) => (
                  <div key={idx}>• {msg}</div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formRegist.username}
              placeholder="Choose a username"
              onChange={handleRegist}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors?.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors?.username && (
              <div className="text-red-500 text-sm mt-1">
                {errors.username.map((msg, idx) => (
                  <div key={idx}>• {msg}</div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={toggleLogin}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
