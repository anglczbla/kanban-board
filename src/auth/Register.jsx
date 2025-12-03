import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BE_URL;
  const [formRegist, setFormRegist] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState(null);
  console.log("isi errors", errors);

  const handleRegist = (e) => {
    const { name, value } = e.target;
    setFormRegist({ ...formRegist, [name]: value });
  };

  const registrasi = useMutation({
    mutationFn: (regist) => {
      return axios.post(backendUrl + "register", regist);
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
      const newError = {};

      newErrors.forEach((item) => {
        const namaField = Object.keys(item)[0];
        console.log("isi nama field", namaField);
        const pesan = item[namaField];
        console.log("isi pesan", pesan);

        if (!errorBaru[namaField]) {
          newError[namaField] = [];
        } else {
          newError[namaField].push(pesan);
        }
      });

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
    <div>
      {errors !== null && errors.length > 0 ? (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Gagal registrasi:</p>
          <ul className="list-disc list-inside mt-2">
            {errors.map((err, index) => (
              <li key={index}>{Object.values(err).join(", ")}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <form onSubmit={registUser}>
        <input
          type="email"
          name="email"
          value={formRegist.email}
          placeholder="Input Email"
          onChange={handleRegist}
        />
        <input
          type="password"
          name="password"
          value={formRegist.password}
          placeholder="Input Password"
          onChange={handleRegist}
        />
        <input
          type="text"
          name="username"
          value={formRegist.username}
          placeholder="Input Username"
          onChange={handleRegist}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
