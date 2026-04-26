import { useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "At least one uppercase letter required";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "At least one lowercase letter required";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "At least one number required";
    }

    return newErrors;
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/login", "POST", form);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-400 via-pink-400 to-indigo-500 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          🔐 Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setErrors({ ...errors, email: "" });
          }}
          className={`w-full p-3 mb-2 border rounded-lg outline-none ${
            errors.email
              ? "border-red-500"
              : "focus:ring-2 focus:ring-purple-400"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">
            {errors.email}
          </p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
            setErrors({ ...errors, password: "" });
          }}
          className={`w-full p-3 mb-2 border rounded-lg outline-none ${
            errors.password
              ? "border-red-500"
              : "focus:ring-2 focus:ring-purple-400"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg transition ${
            loading
              ? "bg-gray-400"
              : "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-500">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}