import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./api";

const Login = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showRegist, setShowRegist] = useState(false);
  console.log("isi errors", errors);

  useEffect(() => {
    if (showRegist == true) {
      navigate("/register");
    }
  }, [showRegist]);

  const handleLogin = (e) => {
    const { name, value } = e.target;
    setFormLogin({ ...formLogin, [name]: value });
  };

  const loginUser = useMutation({
    mutationFn: (formLogin) => {
      return axiosInstance.post("/users/login", formLogin);
    },
    onSuccess: () => {
      alert("login success");
      navigate("/todo");
      queryClient.invalidateQueries({ queryKey: ["login"] });

      setFormLogin({
        username: "",
        password: "",
      });
    },
    onError: (error) => {
      console.error(error);
      const newError = error.response?.data?.errors;
      console.log("isi new error", newError);

      const errorObj = {};

      if (newError) {
        newError.forEach((item) => {
          const namaField = Object.keys(item)[0];
          const pesan = item[namaField];

          if (!errorObj[namaField]) {
            errorObj[namaField] = [];
          }
          errorObj[namaField].push(pesan);
        });
      }

      setErrors(errorObj);
      alert("failed login");
    },
  });

  const submitLogin = (e) => {
    e.preventDefault();
    setErrors({});
    loginUser.mutate(formLogin);
  };

  const toggleRegist = () => {
    setShowRegist(!showRegist);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login
        </h2>
        <form onSubmit={submitLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formLogin.username}
              placeholder="Enter your username"
              onChange={handleLogin}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <div className="text-red-500 text-sm mt-1">
                {errors.username.map((msg, index) => (
                  <p key={index}>{msg}</p>
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
              value={formLogin.password}
              placeholder="Enter your password"
              onChange={handleLogin}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {errors.password.map((msg, index) => (
                  <p key={index}>{msg}</p>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={toggleRegist}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
