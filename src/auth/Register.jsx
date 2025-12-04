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
      const newErrors = error.response.data.errors;
      console.log("isi errors dari backend:", newErrors);

      const newError = {};

      newErrors.forEach((item) => {
        const namaField = Object.keys(item)[0];
        const pesan = item[namaField];

        console.log("field:", namaField, "| pesan:", pesan);

        if (!newError[namaField]) {
          newError[namaField] = [];
        }
        newError[namaField].push(pesan);
      });

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
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={registUser} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            value={formRegist.email}
            placeholder="Input Email"
            onChange={handleRegist}
            className={`border p-2 w-full rounded ${
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
          <input
            type="password"
            name="password"
            value={formRegist.password}
            placeholder="Input Password"
            onChange={handleRegist}
            className={`border p-2 w-full rounded ${
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
          <input
            type="text"
            name="username"
            value={formRegist.username}
            placeholder="Input Username"
            onChange={handleRegist}
            className={`border p-2 w-full rounded ${
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
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      <button onClick={toggleLogin}>Already Regist?</button>
    </div>
  );
};

export default Register;
