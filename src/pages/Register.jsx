import { useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

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
      await apiRequest("/register", "POST", form);
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-purple-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">📝 Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          className={`w-full p-2 mb-2 border rounded-lg focus:outline-none ${
            errors.name ? "border-red-500" : "focus:ring-2 focus:ring-purple-400"
          }`}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            setErrors({ ...errors, name: "" });
          }}
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          className={`w-full p-2 mb-2 border rounded-lg focus:outline-none ${
            errors.email ? "border-red-500" : "focus:ring-2 focus:ring-purple-400"
          }`}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setErrors({ ...errors, email: "" });
          }}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          className={`w-full p-2 mb-2 border rounded-lg focus:outline-none ${
            errors.password ? "border-red-500" : "focus:ring-2 focus:ring-purple-400"
          }`}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
            setErrors({ ...errors, password: "" });
          }}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded-lg transition ${
            loading ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-purple-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}