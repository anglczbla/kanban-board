import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./api";

const Login = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BE_URL;
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  });
  const [errors, SetErrors] = useState(null);
  console.log("isi errors", errors);

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
      const newError = error.response.data.message;
      console.log("isi new error", newError);

      SetErrors(newError);
      alert("failed login");
    },
  });

  const submitLogin = (e) => {
    e.preventDefault();
    SetErrors(null);
    loginUser.mutate(formLogin);
  };

  return (
    <div>
      {errors !== null && errors.length > 0 ? (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Gagal login:</p>
          {errors}
        </div>
      ) : null}
      <form onSubmit={submitLogin}>
        <input
          type="text"
          name="username"
          value={formLogin.username}
          placeholder="Input username"
          onChange={handleLogin}
        />
        <input
          type="password"
          name="password"
          value={formLogin.password}
          placeholder="Input Password"
          onChange={handleLogin}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
