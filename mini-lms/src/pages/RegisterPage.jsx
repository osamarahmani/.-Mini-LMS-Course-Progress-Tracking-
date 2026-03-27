import { useState } from "react";
import { register } from "../api";

function RegisterPage({ setUser, setIsRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await register(form);

      if (res && res._id) {
        localStorage.setItem("user", JSON.stringify(res)); // ✅ STORE USER
        setUser(res); // ✅ LOGIN AFTER REGISTER
      } else {
        alert(res?.message || "Registration failed");
      }
    } catch (err) {
      alert("Registration failed. Try again."); // ✅ ERROR HANDLING
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => setIsRegister(false)}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;