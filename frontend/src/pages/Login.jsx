import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";


export default function Login() {
   const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();

  const res = await API.post("/auth/login", { email, password });

  // 🔥 clear old data
  localStorage.clear();

  // 🔥 normalize role to lowercase
  const role = res.data.user.role.toLowerCase();

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", role);

  if (role === "donor") {
    navigate("/donor");
  } else if (role === "ngo") {
    navigate("/ngo");
  } else {
    navigate("/");
  }
};




  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Food Saver 🍱</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />
        <p
  onClick={() => navigate("/forgot-password")}
  className="text-right text-sm text-blue-600 cursor-pointer hover:underline mb-3"
>
  Forgot password?
</p>


        <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
          Login
        </button>
        <p className="text-center text-sm mt-4">
  Don’t have an account?{" "}
  <span
    onClick={() => navigate("/register")}
    className="text-green-600 font-semibold cursor-pointer hover:underline"
  >
    Register
  </span>
</p>

      </form>
    </div>
  );
}
