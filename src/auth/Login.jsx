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
      const newError = error.response.data.errors;
      console.log("isi new error", newError);

      const errorObj = {};

      newError.forEach((item) => {
        const namaField = Object.keys(item)[0];
        const pesan = item[namaField];

        if (!errorObj[namaField]) {
          errorObj[namaField] = [];
        }
        errorObj[namaField].push(pesan);
      });

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
    <div>
      <form onSubmit={submitLogin}>
        <div>
          <input
            type="text"
            name="username"
            value={formLogin.username}
            placeholder="Input username"
            onChange={handleLogin}
            className={errors.username ? "border-red-500" : ""}
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
          <input
            type="password"
            name="password"
            value={formLogin.password}
            placeholder="Input Password"
            onChange={handleLogin}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <div className="text-red-500 text-sm mt-1">
              {errors.password.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          )}
        </div>

        <button type="submit">Login</button>
      </form>
      <button onClick={toggleRegist}>Register</button>
    </div>
  );
};

export default Login;
