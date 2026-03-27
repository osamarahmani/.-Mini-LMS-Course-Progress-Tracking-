import { useState } from "react";
import { login } from "../api";

function LoginPage({ setUser, setIsRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password"); // ✅ VALIDATION
      return;
    }

    try {
      const res = await login({ email, password });

      if (res && res._id) {
        localStorage.setItem("user", JSON.stringify(res)); // ✅ STORE USER
        setUser(res); // ✅ UPDATE STATE
      } else {
        alert(res?.message || "Invalid credentials"); // ✅ BETTER ERROR
      }
    } catch (err) {
      alert("Login failed. Try again."); // ✅ ERROR HANDLING
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={email} // ✅ FIX
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password} // ✅ FIX
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => setIsRegister(true)}
            className="text-blue-500 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;