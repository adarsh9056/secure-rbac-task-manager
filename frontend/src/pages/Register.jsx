import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { isTokenExpired } from "../utils/auth";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password
      });
      setMessage({ type: "success", text: "Registration successful. Please login." });
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">Create account</h1>
        <input
          className="w-full border rounded-lg px-3 py-2"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          className="w-full border rounded-lg px-3 py-2"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          className="w-full border rounded-lg px-3 py-2"
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={onChange}
          required
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {message.text ? (
          <p className={`text-sm ${message.type === "error" ? "text-red-600" : "text-emerald-600"}`}>{message.text}</p>
        ) : null}
        <p className="text-sm text-slate-600">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
